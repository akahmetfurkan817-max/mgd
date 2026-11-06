"use client";

import Link from "next/link";
import { BookOpen, Calendar, ChevronRight, Download, ExternalLink, FileText, Newspaper } from "lucide-react";
import { usePublications } from "@/hooks/useSiteData";

export default function PublicationsSection() {
  const { data: publications } = usePublications();

  // Homepage only shows top 2 publications
  const displayedPubs = publications.slice(0, 2);

  return (
    <section id="yayinlar" className="bg-white py-20 border-b border-slate-200">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              E-Kütüphane & Dokümantasyon
            </span>
            <h2 className="section-title mt-2">Yayınlar & Faaliyet Raporları</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Teşkilatımızın periyodik bültenleri, raporları ve gençlik yayınlarını dijital ortamda inceleyin veya indirin.
            </p>
          </div>

          <Link
            href="/yayinlar"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition group self-start sm:self-auto"
          >
            Tüm Yayınları İncele ({publications.length}) <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayedPubs.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-10">
            Yayın bulunamadı.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {displayedPubs.map((pub) => (
              <div
                key={pub.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-secondary/60 hover:shadow-xl"
              >
                {/* Kapak alanı */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-blue-900 p-6 text-white">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                      {pub.category === "Bülten" ? (
                        <Newspaper size={28} className="text-blue-200" />
                      ) : pub.category === "Faaliyet Raporu" ? (
                        <FileText size={28} className="text-blue-200" />
                      ) : (
                        <BookOpen size={28} className="text-blue-200" />
                      )}
                    </div>
                    <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      {pub.category}
                    </span>
                  </div>
                </div>

                {/* İçerik */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Calendar size={14} className="text-secondary" />
                    <span>
                      {new Date(pub.date).toLocaleDateString("tr-TR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-ink group-hover:text-secondary transition-colors">
                    {pub.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 flex-1">
                    {pub.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-200/70">
                    <a
                      href={pub.pdfUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 text-xs py-2"
                    >
                      <ExternalLink size={14} /> PDF Görüntüle
                    </a>
                    <a
                      href={pub.pdfUrl || "#"}
                      download
                      className="btn-outline text-xs px-3 py-2 text-slate-700 border-slate-300 hover:border-primary"
                      title="İndir"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Link to Full Publications Library */}
        <div className="mt-10 text-center">
          <Link
            href="/yayinlar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all group"
          >
            <span>Tüm E-Kütüphane, Bülten ve Yayınları İncele ({publications.length})</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
