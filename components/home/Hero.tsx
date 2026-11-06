"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, HeartHandshake, Sparkles, UserPlus } from "lucide-react";
import { ANNOUNCEMENTS } from "@/data/news";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import { useSiteSettings } from "@/hooks/useSiteData";
import TornPaperDivider from "@/components/ui/TornPaperDivider";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();
  const { data: settings } = useSiteSettings();
  const hero = settings.hero;
  const count = ANNOUNCEMENTS.length;

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => window.clearInterval(t);
  }, [paused, count]);

  const go = (d: number) => setIndex((i) => (i + d + count) % count);
  const current = ANNOUNCEMENTS[index];

  return (
    <section
      id="kurumsal"
      className="relative overflow-hidden bg-gradient-to-br from-[#060e20] via-primary-dark to-[#0f214a] text-white pt-10 pb-0"
    >
      {/* milligenclik.org.tr Erbakan Portresi Arka Plan Entegrasyonu */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-full lg:w-1/2 flex items-center justify-end overflow-hidden opacity-35 lg:opacity-60 select-none">
        <div className="relative h-full w-full max-w-lg">
          <Image
            src="/images/erbakan_portrait.png"
            alt="Prof. Dr. Necmettin Erbakan Portresi"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-right-bottom mix-blend-screen filter grayscale contrast-125 brightness-95"
            priority
            unoptimized
          />
          {/* Yumuşak degradeler */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e20] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent" />
        </div>
      </div>

      {/* Dekoratif Mavi Işıma */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="container-x relative grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:py-20">
        {/* Sol Kolon: Ana Manşet Metinleri */}
        <div className="lg:col-span-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-200 border border-white/10 backdrop-blur">
            <Sparkles size={14} className="text-yellow-400" />
            {hero?.badge || "Milli Gençlik Derneği Genel Merkezi"}
          </div>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl tracking-tight">
            {hero?.titleLine1 || "Gençliğin Sesi,"}
            <br />
            <span className="text-blue-300 drop-shadow-sm">
              {hero?.titleLine2 || "Milletin Geleceği"}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            {hero?.description ||
              "Milli Gençlik Derneği olarak 81 ilde; ahlak, ilim, irfan ve vatan sevgisiyle yetişen şuurlu bir gençlik için gece gündüz çalışıyoruz."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openVolunteer}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-blue-50 shadow-lg hover:shadow-xl active:scale-95"
            >
              <UserPlus size={18} className="text-primary" /> {hero?.volunteerBtnText || "Gönüllü Ol"}
            </button>
            <button
              type="button"
              onClick={openDonate}
              className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-95"
            >
              <HeartHandshake size={18} className="text-blue-300" /> {hero?.donateBtnText || "Bağış Yap"}
            </button>
          </div>
        </div>

        {/* Sağ Kolon: Öne Çıkan Duyurular Kartı */}
        <div className="lg:col-span-5">
          <div
            className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md shadow-2xl transition hover:border-white/25"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Öne Çıkan Duyurular
              </p>
              <span className="text-[11px] font-mono text-blue-300 bg-white/10 px-2 py-0.5 rounded">
                {index + 1} / {count}
              </span>
            </div>
            <div className="mt-4 min-h-[140px]" aria-live="polite">
              <h2 className="text-2xl font-bold leading-snug">{current.title}</h2>
              <p className="mt-2 text-blue-100/90 text-sm leading-relaxed">{current.text}</p>
              <a
                href={current.href}
                className="mt-3 inline-block text-sm font-semibold text-blue-200 underline underline-offset-4 hover:text-white"
              >
                Detayları İncele →
              </a>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex gap-2">
                {ANNOUNCEMENTS.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-label={`Duyuru ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Önceki"
                  onClick={() => go(-1)}
                  className="rounded-full bg-white/15 p-2 hover:bg-white/25 active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Sonraki"
                  onClick={() => go(1)}
                  className="rounded-full bg-white/15 p-2 hover:bg-white/25 active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* milligenclik.org.tr Birebir Yırtık Kâğıt Kenarlığı */}
      <TornPaperDivider fillColor="#ffffff" />
    </section>
  );
}
