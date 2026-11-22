import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { getAdminStorageBucket } from "@/lib/firebase-admin";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".pdf"]);

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

async function requireAdmin() {
  const user = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }
  return null;
}

function safeResolvePublic(relativeUrl: string): { fullPath: string; cleanRel: string } | null {
  const cleanUrl = relativeUrl.split("?")[0].trim();
  if (!cleanUrl.startsWith("/")) return null;
  const normalized = path.posix.normalize(cleanUrl);
  if (normalized.includes("..")) return null;
  const publicRoot = path.resolve(process.cwd(), "public");
  const fullPath = path.resolve(publicRoot, normalized.replace(/^\/+/, ""));
  if (!fullPath.startsWith(publicRoot + path.sep)) return null;
  return { fullPath, cleanRel: normalized };
}

function buildFirebaseDownloadUrl(bucketName: string, objectPath: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}

function extractStorageObjectPath(rawPath: string): string | null {
  const trimmed = rawPath.trim();
  if (trimmed.startsWith("uploads/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "firebasestorage.googleapis.com") {
      const match = parsed.pathname.match(/\/o\/(.+)$/);
      if (match?.[1]) {
        const decoded = decodeURIComponent(match[1]);
        if (decoded.startsWith("uploads/")) return decoded;
      }
    }
  } catch {
    // not a URL
  }
  return null;
}

export async function GET() {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  const bucket = getAdminStorageBucket();
  if (bucket) {
    try {
      const [storageFiles] = await bucket.getFiles({ prefix: "uploads/" });
      const files = await Promise.all(
        storageFiles
          .filter((f) => {
            const base = path.posix.basename(f.name);
            return base && ALLOWED_EXTENSIONS.has(path.posix.extname(base).toLowerCase());
          })
          .map(async (f) => {
            const [meta] = await f.getMetadata();
            const fileName = path.posix.basename(f.name);
            const displayName = fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ");
            const existingTokens = (meta.metadata?.firebaseStorageDownloadTokens as string | undefined) || "";
            let token = existingTokens.split(",")[0]?.trim();
            if (!token) {
              token = crypto.randomUUID();
              await f.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
            }
            const size = Number(meta.size || 0);
            const modifiedAt = String(meta.updated || meta.timeCreated || new Date().toISOString());
            return {
              id: `upload-${fileName}`,
              name: displayName || fileName,
              fileName,
              path: buildFirebaseDownloadUrl(bucket.name, f.name, token),
              category: "uploaded" as const,
              size,
              modifiedAt,
              desc: `Yüklenen Görsel (${Math.max(1, Math.round(size / 1024))} KB)`,
            };
          }),
      );

      files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
      return NextResponse.json({ ok: true, files, storage: "firebase" });
    } catch (error) {
      console.error("Firebase Storage listeleme hatası:", error);
      return NextResponse.json({ error: "Medya dosyaları okunamadı." }, { status: 500 });
    }
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const entries = await readdir(uploadsDir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile() && ALLOWED_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
        .map(async (e) => {
          const full = path.join(uploadsDir, e.name);
          const info = await stat(full);
          const displayName = e.name.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ");
          return {
            id: `upload-${e.name}`,
            name: displayName || e.name,
            fileName: e.name,
            path: `/uploads/${e.name}`,
            category: "uploaded" as const,
            size: info.size,
            modifiedAt: info.mtime.toISOString(),
            desc: `Yüklenen Görsel (${Math.max(1, Math.round(info.size / 1024))} KB)`,
          };
        }),
    );

    files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
    return NextResponse.json({ ok: true, files, storage: "local" });
  } catch (error) {
    console.error("Medya listeleme hatası:", error);
    return NextResponse.json({ error: "Medya dosyaları okunamadı." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("targetPath") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Sadece görsel (JPG, PNG, WEBP, SVG) veya PDF dosyaları yüklenebilir." },
        { status: 400 },
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 25 MB'den küçük olmalıdır." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || MIME_BY_EXT[ext] || "application/octet-stream";

    const bucket = getAdminStorageBucket();
    if (bucket) {
      const existingStoragePath = targetPath ? extractStorageObjectPath(targetPath) : null;
      const base = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase()
        .slice(0, 60);
      const objectPath = existingStoragePath || `uploads/${Date.now()}-${base || "gorsel"}${ext}`;
      const token = crypto.randomUUID();

      await bucket.file(objectPath).save(buffer, {
        contentType,
        metadata: {
          cacheControl: "public, max-age=31536000",
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        url: buildFirebaseDownloadUrl(bucket.name, objectPath, token),
        name: file.name.replace(/\.[^/.]+$/, ""),
        storage: "firebase",
      });
    }

    let relativeUrl = "";

    if (targetPath && (targetPath.startsWith("/images/") || targetPath.startsWith("/uploads/"))) {
      const resolved = safeResolvePublic(targetPath);
      if (!resolved) {
        return NextResponse.json({ error: "Geçersiz hedef dosya yolu." }, { status: 400 });
      }
      await mkdir(path.dirname(resolved.fullPath), { recursive: true });
      await writeFile(resolved.fullPath, buffer);
      relativeUrl = `${resolved.cleanRel}?t=${Date.now()}`;
    } else {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const base = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase()
        .slice(0, 60);
      const fileName = `${Date.now()}-${base || "gorsel"}${ext}`;
      const fullPath = path.join(uploadsDir, fileName);

      await writeFile(fullPath, buffer);
      relativeUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      ok: true,
      url: relativeUrl,
      name: file.name.replace(/\.[^/.]+$/, ""),
      storage: "local",
    });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  try {
    const urlObj = new URL(req.url);
    let targetPath = urlObj.searchParams.get("path") || "";
    if (!targetPath) {
      const body = (await req.json().catch(() => null)) as { path?: string } | null;
      targetPath = body?.path || "";
    }

    const storageObjectPath = extractStorageObjectPath(targetPath);
    const bucket = getAdminStorageBucket();
    if (storageObjectPath && bucket) {
      await bucket.file(storageObjectPath).delete({ ignoreNotFound: true });
      return NextResponse.json({ ok: true, deleted: storageObjectPath, storage: "firebase" });
    }

    if (!targetPath || !targetPath.split("?")[0].startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "Sadece yönetim panelinden yüklenen fotoğraflar silinebilir." },
        { status: 400 },
      );
    }

    const resolved = safeResolvePublic(targetPath);
    if (!resolved) {
      return NextResponse.json({ error: "Geçersiz dosya yolu." }, { status: 400 });
    }

    try {
      await unlink(resolved.fullPath);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code !== "ENOENT") throw err;
    }

    return NextResponse.json({ ok: true, deleted: resolved.cleanRel, storage: "local" });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Dosya silinirken bir hata oluştu." }, { status: 500 });
  }
}
