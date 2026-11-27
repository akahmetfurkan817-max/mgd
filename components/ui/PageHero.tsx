"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteData";

export interface PageHeroProps {
  pageKey: string;
  defaultEyebrow?: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  breadcrumbLabel?: string;
  className?: string;
}

/**
 * İç sayfalardaki üst lacivert Hero alanı.
 * Varsayılan olarak mevcut kurumsal görünümü korur; Admin Panelinden (İçerik & Metinler -> Sayfa Üst Bannerları)
 * fotoğraf eklendiğinde veya başlık/alt metin düzenlenip silindiğinde canlı olarak güncellenir.
 */
export default function PageHero({
  pageKey,
  defaultEyebrow,
  defaultTitle,
  defaultSubtitle,
  breadcrumbLabel,
  className = "",
}: PageHeroProps) {
  const { data: settings } = useSiteSettings();
  const custom = settings.pageHeroes?.[pageKey];

  const bgImage = custom?.backgroundImage?.trim() || "";
  const hideText = Boolean(custom?.hideText);

  const eyebrow =
    custom && custom.eyebrow !== undefined ? custom.eyebrow.trim() : (defaultEyebrow || "").trim();
  const title =
    custom && custom.title !== undefined ? custom.title.trim() : defaultTitle.trim();
  const subtitle =
    custom && custom.subtitle !== undefined ? custom.subtitle.trim() : (defaultSubtitle || "").trim();

  const hasVisibleText = !hideText && Boolean(eyebrow || title || subtitle || breadcrumbLabel);

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-r from-[#061124] via-primary-dark to-[#122D61] text-white border-b border-white/10 ${
        bgImage && !hasVisibleText ? "min-h-[220px] sm:min-h-[300px]" : "py-14 sm:py-20"
      } ${className}`}
    >
      {bgImage && (
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt={title || pageKey}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            unoptimized
          />
          {hasVisibleText ? (
            <div className="absolute inset-0 bg-gradient-to-r from-[#061124]/88 via-[#0C2048]/70 to-[#0C2048]/35" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-t from-[#061124]/25 via-transparent to-transparent" />
          )}
        </div>
      )}

      {hasVisibleText && (
        <div className="container-x relative z-10">
          <ScrollReveal y={18} duration={650}>
            {breadcrumbLabel && (
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
                <Link href="/" className="hover:underline flex items-center gap-1">
                  <ArrowLeft size={14} /> Ana Sayfa
                </Link>
                <span>/</span>
                <span>{breadcrumbLabel}</span>
              </div>
            )}
            {eyebrow && (
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-300 mb-2">
                {eyebrow}
              </span>
            )}
            {title && (
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-3 text-sm sm:text-base text-blue-100/85 max-w-2xl">
                {subtitle}
              </p>
            )}
          </ScrollReveal>
        </div>
      )}
    </section>
  );
}
