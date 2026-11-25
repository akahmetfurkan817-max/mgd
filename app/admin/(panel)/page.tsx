import { requireUser } from "@/lib/session";
import { ADMIN_SECTIONS, ROLE_LABELS, can } from "@/lib/permissions";
import Link from "next/link";
import SeedButton from "@/components/admin/SeedButton";
import {
  ArrowRight,
  Award,
  BookOpen,
  ExternalLink,
  FolderArchive,
  Image as ImageIcon,
  Landmark,
  Layers,
  MapPin,
  Newspaper,
  ShieldAlert,
  Sliders,
  Sparkles,
  Type,
  Upload,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import type { AdminSection } from "@/types";

const SECTION_META: Record<AdminSection, { icon: typeof Newspaper; desc: string; tag: string }> = {
  slides: {
    icon: Sliders,
    tag: "Vitrin",
    desc: "Ana sayfa manşetinde dönen afişleri, burs duyurularını ve kampanyaları yönetin.",
  },
  media: {
    icon: ImageIcon,
    tag: "Bulut Medya",
    desc: "Yeni fotoğraf yükleyin, görselleri değiştirin ve tüm medya kütüphanesini yönetin.",
  },
  layout: {
    icon: Layers,
    tag: "Tasarım",
    desc: "Ana sayfadaki bölümlerin yerini sıralayın veya gizleyin.",
  },
  content: {
    icon: Type,
    tag: "İçerik",
    desc: "Sayaç sayılarını, başlıkları, iletişim bilgilerini ve kurumsal PDF'leri düzenleyin.",
  },
  board: {
    icon: Users,
    tag: "Teşkilat",
    desc: "Genel Başkan ve Başkanlık Divanı kadrosunu yönetin.",
  },
  pioneers: {
    icon: Award,
    tag: "Arşiv",
    desc: "Öncü Şahsiyetlerin videolarını, fotoğraf galerilerini, kitap/PDF eserlerini ve biyografilerini yönetin.",
  },
  news: {
    icon: Newspaper,
    tag: "Yayın",
    desc: "Genel Merkez, Üniversite ve Basın Açıklamalarını yayınlayın.",
  },
  archive: {
    icon: FolderArchive,
    tag: "Arşiv",
    desc: "Konsept, rapor, broşür, yayın ve kurumsal medya dosya arşivini yönetin.",
  },
  videos: {
    icon: Video,
    tag: "Medya",
    desc: "Video galerisi, YouTube videoları, süreleri ve kapak fotoğraflarını yönetin.",
  },
  applications: {
    icon: UserCheck,
    tag: "Başvuru",
    desc: "Gelen gönüllülük taleplerini inceleyin ve iletişime geçin.",
  },
  publications: {
    icon: BookOpen,
    tag: "Yayın",
    desc: "Teşkilat bültenleri, dergiler ve faaliyet raporlarını yönetin.",
  },
  provinces: {
    icon: MapPin,
    tag: "Teşkilat",
    desc: "81 il başkanlığı iletişim ve adres bilgilerini güncelleyin.",
  },
  iban: {
    icon: Landmark,
    tag: "Kurumsal",
    desc: "Bağış modalında görünen resmî banka hesaplarını güncelleyin.",
  },
};

export default async function AdminHome({ searchParams }: { searchParams: { denied?: string } }) {
  const user = await requireUser();
  const allowed = ADMIN_SECTIONS.filter((s) => can(user.role, s.id));

  return (
    <div className="space-y-6">
      {/* Üst Karşılama & Hızlı İşlemler Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-[#0b2347] p-6 sm:p-7 text-white shadow-lg border border-white/10">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-0.5 text-[11px] font-bold text-gold-light">
              <Sparkles size={12} /> {ROLE_LABELS[user.role]}
            </div>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hoş geldiniz, {user.displayName}
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Milli Gençlik Derneği Yönetim Portalı — Tüm görsel ve içerik değişiklikleri anında yayına alınır.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {can(user.role, "slides") && (
              <Link
                href="/admin/slides"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-primary-dark shadow hover:bg-gold-light transition"
              >
                <Sliders size={14} /> Slayt Yönetimi
              </Link>
            )}
            {can(user.role, "media") && (
              <Link
                href="/admin/media"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur hover:bg-white/25 transition"
              >
                <Upload size={14} /> Fotoğraf Yükle
              </Link>
            )}
            {can(user.role, "news") && (
              <Link
                href="/admin/news"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white backdrop-blur hover:bg-white/25 transition"
              >
                <Newspaper size={14} /> Yeni Haber
              </Link>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 px-3.5 py-2.5 text-xs font-semibold text-slate-100 hover:bg-white/10 transition"
            >
              Canlı Site <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </div>

      {searchParams.denied && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-medium text-amber-900"
        >
          <ShieldAlert size={18} className="shrink-0 text-amber-600" />
          <span>Bu bölüme erişim yetkiniz bulunmamaktadır. Lütfen Süper Admin ile iletişime geçiniz.</span>
        </div>
      )}

      {/* Modül Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowed.map((s) => {
          const meta = SECTION_META[s.id];
          const Icon = meta.icon;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon size={21} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-gold/15 group-hover:text-primary-dark transition">
                    {meta.tag}
                  </span>
                </div>
                <h2 className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                  {s.label}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {meta.desc}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary/80 group-hover:text-primary">
                Yönetime Git <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {user.role === "SUPER_ADMIN" && <SeedButton />}
    </div>
  );
}
