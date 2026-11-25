"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Folder,
  Home,
  Map,
  ScrollText,
  Users,
} from "lucide-react";
import { useLeaders, usePresident, useSiteSettings } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";
import FlipbookModal from "@/components/corporate/FlipbookModal";

export default function LeadershipCompact() {
  const { data: president } = usePresident();
  const { data: leaders } = useLeaders();
  const { data: settings } = useSiteSettings();
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const showQuickCards = Boolean(settings.managementCards?.showQuickCards);
  const showDormitory = Boolean(settings.managementCards?.showDormitory);
  const dormitoryPhoto = settings.managementCards?.dormitoryPhoto || "";
  const presidentSlug = slugify(president.name) || "ahmet-ozvatan";

  const quickItems: {
    key: string;
    title: string;
    desc: string;
    tag: string;
    icon: typeof Users;
    href?: string;
    onClick?: () => void;
    photo?: string;
  }[] = [
    {
      key: "divan",
      title: "Başkanlık Divanı",
      desc: `${leaders.length} kişilik Genel Merkez yönetim kadromuz`,
      tag: "Yönetim",
      icon: Users,
      href: "/baskanlik-divani",
    },
    {
      key: "subeler",
      title: "Şube Başkanları",
      desc: "81 ilde aktif teşkilat ve il başkanlıklarımız",
      tag: "Teşkilat",
      icon: Map,
      href: "/#teskilat",
    },
    ...(showDormitory
      ? [
          {
            key: "yurt",
            title: "Ev ve Yurt Sorumluları",
            desc: "81 ilde öğrenci evleri ve yurt sorumlularımız",
            tag: "Teşkilat",
            icon: Home,
            href: "/#teskilat",
            photo: dormitoryPhoto,
          },
        ]
      : []),
    {
      key: "komisyonlar",
      title: "Komisyonlar",
      desc: "Üniversite, ortaöğretim ve ihtisas komisyonları",
      tag: "Birimler",
      icon: Briefcase,
      href: "/faaliyetler",
    },
    {
      key: "tuzuk",
      title: "Tüzüğümüz",
      desc: "Milli Gençlik Derneği resmî kuruluş esasları",
      tag: "Kurumsal",
      icon: ScrollText,
      onClick: () => setActiveDoc("tuzuk"),
    },
    {
      key: "arsiv",
      title: "Dosya Arşivi",
      desc: "Kurumsal kimlik, konsept ve dönem dokümanları",
      tag: "Arşiv",
      icon: Folder,
      href: "/dosya-arsivi",
    },
  ];

  return (
    <section id="yonetim" className="relative overflow-hidden bg-slate-50/80 py-16 sm:py-20 border-y border-slate-200/70">
      <div className="container-x relative z-10">
        {/* Bölüm Başlığı */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-secondary mb-2">
              <span className="h-[2px] w-6 rounded-full bg-gold" />
              Kurumsal Yapı &amp; Teşkilat
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary-dark">
              Yönetim ve Teşkilat
            </h2>
          </div>

          <Link
            href="/baskanlik-divani"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition self-start sm:self-auto"
          >
            Tüm Yönetim Kadrosu <ArrowRight size={14} />
          </Link>
        </div>

        {/* Üst Vurgu: Genel Başkan Yatay Editoryal Kart */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071832] via-[#0B254A] to-[#12366B] text-white shadow-xl border border-white/10 ${
            showQuickCards ? "mb-6" : ""
          }`}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-12 items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10">
            {/* Genel Başkan Portresi */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
              <Link
                href={`/baskanlik-divani/${presidentSlug}`}
                className="group relative block aspect-[4/4.6] w-52 sm:w-56 md:w-full max-w-[240px] overflow-hidden rounded-2xl border-2 border-gold/60 ring-4 ring-gold/15 bg-[#061529] shadow-2xl"
              >
                <Image
                  src={president.photo || "/images/ahmet-ozvatan.jpg"}
                  alt={president.name}
                  fill
                  sizes="(max-width: 768px) 224px, 240px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061529]/50 via-transparent to-transparent" />
              </Link>
            </div>

            {/* Genel Başkan Bilgisi ve Aksiyonlar */}
            <div className="md:col-span-8 lg:col-span-9 text-center md:text-left">
              <span className="inline-flex items-center rounded-full bg-gold/20 border border-gold/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-light">
                {president.title || "Milli Gençlik Derneği Genel Başkanı"}
              </span>

              <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {president.name}
              </h3>

              {(president.message || president.bio) && (
                <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-200/90 line-clamp-3 mx-auto md:mx-0">
                  {president.message || president.bio}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href={`/baskanlik-divani/${presidentSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-blue-50 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-primary-dark shadow-md transition"
                >
                  Özgeçmiş &amp; Mesaj <ArrowRight size={15} />
                </Link>
                <Link
                  href="/baskanlik-divani"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition"
                >
                  <Users size={15} /> Başkanlık Divanı ({leaders.length})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Kurumsal Erişim Kartları — Admin Panelinden Açılıp Kapatılabilir */}
        {showQuickCards && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
            quickItems.length >= 6 ? "lg:grid-cols-3" : "lg:grid-cols-5"
          }`}
        >
          {quickItems.map((item) => {
            const Icon = item.icon;
            const cardInner = (
              <>
                {item.photo && (
                  <>
                    <Image
                      src={item.photo}
                      alt={item.title}
                      fill
                      className="object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500"
                      unoptimized
                    />
                  </>
                )}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 group-hover:bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors">
                    {item.tag}
                    <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

                <div className="relative z-10 mt-4">
                  <h3 className="font-display text-base font-extrabold text-ink group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </>
            );

            const baseClass =
              "group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg";

            if (item.onClick) {
              return (
                <button key={item.key} type="button" onClick={item.onClick} className={baseClass}>
                  {cardInner}
                </button>
              );
            }

            return (
              <Link key={item.key} href={item.href || "/"} className={baseClass}>
                {cardInner}
              </Link>
            );
          })}
        </div>
        )}
      </div>

      <FlipbookModal docKey={activeDoc} onClose={() => setActiveDoc(null)} />
    </section>
  );
}
