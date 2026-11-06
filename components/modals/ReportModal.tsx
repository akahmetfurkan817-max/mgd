"use client";

import { useEffect } from "react";
import { Calendar, Download, FileText, Printer, User, X } from "lucide-react";
import type { ReportItem } from "@/types";

interface ReportModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: ReportModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (report) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [report, onClose]);

  if (!report) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-dark via-primary to-secondary text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <FileText className="h-5 w-5 text-blue-200" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 border border-blue-300/30">
                {report.category}
              </span>
              <h2 className="text-base md:text-lg font-bold text-white mt-0.5 line-clamp-1">{report.title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-secondary" /> {report.date}
            </span>
            {report.author && (
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-secondary" /> {report.author}
              </span>
            )}
            {report.readTime && <span>• {report.readTime}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1 text-slate-600 hover:text-primary font-medium hover:bg-white rounded border border-transparent hover:border-slate-200 transition flex items-center gap-1"
            >
              <Printer size={12} /> Yazdır
            </button>
            <button
              type="button"
              onClick={() => {
                alert("Resmi Rapor PDF dosyası indiriliyor...");
              }}
              className="px-3 py-1 bg-secondary text-white font-medium hover:bg-primary rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              <Download size={12} /> PDF İndir
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/80 text-primary-dark font-medium">
            {report.summary}
          </div>

          <div className="whitespace-pre-line font-normal text-slate-800 leading-relaxed space-y-3">
            {report.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Milli Gençlik Derneği Resmî Raporu</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
