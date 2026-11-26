"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  ExternalLink,
  FolderArchive,
  Image as ImageIcon,
  Landmark,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Sliders,
  Type,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { ADMIN_SECTIONS, ROLE_LABELS, can } from "@/lib/permissions";
import type { AdminSection, AdminUser } from "@/types";

const SECTION_ICONS: Record<AdminSection, typeof Newspaper> = {
  slides: Sliders,
  media: ImageIcon,
  layout: Layers,
  content: Type,
  board: Users,
  pioneers: Award,
  news: Newspaper,
  archive: FolderArchive,
  publications: BookOpen,
  applications: UserCheck,
  newsletter: Mail,
  provinces: MapPin,
  iban: Landmark,
  videos: Video,
};

const NAV_GROUPS: { title: string; ids: AdminSection[] }[] = [
  { title: "Vitrin & Medya", ids: ["slides", "media", "layout", "content"] },
  { title: "İçerik & Arşiv", ids: ["news", "videos", "pioneers", "archive", "publications"] },
  { title: "Teşkilat & Kurumsal", ids: ["board", "provinces", "applications", "newsletter", "iban"] },
];

export default function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
      active
        ? "bg-white text-primary-dark font-bold shadow-sm"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const sectionMap = new Map(ADMIN_SECTIONS.map((s) => [s.id, s]));

  const navContent = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Logo light />
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
          aria-label="Menüyü Kapat"
        >
          <X size={20} />
        </button>
      </div>

      <Link
        href="/"
        target="_blank"
        className="mb-4 flex items-center justify-between rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2 text-xs font-bold text-gold-light hover:bg-gold hover:text-primary-dark transition-colors"
      >
        <span>Canlı Siteyi Görüntüle</span>
        <ExternalLink size={14} />
      </Link>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1" aria-label="Panel menüsü">
        <div>
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={linkClass(pathname === "/admin")}
          >
            <LayoutDashboard size={16} /> Genel Bakış
          </Link>
        </div>

        {NAV_GROUPS.map((group) => {
          const items = group.ids
            .filter((id) => can(user.role, id))
            .map((id) => sectionMap.get(id))
            .filter(Boolean);
          if (items.length === 0) return null;
          return (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400/80">
                {group.title}
              </p>
              {items.map((s) => {
                if (!s) return null;
                const Icon = SECTION_ICONS[s.id] || LayoutDashboard;
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass(pathname.startsWith(s.href))}
                  >
                    <Icon size={16} /> {s.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-3.5 text-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white text-xs">{user.displayName}</p>
            <p className="truncate text-[11px] text-slate-400">{ROLE_LABELS[user.role]}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Güvenli Çıkış"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut size={13} /> Çıkış
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobil Üst Bar */}
      <div className="flex md:hidden items-center justify-between bg-primary-dark px-4 py-3 text-white border-b border-white/10 sticky top-0 z-30">
        <Logo light />
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-white/20 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200"
          >
            Site
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-white/20 p-2 text-white"
            aria-label="Yönetim Menüsünü Aç"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobil Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 flex w-72 flex-col bg-primary-dark p-5 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Masaüstü Sabit Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col bg-primary-dark p-5 text-white border-r border-white/10 sticky top-0 h-screen">
        {navContent}
      </aside>
    </>
  );
}
