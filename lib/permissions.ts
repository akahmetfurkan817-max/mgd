import type { AdminSection, RoleId } from "@/types";

export const ROLE_LABELS: Record<RoleId, string> = {
  SUPER_ADMIN: "Süper Admin",
  NEWS_EDITOR: "Haber Editörü",
  ORG_MANAGER: "Teşkilat Sorumlusu",
};

export const ROLE_PERMISSIONS: Record<RoleId, readonly AdminSection[]> = {
  SUPER_ADMIN: [
    "slides",
    "media",
    "layout",
    "content",
    "board",
    "pioneers",
    "news",
    "publications",
    "videos",
    "applications",
    "provinces",
    "iban",
  ],
  NEWS_EDITOR: ["slides", "media", "content", "pioneers", "news", "publications", "videos"],
  ORG_MANAGER: ["provinces", "applications"],
};

export function can(role: RoleId, section: AdminSection): boolean {
  return ROLE_PERMISSIONS[role].includes(section);
}

export const ADMIN_SECTIONS: { id: AdminSection; label: string; href: string }[] = [
  { id: "slides", label: "Manşet Slaytları & Afişler", href: "/admin/slides" },
  { id: "media", label: "Medya & Fotoğraf Galerisi", href: "/admin/media" },
  { id: "layout", label: "Sayfa Düzeni & Bloklar", href: "/admin/layout" },
  { id: "content", label: "Canlı Metinler & Sayaçlar", href: "/admin/content" },
  { id: "board", label: "Yönetim Kurulu & Kadro", href: "/admin/board" },
  { id: "pioneers", label: "Öncü Şahsiyetler", href: "/admin/pioneers" },
  { id: "videos", label: "Videolar & Video Galerisi", href: "/admin/videos" },
  { id: "news", label: "Haber Ekle / Düzenle", href: "/admin/news" },
  { id: "publications", label: "Yayınlar & E-Kütüphane", href: "/admin/publications" },
  { id: "applications", label: "Gönüllü Başvuruları", href: "/admin/applications" },
  { id: "provinces", label: "81 İl Bilgisi Düzenle", href: "/admin/provinces" },
  { id: "iban", label: "IBAN Ayarları", href: "/admin/iban" },
];

export function sectionFromPath(pathname: string): AdminSection | null {
  const seg = pathname.split("/")[2];
  return ADMIN_SECTIONS.find((s) => s.id === seg)?.id ?? null;
}
