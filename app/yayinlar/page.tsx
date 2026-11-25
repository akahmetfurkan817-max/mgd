"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, BookOpen, Calendar, Download, ExternalLink, FileText, Newspaper } from "lucide-react";
import { usePublications } from "@/hooks/useSiteData";
import type { PublicationCategory } from "@/types";

const CATEGORIES: ("Tümü" | PublicationCategory)[] = [
  "Tümü",
  "Bülten",
  "Faaliyet Raporu",
  "Dergi",
  "Kitapçık",
];

const ICONS: Record<PublicationCategory, typeof BookOpen> = {
  Bülten: Newspaper,
  "Faaliyet Raporu": FileText,
  Dergi: BookOpen,
  Kitapçık: BookOpen,
};

export default function YayinlarPage() {
  const { data: publications } = usePublications();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Tümü");

  const filtered = publications.filter((p) => filter === "Tümü" || p.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-slate-950 via-primary-dark to-slate-900 text-white py-16 sm:py-20 border-b border-blue-900/30">
          <div className="container-x">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Ana Sayfa
              </Link>
              <span>/</span>
              <span>E-Kütüphane & Yayınlar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
              Yayınlar & E-Kütüphane
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
              Teşkilatımızın periyodik bültenleri, gençlik dergileri, faaliyet raporları ve dava kitapçıklarını dijital ortamda inceleyin veya indirin.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-slate-200">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition ${
                    filter === cat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pub) => {
                const IconComponent = ICONS[pub.category] || BookOpen;
                const hasPdf = Boolean(pub.pdfUrl && pub.pdfUrl !== "#");
                return (
                  <div
                    key={pub.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-blue-400/60 transition-all duration-300"
                  >
                    <div>
                      <div className="relative h-52 w-full overflow-hidden bg-primary-dark">
                        {pub.coverImage ? (
                          <>
                            <Image
                              src={pub.coverImage}
                              alt={pub.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-white">
                            <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-gold-light">
                              <IconComponent size={22} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                              {pub.category}
                            </span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                          <IconComponent size={13} />
                          {pub.category}
                        </span>
                      </div>

                      <div className="p-6 pb-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                          <Calendar size={13} />
                          <span>
                            {new Date(pub.date).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-primary transition-colors">
                          {pub.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {pub.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 mx-6 mb-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      {hasPdf ? (
                        <>
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition"
                          >
                            <ExternalLink size={14} /> Görüntüle
                          </a>
                          <a
                            href={pub.pdfUrl}
                            download
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-primary hover:text-white transition"
                          >
                            <Download size={13} /> İndir (PDF)
                          </a>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">PDF bağlantısı henüz eklenmedi</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
