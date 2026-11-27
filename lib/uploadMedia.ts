export interface UploadMediaResult {
  ok: boolean;
  url?: string;
  name?: string;
  storage?: "firebase" | "firestore" | "local";
  size?: number;
  error?: string;
}

const MAX_IMAGE_WIDTH = 2560;
const MAX_IMAGE_HEIGHT = 2560;
const COMPRESS_THRESHOLD_BYTES = 1500 * 1024; // 1.5 MB altındaki görsellere hiç dokunma

const HQ_MAX_WIDTH = 3840;
const HQ_MAX_HEIGHT = 3840;
const HQ_SAFE_LIMIT_BYTES = 3.8 * 1024 * 1024; // 3.8 MB altı slayt afişleri %100 orijinal kalitede yüklenir

/**
 * Büyük raster görselleri tarayıcıda yüksek kaliteyi koruyarak optimize eder.
 * highQuality=true (slayt/afişler) için 3.8 MB altındaki dosyalar hiç sıkıştırılmadan %100 orijinal yüklenir.
 */
async function optimizeImageIfNeeded(file: File, highQuality = false): Promise<File> {
  if (typeof window === "undefined") return file;

  const type = (file.type || "").toLowerCase();
  const isRasterImage =
    type.startsWith("image/") &&
    !type.includes("svg") &&
    !type.includes("gif");

  if (!isRasterImage) return file;

  const threshold = highQuality ? HQ_SAFE_LIMIT_BYTES : COMPRESS_THRESHOLD_BYTES;
  if (file.size <= threshold) return file;

  const maxW = highQuality ? HQ_MAX_WIDTH : MAX_IMAGE_WIDTH;
  const maxH = highQuality ? HQ_MAX_HEIGHT : MAX_IMAGE_HEIGHT;

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
    if (width > maxW || height > maxH) {
      const ratio = Math.min(maxW / width, maxH / height);
      width = Math.max(1, Math.round(width * ratio));
      height = Math.max(1, Math.round(height * ratio));
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    const tryBlob = (mime: string, quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mime, quality));

    const firstQuality = highQuality ? 0.96 : 0.93;
    const fallbackQuality = highQuality ? 0.92 : 0.88;
    const sizeLimit = highQuality ? HQ_SAFE_LIMIT_BYTES : 1800 * 1024;

    let blob = await tryBlob("image/webp", firstQuality);
    let outMime = blob?.type || "image/webp";

    // WebP desteklenmiyorsa JPEG'e düş
    if (!blob || outMime !== "image/webp") {
      blob = await tryBlob("image/jpeg", firstQuality);
      outMime = "image/jpeg";
    }

    // Hâlâ limit üzerindeyse çok hafif bir kademe düşür
    if (blob && blob.size > sizeLimit) {
      const smaller = await tryBlob(outMime, fallbackQuality);
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
  options?: { targetPath?: string; skipOptimize?: boolean; highQuality?: boolean },
): Promise<UploadMediaResult> {
  try {
    const prepared = options?.skipOptimize
      ? file
      : await optimizeImageIfNeeded(file, Boolean(options?.highQuality));

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
