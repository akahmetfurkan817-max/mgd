"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { HOME_SLIDES, type HomeSlideItem } from "@/data/slides";

export default function HomeSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = HOME_SLIDES.length;

  // Touch & Drag state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    touchEndX.current = clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide(); // Swipe left
    if (diff < -50) prevSlide(); // Swipe right
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) return null;

  const slide: HomeSlideItem = HOME_SLIDES[current];

  return (
    <section
      id="manset-slider"
      className="relative bg-slate-950 text-white overflow-hidden select-none border-b border-blue-900/30"
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      {/* Slayt Arka Plan Görseli & Gradient Katmanları */}
      <div
        className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] w-full flex items-center overflow-hidden"
        style={{ position: "relative", minHeight: "480px", overflow: "hidden" }}
      >
        {HOME_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{ position: "absolute", inset: 0, overflow: "hidden" }}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover object-center filter brightness-90 transform scale-100 transition-transform duration-7000 ease-out"
              priority={idx === 0}
              unoptimized
            />
            {/* Yumuşak Karartma & Kurumsal Mavi Geçiş */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
        ))}

        {/* Slayt İçeriği & Başlıklar */}
        <div className="container-x relative z-20 py-16 sm:py-24">
          <div className="max-w-3xl">
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-white shadow-md mb-4 bg-primary border border-white/20">
              <Sparkles size={13} className="text-yellow-400" />
              <span>{slide.badge}</span>
              {slide.date && <span className="opacity-75">• {slide.date}</span>}
            </div>

            {/* Başlık */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {slide.title}
            </h2>

            {/* Alt Metin */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow">
              {slide.subtitle}
            </p>

            {/* Aksiyon Butonları */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={slide.linkUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-secondary hover:bg-blue-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>{slide.buttonText}</span>
              </Link>

              <span className="text-xs text-slate-400 hidden sm:inline">
                Kaydırmak için sürükleyin veya oklara basın
              </span>
            </div>
          </div>
        </div>

        {/* Sol / Sağ Oklar */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-slate-900/80 hover:bg-secondary text-white border border-white/20 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Önceki Slayt"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-slate-900/80 hover:bg-secondary text-white border border-white/20 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Sonraki Slayt"
        >
          <ChevronRight size={24} />
        </button>

        {/* Alt Sayaç ve Göstergeler (Dots) */}
        <div className="absolute bottom-6 left-0 right-0 z-30">
          <div className="container-x flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HOME_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-secondary" : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slayt ${i + 1}`}
                />
              ))}
            </div>

            {/* Slayt Numarası (Örn: 01 / 04) */}
            <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
              <span className="text-white">0{current + 1}</span> / 0{total}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
