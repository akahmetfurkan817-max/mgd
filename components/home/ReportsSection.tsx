"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Download,
  FileCheck,
  FileText,
  User,
} from "lucide-react";
import { REPORTS } from "@/data/reports";
import ReportModal from "@/components/modals/ReportModal";
import type { ReportItem } from "@/types";

export default function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const displayedReports = REPORTS.slice(0, 2);

  return (
    <section id="raporlar" className="relative py-16 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck size={13} />
              <span>Resmî Yayınlar & Raporlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Basın Bildirileri ve Raporlar
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Genel Merkezimiz ve AR-GE birimlerimiz tarafından hazırlanan haftalık faaliyet değerlendirmeleri ve kamuoyu bildirileri.
            </p>
          </div>

          <Link
            href="/raporlar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-secondary transition self-start sm:self-auto"
          >
            Tüm Raporları İncele ({REPORTS.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 hover:border-secondary/50 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-secondary border border-blue-100">
                    {report.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={12} /> {report.date}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedReport(report)}
                  className="text-base font-bold text-slate-900 group-hover:text-primary transition cursor-pointer line-clamp-2 leading-snug"
                >
                  {report.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {report.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="text-xs font-bold text-secondary group-hover:text-primary transition flex items-center gap-1"
                >
                  Raporu Oku <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => alert(`"${report.title}" PDF dosyası indiriliyor...`)}
                  className="p-1.5 text-slate-400 hover:text-secondary rounded-lg hover:bg-white transition"
                  title="PDF İndir"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tüm Raporları Gör Butonu */}
        <div className="mt-10 text-center">
          <Link
            href="/raporlar"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-95"
          >
            Tüm Basın Bildirileri ve Raporları Gör ({REPORTS.length}) <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </section>
  );
}
