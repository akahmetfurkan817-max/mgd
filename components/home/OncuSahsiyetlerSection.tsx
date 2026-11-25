"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Film, Quote, Sparkles, User } from "lucide-react";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";

export default function OncuSahsiyetlerSection() {
  const { data: pioneers } = useOncuSahsiyetler();
  const featured = pioneers.slice(0, 3);

  const cardLayouts = [
    {
      col: "lg:col-span-5",
      height: "min-h-[390px] sm:min-h-[440px]",
      opacity: "opacity-100",
      titleSize: "text-2xl sm:text-3xl",
      showMotto: true,
    },
    {
      col: "lg:col-span-4",
      height: "min-h-[340px] sm:min-h-[375px]",
      opacity: "opacity-95 hover:opacity-100",
      titleSize: "text-xl sm:text-2xl",
      showMotto: true,
    },
    {
      col: "lg:col-span-3",
      height: "min-h-[290px] sm:min-h-[310px]",
      opacity: "opacity-80 hover:opacity-100",
      titleSize: "text-lg sm:text-xl",
      showMotto: false,
    },
  ];

  return (
    <section
      id="oncu-sahsiyetler"
      className="relative overflow-hidden bg-gradient-to-b from-[#07152B] via-[#0B1E3D] to-[#061224] py-20 sm:py-24 text-white"
    >
      {/* Arka Plan Dekoratif Parıltılar */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="container-x relative">
        {/* Üst Başlık */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-200 mb-3">
              <Sparkles size={12} className="text-amber-300" />
              <span>Davamızın Öncüleri</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
              Öncü Şahsiyetlerimiz
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-300/90 max-w-2xl leading-relaxed">
              Milli Gençlik meşalesini yakan, ömrünü ahlak, ilim ve medeniyet idealine vakfeden rehber önderlerimizin hayatı, eserleri ve hatıraları.
            </p>
          </div>

          <Link
            href="/oncu-sahsiyetler"
            className="group inline-flex items-center gap-2.5 self-start md:self-auto rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-extrabold text-primary shadow-lg shadow-black/20 transition-all duration-300 hover:bg-blue-50 hover:-translate-y-0.5"
          >
            <span>Tüm Öncü Şahsiyetleri Gör</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Kademeli Küçülen Premium Vitrin (Soldan Sağa Azala Azala Giden Perspektif) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {featured.map((leader, idx) => {
            const cfg = cardLayouts[idx] || cardLayouts[2];
            const bgSrc = leader.backgroundImage || leader.portrait;
            return (
              <Link
                key={leader.id}
                href={`/oncu-sahsiyetler/${leader.id}`}
                className={`${cfg.col} ${cfg.height} ${cfg.opacity} group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-white/15 bg-[#0D2144] shadow-2xl transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300/50`}
              >
                {/* Arka Plan / Portre */}
                {bgSrc ? (
                  <Image
                    src={bgSrc}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#102956] to-[#07152B]">
                    <User size={72} className="text-white/15" />
                  </div>
                )}

                {/* Sinematik Gradyan Katmanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040D1D] via-[#071630]/65 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#040D1D]/50 via-transparent to-transparent" />

                {/* Üst Rozet + Ok */}
                <div className="absolute top-5 inset-x-5 flex items-center justify-between gap-2 z-10">
                  <span className="inline-flex items-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100">
                    {leader.period || "Öncü Şahsiyet"}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                {/* Alt İçerik */}
                <div className="relative z-10 p-6 sm:p-7">
                  {leader.badge && (
                    <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-amber-300/95 block mb-1.5">
                      {leader.badge}
                    </span>
                  )}
                  <h3 className={`font-display ${cfg.titleSize} font-extrabold text-white leading-tight group-hover:text-blue-200 transition-colors`}>
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-300 line-clamp-1">
                    {leader.title}
                  </p>

                  {cfg.showMotto && leader.motto && (
                    <p className="mt-3.5 text-xs text-blue-100/85 italic leading-relaxed line-clamp-2 border-l-2 border-amber-400/70 pl-3">
                      <Quote size={11} className="inline mr-1 text-amber-300" />
                      {leader.motto}
                    </p>
                  )}

                  <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Film size={12} className="text-blue-300" /> {leader.videos.length} Video
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpen size={12} className="text-emerald-300" /> {leader.books.length} Eser
                      </span>
                    </div>
                    <span className="font-bold text-white group-hover:text-blue-200 inline-flex items-center gap-1">
                      İncele <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Eğer 2 şahsiyet varsa sağda kademeli küçülen 3. "Tüm Öncü Şahsiyetler" keşif kartı */}
          {featured.length < 3 && (
            <Link
              href="/oncu-sahsiyetler"
              className="lg:col-span-3 min-h-[260px] sm:min-h-[300px] group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent backdrop-blur-md p-6 sm:p-7 opacity-85 hover:opacity-100 transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-300/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-amber-300 group-hover:bg-white group-hover:text-primary transition-colors">
                  <Sparkles size={20} />
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white group-hover:text-primary transition-colors">
                  <ArrowUpRight size={16} />
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-300">
                  Arşiv &amp; Külliyat
                </span>
                <h3 className="mt-1.5 font-display text-xl font-extrabold text-white leading-snug">
                  Tüm Öncü Şahsiyetleri Keşfet
                </h3>
                <p className="mt-2 text-xs text-slate-300/85 leading-relaxed">
                  Biyografiler, tarihi konuşmalar, fotoğraf galerileri ve kitap arşivi.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 group-hover:text-white transition-colors">
                  <span>Arşive Git</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
