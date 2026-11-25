import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { COLLECTIONS, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { getAdminStorageBucket } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".pdf",
]);

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

const MAX_SINGLE_DOC_BASE64 = 700_000; // ~525 KB raw binary, safely under Firestore's 1 MiB doc limit
const CHUNK_SIZE = 650_000;

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

function extractFirestoreMediaId(rawPath: string): string | null {
  const clean = rawPath.split("?")[0].trim();
  const match = clean.match(/^\/api\/media\/([^/]+)$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function sanitizeBaseName(fileName: string, ext: string): string {
  return (
    path
      .basename(fileName, ext)
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase()
      .slice(0, 60) || "gorsel"
  );
}

export async function GET() {
  const authErr = await requireAdmin();
  if (authErr) return authErr;

  // 1. Firebase Storage (Admin SDK aktifse)
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
              desc: `Yüklenen Dosya (${Math.max(1, Math.round(size / 1024))} KB)`,
            };
          }),
      );

      files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
      return NextResponse.json({ ok: true, files, storage: "firebase" });
    } catch (error) {
      console.warn("Firebase Storage listeleme başarısız, Firestore'a geçiliyor:", error);
    }
  }

  // 2. Firestore Bulut Medya Deposu (Vercel + Localhost tam uyumlu)
  if (isFirebaseConfigured) {
    const db = getDb();
    if (db) {
      try {
        const snap = await getDocs(collection(db, COLLECTIONS.media));
        const files = snap.docs
          .map((d) => {
            const data = d.data() as {
              name?: string;
              fileName?: string;
              size?: number;
              modifiedAt?: string;
              contentType?: string;
            };
            const fileName = data.fileName || d.id;
            const size = Number(data.size || 0);
            const modifiedAt = String(data.modifiedAt || new Date(0).toISOString());
            const isPdf = data.contentType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
            return {
              id: `media-${d.id}`,
              name: data.name || fileName.replace(/^\d+-/, "").replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " "),
              fileName,
              path: `/api/media/${encodeURIComponent(d.id)}`,
              category: "uploaded" as const,
              size,
              modifiedAt,
              contentType: data.contentType || "image/webp",
              desc: `${isPdf ? "PDF Belge" : "Bulut Görsel"} (${Math.max(1, Math.round(size / 1024))} KB)`,
            };
          })
          .filter((f) => !f.contentType.includes("pdf")); // Galeri listesinde sadece görselleri öne çıkar

        files.sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
        return NextResponse.json({ ok: true, files, storage: "firestore" });
      } catch (error) {
        console.warn("Firestore medya listeleme hatası:", error);
      }
    }
  }

  // 3. Yerel public/uploads (Sadece yerel geliştirme ortamı için)
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
    return NextResponse.json({ ok: true, files: [], storage: "none" });
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

    const rawExt = path.extname(file.name).toLowerCase();
    const ext = rawExt || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Sadece görsel (JPG, PNG, WEBP, GIF, SVG, AVIF) veya PDF dosyaları yüklenebilir." },
        { status: 400 },
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya boyutu 15 MB'den küçük olmalıdır." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentType = file.type || MIME_BY_EXT[ext] || "application/octet-stream";
    const base = sanitizeBaseName(file.name, ext);
    const displayName = file.name.replace(/\.[^/.]+$/, "") || "Görsel";

    // 1. Öncelik: Firebase Storage (Admin SDK servis anahtarı tanımlı ve aktifse)
    const bucket = getAdminStorageBucket();
    if (bucket) {
      try {
        const existingStoragePath = targetPath ? extractStorageObjectPath(targetPath) : null;
        const objectPath = existingStoragePath || `uploads/${Date.now()}-${base}${ext}`;
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
          name: displayName,
          size: buffer.length,
          storage: "firebase",
        });
      } catch (storageErr) {
        console.warn("Firebase Storage yükleme başarısız, Firestore deposuna geçiliyor:", storageErr);
      }
    }

    // 2. Öncelik: Firestore Bulut Medya Deposu (Vercel + Localhost sorunsuz çalışır)
    if (isFirebaseConfigured) {
      const db = getDb();
      if (db) {
        const existingMediaId = targetPath ? extractFirestoreMediaId(targetPath) : null;
        const docId = existingMediaId || `${Date.now()}-${base}${ext}`;
        const base64 = buffer.toString("base64");
        const now = new Date().toISOString();

        // Eğer mevcut bir döküman üzerine yazılıyorsa eski parçaları temizle
        if (existingMediaId) {
          const prevSnap = await getDoc(doc(db, COLLECTIONS.media, existingMediaId));
          if (prevSnap.exists()) {
            const prevChunks = Number((prevSnap.data() as { chunkCount?: number }).chunkCount || 1);
            if (prevChunks > 1) {
              await Promise.all(
                Array.from({ length: prevChunks }, (_, i) =>
                  deleteDoc(doc(db, COLLECTIONS.mediaChunks, `${existingMediaId}_${i}`)),
                ),
              );
            }
          }
        }

        if (base64.length <= MAX_SINGLE_DOC_BASE64) {
          await setDoc(doc(db, COLLECTIONS.media, docId), {
            name: displayName,
            fileName: `${base}${ext}`,
            contentType,
            size: buffer.length,
            chunkCount: 1,
            data: base64,
            modifiedAt: now,
          });
        } else {
          const totalChunks = Math.ceil(base64.length / CHUNK_SIZE);
          await Promise.all(
            Array.from({ length: totalChunks }, (_, i) =>
              setDoc(doc(db, COLLECTIONS.mediaChunks, `${docId}_${i}`), {
                mediaId: docId,
                index: i,
                data: base64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
              }),
            ),
          );
          await setDoc(doc(db, COLLECTIONS.media, docId), {
            name: displayName,
            fileName: `${base}${ext}`,
            contentType,
            size: buffer.length,
            chunkCount: totalChunks,
            modifiedAt: now,
          });
        }

        const url = existingMediaId
          ? `/api/media/${encodeURIComponent(docId)}?t=${Date.now()}`
          : `/api/media/${encodeURIComponent(docId)}`;

        return NextResponse.json({
          ok: true,
          url,
          name: displayName,
          size: buffer.length,
          storage: "firestore",
        });
      }
    }

    // 3. Yedek: Yerel disk (sadece yerel geliştirme ortamında)
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
      const fileName = `${Date.now()}-${base}${ext}`;
      const fullPath = path.join(uploadsDir, fileName);
      await writeFile(fullPath, buffer);
      relativeUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      ok: true,
      url: relativeUrl,
      name: displayName,
      size: buffer.length,
      storage: "local",
    });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    const msg = error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu.";
    return NextResponse.json(
      { error: `Dosya yüklenemedi: ${msg}` },
      { status: 500 },
    );
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

    // 1. Firestore medya silme
    const mediaId = extractFirestoreMediaId(targetPath);
    if (mediaId && isFirebaseConfigured) {
      const db = getDb();
      if (db) {
        const snap = await getDoc(doc(db, COLLECTIONS.media, mediaId));
        if (snap.exists()) {
          const chunkCount = Number((snap.data() as { chunkCount?: number }).chunkCount || 1);
          if (chunkCount > 1) {
            await Promise.all(
              Array.from({ length: chunkCount }, (_, i) =>
                deleteDoc(doc(db, COLLECTIONS.mediaChunks, `${mediaId}_${i}`)),
              ),
            );
          }
          await deleteDoc(doc(db, COLLECTIONS.media, mediaId));
        }
        return NextResponse.json({ ok: true, deleted: mediaId, storage: "firestore" });
      }
    }

    // 2. Firebase Storage silme
    const storageObjectPath = extractStorageObjectPath(targetPath);
    const bucket = getAdminStorageBucket();
    if (storageObjectPath && bucket) {
      await bucket.file(storageObjectPath).delete({ ignoreNotFound: true });
      return NextResponse.json({ ok: true, deleted: storageObjectPath, storage: "firebase" });
    }

    // 3. Yerel /uploads/ silme
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
