"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, Film, Quote, Sparkles } from "lucide-react";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";

export default function OncuSahsiyetlerSection() {
  const { data: pioneers } = useOncuSahsiyetler();
  return (
    <section id="oncu-sahsiyetler" className="relative py-20 bg-gradient-to-b from-slate-900 via-[#0A192F] to-slate-950 text-white overflow-hidden border-b border-blue-900/30">
      {/* Arka Plan Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-x relative">
        {/* Başlık Alanı */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold uppercase tracking-widest mb-3 border border-blue-400/30">
              <Sparkles size={13} className="text-yellow-400" />
              <span>Davamızın Öncüleri & Rehber Şahsiyetler</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Öncü Şahsiyetlerimiz
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              Milli Gençlik meşalesini yakan, bir ömrü ahlak, ilim ve vatan sevgisiyle yoğrulmuş şuurlu bir neslin yetişmesine vakfeden büyük önderlerimiz.
            </p>
          </div>

          <Link
            href="/oncu-sahsiyetler"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-300 hover:text-white transition group self-start sm:self-auto"
          >
            Tüm Hayatları, Videoları & Kitapları <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Profil Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pioneers.map((leader) => (
            <div
              key={leader.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-white/10 p-6 sm:p-8 shadow-2xl hover:border-secondary/50 hover:shadow-secondary/10 transition-all duration-300"
            >
              <div>
                {/* Üst Kısım: Fotoğraf ve Rozet */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-lg shrink-0">
                    <Image
                      src={leader.portrait}
                      alt={leader.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 inline-block mb-1.5">
                      {leader.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {leader.title} • ({leader.period})
                    </p>
                  </div>
                </div>

                {/* Veciz Sözü */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold mb-1">
                    <Quote size={14} /> Şiarı:
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/90 italic leading-relaxed">
                    {leader.motto}
                  </p>
                </div>

                {/* Özet Biyografi */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {leader.bioSections[0]?.content}
                </p>
              </div>

              {/* Alt Bilgi & Butonlar */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Film size={13} className="text-red-400" /> {leader.videos.length} Video
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={13} className="text-emerald-400" /> {leader.books.length} Kitap & PDF
                  </span>
                </div>

                <Link
                  href="/oncu-sahsiyetler"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary hover:bg-secondary px-4 py-2 rounded-xl transition shadow"
                >
                  Detaylı İncele <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
