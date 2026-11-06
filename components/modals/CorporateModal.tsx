"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Printer, ShieldCheck, X } from "lucide-react";
import { CORPORATE_DOCS, type CorporateDoc } from "@/data/corporate";

interface CorporateModalProps {
  docKey: string | null;
  onClose: () => void;
}

export default function CorporateModal({ docKey, onClose }: CorporateModalProps) {
  const [doc, setDoc] = useState<CorporateDoc | null>(null);

  useEffect(() => {
    if (docKey && CORPORATE_DOCS[docKey]) {
      setDoc(CORPORATE_DOCS[docKey]);
    } else {
      setDoc(null);
    }
  }, [docKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (docKey) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [docKey, onClose]);

  if (!docKey || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

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
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 border border-blue-300/30">
                  {doc.badge}
                </span>
                <span className="text-xs text-blue-200/80">{doc.date}</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">{doc.title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary-dark">{doc.subtitle}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Milli Gençlik Derneği Genel Merkezi tarafından onaylanmış resmî kurumsal metindir.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {doc.pages.map((p) => (
              <div key={p.pageNumber} className="border-b border-slate-100 pb-5 last:border-b-0">
                {p.chapterTitle && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold">
                    {p.chapterTitle}
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900 mt-0.5 mb-2">{p.heading}</h3>
                {p.subheading && (
                  <p className="text-xs font-medium text-slate-500 mb-2 italic">{p.subheading}</p>
                )}
                <div className="space-y-2 text-slate-700 leading-relaxed text-sm">
                  {p.body.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
                {p.notes && (
                  <p className="mt-3 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 font-medium">
                    📌 {p.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-500">Milli Gençlik Derneği (MGD) © 2026</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer size={14} /> Yazdır
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Download size={14} /> PDF Olarak İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
