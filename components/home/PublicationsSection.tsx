"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Calendar, Download, ExternalLink, FileText, Newspaper } from "lucide-react";
import { usePublications } from "@/hooks/useSiteData";

export default function PublicationsSection() {
  const { data: publications } = usePublications();
  const displayedPubs = publications.slice(0, 3);

  return (
    <section id="yayinlar" className="bg-white py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200/80 mb-10">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="h-[1.5px] w-7 bg-gold" />
              <span>E-Kütüphane &amp; Dokümantasyon</span>
            </div>
            <h2 className="section-title">Yayınlar &amp; Faaliyet Raporları</h2>
          </div>

          <Link
            href="/yayinlar"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors self-start sm:self-auto group"
          >
            <span>Tüm Yayınlar ({publications.length})</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {displayedPubs.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-10">Yayın bulunamadı.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedPubs.map((pub) => (
              <div
                key={pub.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-primary-dark text-white">
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
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full bg-primary-dark/85 backdrop-blur-sm border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gold-light">
                        {pub.category}
                      </span>
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-gold-light">
                        {pub.category === "Bülten" ? (
                          <Newspaper size={22} />
                        ) : pub.category === "Faaliyet Raporu" ? (
                          <FileText size={22} />
                        ) : (
                          <BookOpen size={22} />
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                        {pub.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Calendar size={13} className="text-gold" />
                    <span>
                      {new Date(pub.date).toLocaleDateString("tr-TR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-ink group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3 flex-1">
                    {pub.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
                    <a
                      href={pub.pdfUrl || "/yayinlar"}
                      target={pub.pdfUrl && pub.pdfUrl !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-xs py-2.5"
                    >
                      <ExternalLink size={14} /> İncele
                    </a>
                    {pub.pdfUrl && pub.pdfUrl !== "#" && (
                      <a
                        href={pub.pdfUrl}
                        download
                        className="btn-outline text-xs px-3 py-2.5"
                        title="İndir"
                      >
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
