import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { COLLECTIONS, getDb } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = decodeURIComponent(params.id || "").trim();
  if (!id || id.includes("/") || id.includes("..")) {
    return new NextResponse("Geçersiz dosya kimliği.", { status: 400 });
  }

  try {
    interface MediaMeta {
      contentType?: string;
      data?: string;
      chunkCount?: number;
      fileName?: string;
    }
    let meta: MediaMeta | null = null;
    let base64 = "";

    const adminDb = getAdminDb();
    if (adminDb) {
      const snap = await adminDb.collection(COLLECTIONS.media).doc(id).get();
      if (snap.exists) {
        meta = (snap.data() as MediaMeta | undefined) ?? null;
        const chunkCount = Number(meta?.chunkCount || 1);
        if (chunkCount > 1) {
          const chunkSnaps = await Promise.all(
            Array.from({ length: chunkCount }, (_, i) =>
              adminDb.collection(COLLECTIONS.mediaChunks).doc(`${id}_${i}`).get(),
            ),
          );
          for (const cs of chunkSnaps) {
            if (!cs.exists) return new NextResponse("Medya parçası eksik.", { status: 404 });
            base64 += String((cs.data() as { data?: string } | undefined)?.data || "");
          }
        } else {
          base64 = String(meta?.data || "");
        }
      }
    }

    if (!meta) {
      const db = getDb();
      if (!db) {
        return new NextResponse("Medya veritabanı yapılandırılmamış.", { status: 503 });
      }
      const snap = await getDoc(doc(db, COLLECTIONS.media, id));
      if (!snap.exists()) {
        return new NextResponse("Medya dosyası bulunamadı.", { status: 404 });
      }
      meta = snap.data() as MediaMeta;
      const chunkCount = Number(meta?.chunkCount || 1);
      if (chunkCount > 1) {
        const chunkSnaps = await Promise.all(
          Array.from({ length: chunkCount }, (_, i) =>
            getDoc(doc(db, COLLECTIONS.mediaChunks, `${id}_${i}`)),
          ),
        );
        for (const cs of chunkSnaps) {
          if (!cs.exists()) return new NextResponse("Medya parçası eksik.", { status: 404 });
          base64 += String((cs.data() as { data?: string }).data || "");
        }
      } else {
        base64 = String(meta?.data || "");
      }
    }

    if (!base64) {
      return new NextResponse("Medya içeriği boş.", { status: 404 });
    }

    const buffer = Buffer.from(base64, "base64");
    const contentType = meta?.contentType || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Medya sunum hatası:", error);
    return new NextResponse("Medya yüklenirken hata oluştu.", { status: 500 });
  }
}
