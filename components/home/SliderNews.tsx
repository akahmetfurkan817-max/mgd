"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Newspaper,
  Share2,
  X,
} from "lucide-react";
import { useNews } from "@/hooks/useSiteData";
import type { NewsItem } from "@/types";

export default function SliderNews() {
  const { data: newsItems } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const total = newsItems.length;

  useEffect(() => {
    if (total === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(interval);
  }, [total, isPaused]);

  if (total === 0) return null;

  const current = newsItems[currentIndex] || newsItems[0];
  const sideItems = newsItems.filter((_, i) => i !== currentIndex).slice(0, 4);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section id="manset-haberler" className="relative bg-slate-900 py-12 text-white border-b border-blue-900/30 overflow-hidden">
      {/* Background glow & subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060e20] via-slate-900 to-[#0A192F] opacity-95 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Newspaper size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Gündem & Manşet</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Milli Gençlik Haber Bülteni</h2>
            </div>
          </div>

          <a
            href="#haberler"
            className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            TÜM HABERLERİ GÖRMEK İÇİN TIKLAYIN <ChevronRight size={14} />
          </a>
        </div>

        {/* Dual Layout: Big Slider (Left) + Quick List (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Slider (7 cols) */}
          <div
            className="lg:col-span-7 relative flex flex-col justify-end min-h-[420px] lg:min-h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-slate-950"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={current.image || "/images/basinda-biz/antalya-il.png"}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              {/* Rich Blue/Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-95" />
              <div className="absolute inset-0 bg-blue-950/20 mix-blend-multiply" />
            </div>

            {/* Slider Content */}
            <div className="relative p-6 sm:p-8 z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-600 text-white shadow-sm">
                  {current.category}
                </span>
                <span className="text-xs text-blue-200/90 flex items-center gap-1.5">
                  <Calendar size={13} /> {current.date}
                </span>
                <span className="text-xs text-white/50 ml-auto font-mono">
                  {currentIndex + 1} / {total}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md line-clamp-2">
                {current.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-2xl">
                {current.summary}
              </p>

              {/* Bottom bar of Slider */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedNews(current)}
                  className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide transition shadow-lg flex items-center gap-2 group/btn"
                >
                  Daha Fazla <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition border border-white/10"
                    aria-label="Önceki Manşet"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition border border-white/10"
                    aria-label="Sonraki Manşet"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-blue-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Side Quick News List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                Öne Çıkan Gelişmeler
              </span>
              <span className="text-xs text-slate-500">MGD Ajansı</span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {sideItems.map((item) => {
                const itemIndex = newsItems.findIndex((n) => n.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setCurrentIndex(itemIndex >= 0 ? itemIndex : 0)}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-400/30 transition cursor-pointer group"
                  >
                    <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                      <Image
                        src={item.image || "/images/basinda-biz/antalya-il.png"}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">• {item.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-300 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <a
                href="#haberler"
                className="w-full block py-2.5 px-4 text-center text-xs font-bold tracking-wide rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border border-blue-500/30 transition"
              >
                TÜM HABERLER VE BASIN DUYURULARI →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-100 flex flex-col max-h-[85vh] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            {selectedNews.image && (
              <div className="relative h-56 w-full bg-slate-900">
                <Image
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-3 right-3 p-2 bg-slate-950/60 hover:bg-slate-950 text-white rounded-full backdrop-blur-sm transition"
                  aria-label="Kapat"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedNews.category}
                </span>
                <span className="text-xs text-slate-400">• {selectedNews.date}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {selectedNews.title}
              </h2>

              <p className="text-sm font-semibold text-primary leading-relaxed bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                {selectedNews.summary}
              </p>

              <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
                <p>
                  Milli Gençlik Derneği Genel Merkezimiz koordinasyonunda 81 ilde yürütülen bu kutlu çalışmalar,
                  gençliğimizin ahlaki ve manevi inşasında dönüm noktası oluşturmaktadır.
                </p>
                <p>
                  Genel Başkanımız ve teşkilat mensuplarımız, milletimizin birlik ve beraberliği, şahsiyetli nesillerin
                  yetişmesi ve adil bir dünyanın tesisi yolunda kararlılıkla yürümeye devam edecektir.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-400">Milli Gençlik Derneği Resmî Bülteni</span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
