export interface UploadMediaResult {
  ok: boolean;
  url?: string;
  name?: string;
  storage?: "firebase" | "firestore" | "local";
  size?: number;
  error?: string;
}

const MAX_IMAGE_WIDTH = 1920;
const MAX_IMAGE_HEIGHT = 1920;
const COMPRESS_THRESHOLD_BYTES = 350 * 1024; // 350 KB

/**
 * Büyük raster görselleri tarayıcıda kalite kaybı olmadan WebP/JPEG olarak optimize eder.
 * Böylece Vercel 4.5 MB limitine takılmadan 15-20 MB kamera fotoğrafları bile anında yüklenir.
 */
async function optimizeImageIfNeeded(file: File): Promise<File> {
  if (typeof window === "undefined") return file;

  const type = (file.type || "").toLowerCase();
  const isRasterImage =
    type.startsWith("image/") &&
    !type.includes("svg") &&
    !type.includes("gif");

  if (!isRasterImage) return file;

  // Küçük görselleri olduğu gibi gönder
  if (file.size <= COMPRESS_THRESHOLD_BYTES) return file;

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Dosya okunamadı"));
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Görsel çözümlenemedi"));
      el.src = dataUrl;
    });

    let { width, height } = img;
    if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
      const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);
      width = Math.max(1, Math.round(width * ratio));
      height = Math.max(1, Math.round(height * ratio));
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const preferWebp = true;
    const tryBlob = (mime: string, quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mime, quality));

    let blob = await tryBlob(preferWebp ? "image/webp" : "image/jpeg", 0.85);
    let outMime = blob?.type || "image/webp";

    // WebP desteklenmiyorsa JPEG'e düş
    if (!blob || (preferWebp && outMime !== "image/webp")) {
      blob = await tryBlob("image/jpeg", 0.85);
      outMime = "image/jpeg";
    }

    // Hâlâ 900 KB üzerindeyse bir kademe daha sıkıştır
    if (blob && blob.size > 900 * 1024) {
      const smaller = await tryBlob(outMime, 0.72);
      if (smaller && smaller.size < blob.size) {
        blob = smaller;
      }
    }

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const ext = outMime === "image/webp" ? ".webp" : ".jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "") || "gorsel";
    return new File([blob], `${baseName}${ext}`, {
      type: outMime,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export async function uploadMedia(
  file: File,
  options?: { targetPath?: string; skipOptimize?: boolean },
): Promise<UploadMediaResult> {
  try {
    const prepared = options?.skipOptimize ? file : await optimizeImageIfNeeded(file);

    const formData = new FormData();
    formData.append("file", prepared);
    if (options?.targetPath) {
      formData.append("targetPath", options.targetPath);
    }

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (res.status === 413) {
      return {
        ok: false,
        error: "Dosya boyutu sunucu limitini aşıyor (maks. 4 MB). Daha küçük bir dosya deneyin.",
      };
    }

    const rawText = await res.text();
    let data: UploadMediaResult | null = null;
    try {
      data = JSON.parse(rawText) as UploadMediaResult;
    } catch {
      return {
        ok: false,
        error: `Sunucu beklenmeyen bir yanıt döndürdü (HTTP ${res.status}).`,
      };
    }

    if (!res.ok || !data?.ok) {
      return {
        ok: false,
        error: data?.error || `Yükleme başarısız (HTTP ${res.status}).`,
      };
    }

    return data;
  } catch {
    return {
      ok: false,
      error: "Yükleme sırasında bağlantı hatası oluştu. İnternet bağlantınızı kontrol edin.",
    };
  }
}
