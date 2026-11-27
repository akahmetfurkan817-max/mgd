"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { ArrowLeft, Calendar, Download, FileCheck, FileText, User } from "lucide-react";
import { REPORTS } from "@/data/reports";
import ReportModal from "@/components/modals/ReportModal";
import type { ReportItem } from "@/types";

export default function RaporlarPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const categories = [
    { key: "all", label: "Tümü" },
    { key: "Haftalık Rapor", label: "Haftalık Raporlar" },
    { key: "Basın Bildirisi", label: "Basın Bildirileri" },
    { key: "AR-GE Raporu", label: "AR-GE ve Maarif" },
  ];

  const filtered = filter === "all" ? REPORTS : REPORTS.filter((r) => r.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          pageKey="raporlar"
          breadcrumbLabel="Raporlar & Bildiriler"
          defaultTitle="Basın Bildirileri ve Raporlar"
          defaultSubtitle="Milli Gençlik Derneği Genel Merkezimiz ve AR-GE birimlerimiz tarafından hazırlanan haftalık faaliyet raporları, kamuoyu bildirileri ve politika belgeleri."
        />

        <section className="py-12">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-slate-200">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilter(c.key)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition ${
                    filter === c.key
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-secondary border border-blue-100">
                        {report.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={13} /> {report.date}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {report.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {report.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <User size={13} className="text-primary" /> {report.author}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary group-hover:underline"
                      >
                        <FileText size={13} /> Raporu Oku
                      </button>
                      <a
                        href={report.pdfUrl}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-primary transition"
                        title="PDF İndir"
                      >
                        <Download size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      <Footer />
    </div>
  );
}
