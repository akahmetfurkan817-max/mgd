"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Image as ImageIcon,
  Landmark,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Newspaper,
  Share2,
  Sliders,
  Type,
  UserCheck,
  Users,
  Video,
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
  news: Newspaper,
  publications: BookOpen,
  applications: UserCheck,
  provinces: MapPin,
  iban: Landmark,
  videos: Video,
};

export default function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const link = (href: string, active: boolean) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-white text-primary shadow-sm" : "text-blue-100 hover:bg-white/10"
    }`;

  return (
    <aside className="flex w-full flex-col bg-primary-dark p-4 text-white md:min-h-screen md:w-64 border-r border-blue-900/40">
      <Logo light className="mb-6" />
      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Panel menüsü">
        <Link href="/admin" className={link("/admin", pathname === "/admin")}>
          <LayoutDashboard size={17} /> Genel Bakış
        </Link>
        {ADMIN_SECTIONS.filter((s) => can(user.role, s.id)).map((s) => {
          const Icon = SECTION_ICONS[s.id] || LayoutDashboard;
          return (
            <Link
              key={s.id}
              href={s.href}
              className={link(s.href, pathname.startsWith(s.href))}
            >
              <Icon size={17} /> {s.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-white/10 pt-4 text-sm">
        <p className="font-semibold">{user.displayName}</p>
        <p className="mb-3 text-xs text-blue-200">{ROLE_LABELS[user.role]}</p>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-blue-100 hover:text-white text-xs font-semibold"
        >
          <LogOut size={15} /> Güvenli Çıkış
        </button>
      </div>
    </aside>
  );
}
