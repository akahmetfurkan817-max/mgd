import { requireUser } from "@/lib/session";
import { ADMIN_SECTIONS, ROLE_LABELS, can } from "@/lib/permissions";
import Link from "next/link";
import SeedButton from "@/components/admin/SeedButton";
import {
  BookOpen,
  Landmark,
  Layers,
  MapPin,
  Newspaper,
  Share2,
  ShieldAlert,
  Type,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import type { AdminSection } from "@/types";

const SECTION_META: Record<AdminSection, { icon: typeof Newspaper; desc: string }> = {
  layout: {
    icon: Layers,
    desc: "Ana sayfadaki bölümlerin yerini sürükleyip taşıyın veya gizleyin.",
  },
  content: {
    icon: Type,
    desc: "Sayaç sayılarını (50.000+, 81 il vb.), başlıkları ve sözleri düzenleyin.",
  },
  board: {
    icon: Users,
    desc: "Genel Başkan ve Başkanlık Divanı kadrosunu yönetin.",
  },
  news: {
    icon: Newspaper,
    desc: "Genel Merkez, Üniversite ve Basın Açıklamalarını yayınlayın.",
  },
  videos: {
    icon: Video,
    desc: "Video galerisi, YouTube videoları, süreleri ve kapak fotoğraflarını yönetin.",
  },
  applications: {
    icon: UserCheck,
    desc: "Gelen gönüllülük taleplerini inceleyin ve iletişime geçin.",
  },
  publications: {
    icon: BookOpen,
    desc: "Teşkilat bültenleri, dergiler ve faaliyet raporlarını yönetin.",
  },
  provinces: {
    icon: MapPin,
    desc: "81 il başkanlığı iletişim ve adres bilgilerini güncelleyin.",
  },
  iban: {
    icon: Landmark,
    desc: "Bağış modalında görünen resmî banka hesaplarını güncelleyin.",
  },
  social: {
    icon: Share2,
    desc: "X (Twitter) ve Instagram @milligenclikmgd paylaşımlarını yönetin veya senkronize edin.",
  },
};

export default async function AdminHome({ searchParams }: { searchParams: { denied?: string } }) {
  const user = await requireUser();
  const allowed = ADMIN_SECTIONS.filter((s) => can(user.role, s.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-dark">
            Hoş geldiniz, {user.displayName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Milli Gençlik Derneği Yönetim ve Teşkilat Portalı
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-secondary border border-blue-200 w-fit">
          Yetki: {ROLE_LABELS[user.role]}
        </span>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allowed.map((s) => {
          const meta = SECTION_META[s.id];
          const Icon = meta.icon;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-secondary hover:shadow-lg"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-secondary transition group-hover:bg-secondary group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h2 className="text-base font-bold text-ink group-hover:text-secondary transition-colors">
                  {s.label}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  {meta.desc}
                </p>
              </div>
              <span className="mt-5 text-xs font-semibold text-secondary flex items-center gap-1">
                Yönetime Git →
              </span>
            </Link>
          );
        })}
      </div>

      {user.role === "SUPER_ADMIN" && <SeedButton />}
    </div>
  );
}
