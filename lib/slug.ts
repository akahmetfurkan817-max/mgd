/**
 * Türkçe karakterleri URL dostu SEO slug'a çevirir.
 * Örn: "Ahmet Özvatan" -> "ahmet-ozvatan"
 * Örn: "2026 - 2027 Üniversite Burs Sonuçları Açıklandı!" -> "2026-2027-universite-burs-sonuclari-aciklandi"
 */
export function slugify(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    I: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };

  return text
    .replace(/[çÇğĞıİIöÖşŞüÜ]/g, (ch) => map[ch] || ch)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
