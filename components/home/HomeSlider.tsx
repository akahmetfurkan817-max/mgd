"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Pause,
  Play,
} from "lucide-react";
import { useSiteSettings, useSlides } from "@/hooks/useSiteData";
import type { HomeSlideItem } from "@/data/slides";

const AUTOPLAY_MS = 6500;

const COMMISSION_CARDS = [
  {
    title: "Ortaöğretim",
    subtitle: "Ortaöğretim çalışmaları",
    href: "/faaliyetler",
    icon: FileText,
    bgClass: "bg-gradient-to-br from-[#163675] via-[#1B4EA3] to-[#1D56B8] text-white hover:brightness-110",
    iconBgClass: "bg-white/15 text-white border border-white/20 group-hover:bg-white group-hover:text-[#1B4EA3]",
    titleClass: "text-white",
    subtitleClass: "text-blue-100/85",
    arrowClass: "text-white/70 group-hover:text-white",
  },
  {
    title: "Üniversiteler",
    subtitle: "Üniversite ve burs çalışmaları",
    href: "/haberler?cat=Duyurular%20%26%20Burs",
    icon: GraduationCap,
    bgClass: "bg-white text-[#1B4EA3] hover:bg-white",
    iconBgClass: "bg-[#1B4EA3]/10 text-[#1B4EA3] border border-[#1B4EA3]/20 group-hover:bg-[#1B4EA3] group-hover:text-white",
    titleClass: "text-[#1B4EA3]",
    subtitleClass: "text-[#1B4EA3]/80",
    arrowClass: "text-[#1B4EA3]/70 group-hover:text-[#1B4EA3]",
  },
];

export default function HomeSlider() {
  const { data: slides } = useSlides();
  const { data: settings } = useSiteSettings();
  const sliderZoomEnabled = Boolean(settings.sliderZoomEnabled);
  const total = slides.length;

  const [current, setCurrent] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const isHorizontalLockRef = useRef<boolean | null>(null);
  const didDragRef = useRef(false);

  const isPaused = manualPaused || hoverPaused;

  useEffect(() => {
    if (total > 0 && current >= total) {
      setCurrent(0);
    }
  }, [total, current]);

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      const wrapped = ((index % total) + total) % total;
      setCurrent(wrapped);
      setProgressKey((k) => k + 1);
    },
    [total],
  );

  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused || isDragging || total <= 1) return;
    const timer = setTimeout(() => {
      goTo(current + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, isPaused, isDragging, total, goTo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextSlide, prevSlide]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    didDragRef.current = false;
    if (total <= 1) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;

    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startTimeRef.current = performance.now();
    isHorizontalLockRef.current = null;
    setIsDragging(true);
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (isHorizontalLockRef.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        isHorizontalLockRef.current = Math.abs(dx) >= Math.abs(dy);
        if (!isHorizontalLockRef.current) {
          setIsDragging(false);
          setDragOffset(0);
          pointerIdRef.current = null;
          return;
        }
      } else {
        return;
      }
    }

    if (Math.abs(dx) > 8) didDragRef.current = true;

    let adjusted = dx;
    if ((current === 0 && dx > 0) || (current === total - 1 && dx < 0)) {
      adjusted = dx * 0.35;
    }
    setDragOffset(adjusted);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - startXRef.current;
    const elapsed = Math.max(1, performance.now() - startTimeRef.current);
    const velocity = Math.abs(dx) / elapsed;
    const width = containerRef.current?.clientWidth || 1000;
    const threshold = Math.min(140, width * 0.16);

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    pointerIdRef.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (isHorizontalLockRef.current) {
      const triggered = Math.abs(dx) > threshold || (velocity > 0.45 && Math.abs(dx) > 30);
      if (triggered) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    }

    setTimeout(() => {
      didDragRef.current = false;
    }, 50);
  };

  if (total === 0) return null;

  return (
    <section id="manset-slider" aria-label="Ana Sayfa Manşetleri" className="relative bg-white select-none">
      {/* Üst Tam Genişlik Slayt Alanı */}
      <div
        className="relative bg-primary overflow-hidden"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
      >
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          style={{ touchAction: "pan-y" }}
          className={`relative w-full overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(calc(${-current * 100}% + ${dragOffset}px), 0, 0)`,
              transition: isDragging ? "none" : "transform 680ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {slides.map((item: HomeSlideItem, idx: number) => {
              const isActive = idx === current;
              const parallaxPx = isActive && isDragging ? dragOffset * -0.14 : 0;
              const hasText = Boolean(item.title?.trim() || item.subtitle?.trim() || item.buttonText?.trim());

              return (
                <div
                  key={item.id || idx}
                  className="relative w-full shrink-0 min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center"
                >
                  {/* Arka Plan Fotoğrafı */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      transform: `translate3d(${parallaxPx}px, 0, 0)`,
                      transition: isDragging ? "none" : "transform 680ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <Image
                      src={item.image || "/images/slider/yeniden-milli-genclik.jpg"}
                      alt={item.title || "Milli Gençlik Derneği"}
                      fill
                      sizes="100vw"
                      draggable={false}
                      className={`object-cover object-center ${
                        isActive && sliderZoomEnabled ? "animate-ken-burns" : "scale-100"
                      }`}
                      priority={idx === 0}
                      unoptimized
                    />
                    {/* Kurumsal Mavi Degrade Katmanı (metin varsa okunaklılık için) */}
                    {hasText ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2B63]/90 via-[#153B7D]/60 to-[#153B7D]/15" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2B63]/65 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2B63]/35 via-transparent to-transparent" />
                    )}
                  </div>

                  {/* Slayt Metinleri (Sadece doldurulmuşsa görünür) */}
                  {hasText && (
                    <div className="container-x relative z-20 pt-10 pb-28 sm:pt-12 sm:pb-32">
                      <div
                        className={`max-w-2xl sm:pl-14 lg:pl-16 transition-all duration-700 ${
                          isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                        }`}
                      >
                        {item.title?.trim() && (
                          <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-0.025em] text-white leading-[1.08] drop-shadow-sm">
                            {item.title}
                          </h1>
                        )}

                        {item.subtitle?.trim() && (
                          <p className="mt-4 text-sm sm:text-base lg:text-[17px] text-white/90 leading-relaxed max-w-xl font-medium">
                            {item.subtitle}
                          </p>
                        )}

                        {item.buttonText?.trim() && (
                          <div className="mt-7">
                            <Link
                              href={item.linkUrl || "/kurumsal"}
                              draggable={false}
                              onPointerDown={(e) => e.stopPropagation()}
                              className="group inline-flex items-stretch overflow-hidden rounded-xl bg-white shadow-xl transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                              <span className="flex items-center px-6 py-3.5 text-sm font-bold text-ink">
                                {item.buttonText.replace(/\s*→\s*$/, "")}
                              </span>
                              <span className="flex items-center justify-center bg-secondary px-4 text-white transition-colors group-hover:bg-primary">
                                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sol / Sağ Beyaz Yuvarlak Oklar */}
          {total > 1 && (
            <div className="pointer-events-none absolute inset-x-0 top-[46%] -translate-y-1/2 z-30 hidden sm:flex items-center justify-between px-4 lg:px-7">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Önceki Slayt"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Sonraki Slayt"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-xl transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}

          {/* Alt Sayaç, İlerleme Çubukları ve Duraklat Butonu */}
          {total > 1 && (
            <div className="absolute bottom-16 sm:bottom-20 inset-x-0 z-30">
              <div className="container-x sm:pl-20 lg:pl-24 flex items-center gap-3.5">
                <span className="font-mono text-xs font-bold text-white/95 tracking-wider">
                  {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => {
                    const active = idx === current;
                    return (
                      <button
                        key={s.id || idx}
                        type="button"
                        onClick={() => goTo(idx)}
                        aria-label={`Slayt ${idx + 1}`}
                        className="relative h-1 w-9 sm:w-12 rounded-full bg-white/35 overflow-hidden"
                      >
                        {active && (
                          <span
                            key={`${progressKey}-${current}`}
                            style={
                              {
                                "--slide-duration": `${AUTOPLAY_MS}ms`,
                                animationPlayState: isPaused || isDragging ? "paused" : "running",
                              } as React.CSSProperties
                            }
                            className="block h-full w-full bg-white animate-slide-progress"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setManualPaused((p) => !p)}
                  aria-label={manualPaused ? "Oynat" : "Duraklat"}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 transition"
                >
                  {manualPaused ? <Play size={11} className="fill-current ml-0.5" /> : <Pause size={11} className="fill-current" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slayt Altına Binen Yüzer Komisyon Kartı (Ortaöğretim: Mavi • Üniversiteler: Beyaz / Mavi Yazı) */}
      <div className="container-x relative z-30 -mt-12 sm:-mt-14 pb-6">
        <div className="rounded-2xl shadow-[0_18px_45px_-12px_rgba(10,25,60,0.28)] overflow-hidden border border-slate-200/70">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {COMMISSION_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`group flex items-center justify-between md:justify-center gap-4 px-5 sm:px-10 py-5 sm:py-7 transition-all duration-300 ${card.bgClass}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${card.iconBgClass}`}
                    >
                      <Icon size={23} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 text-left">
                      <h2 className={`font-display text-base sm:text-lg font-extrabold tracking-tight ${card.titleClass}`}>
                        {card.title}
                      </h2>
                      <p className={`text-xs sm:text-sm font-medium truncate ${card.subtitleClass}`}>
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className={`shrink-0 transition-transform duration-300 group-hover:translate-x-1 md:ml-4 ${card.arrowClass}`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
