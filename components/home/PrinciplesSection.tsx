"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Globe,
  HeartHandshake,
  Landmark,
  Shield,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { PRINCIPLES } from "@/data/principles";
import type { PrincipleItem } from "@/types";

const ICON_MAP = {
  Landmark,
  HeartHandshake,
  Shield,
  Globe,
  Zap,
  Users,
};

export default function PrinciplesSection() {
  const [selectedPrinciple, setSelectedPrinciple] = useState<PrincipleItem | null>(null);

  return (
    <section id="ilkeler" className="relative py-16 bg-gradient-to-b from-slate-50 to-blue-50/40 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Milli Gençlik Vizyonu & Temel İlkeler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Geleceği İnşa Eden 6 Temel Şiarımız
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Yeniden Büyük Türkiye ve Yeni Bir Dünya ideali doğrultusunda; faizsiz, ahlaklı, üreten ve adil bir nizama olan inancımızla yürüyoruz.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRINCIPLES.map((item) => {
            const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Sparkles;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPrinciple(item)}
                className="group relative flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Icon & Subtitle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-secondary group-hover:bg-primary group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-sm">
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Milli Görüş Şiarı
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-secondary mt-1">{item.subtitle}</p>

                  <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {item.points.slice(0, 2).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 size={13} className="text-secondary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary group-hover:text-primary transition flex items-center gap-1">
                    Daha Fazla <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Vizyon Belgesi</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Principle Detail Modal */}
      {selectedPrinciple && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPrinciple(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-dark via-primary to-secondary text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 border border-blue-300/30">
                  Milli Görüş Vizyonu
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedPrinciple.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrinciple(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {selectedPrinciple.subtitle}
                </p>
                <p className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                  {selectedPrinciple.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Uygulama Esasları ve Eylem Başlıkları
                </h4>
                <div className="space-y-2.5">
                  {selectedPrinciple.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
                      <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Milli Gençlik Derneği © 2026</span>
              <button
                type="button"
                onClick={() => setSelectedPrinciple(null)}
                className="px-4 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition shadow-sm"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
