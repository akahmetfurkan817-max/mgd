"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Instagram,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function SocialMediaSection() {
  const instagramPageUrl = "https://www.instagram.com/milligenclikmgd/";
  const instagramEmbedUrl = "https://www.instagram.com/milligenclikmgd/embed";

  // Instagram iframe dinamik yükseklik hesabı
  const igBoxRef = useRef<HTMLDivElement>(null);
  const [igFrameHeight, setIgFrameHeight] = useState<number>(540);
  const [igLoaded, setIgLoaded] = useState<boolean>(false);

  useEffect(() => {
    function updateDimensions() {
      if (igBoxRef.current) {
        const w = Math.max(280, Math.min(680, Math.floor(igBoxRef.current.clientWidth)));
        // Instagram profil başlığı (~150px) + 2 sıra kare fotoğraf + kenar boşlukları
        const calculatedHeight = Math.round(150 + (w / 3) * 2 + 18);
        setIgFrameHeight(Math.max(500, calculatedHeight));
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <section
      id="sosyal-medya"
      className="py-20 bg-white relative overflow-hidden border-t border-slate-200/60 select-none z-10"
    >
      <div className="container-x relative">
        {/* Başlık (Ortalanmış ve sade) */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200/60 text-pink-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Instagram size={14} className="text-pink-600" />
            <span>Resmî Sosyal Medya Hesabımız</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sosyal Medyada Milli Gençlik
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
            Genel Merkez duyuruları, şube buluşmaları ve gençlik etkinliklerimizden anlık kareleri Instagram hesabımızdan canlı takip edin.
          </p>
        </div>

        {/* Canlı Instagram Kartı (Merkezi, Şık ve Geniş Kart Tasarımı) */}
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Kart Üst Başlık */}
            <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Instagram size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                      Instagram
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/60">
                      <Sparkles size={10} /> Canlı Akış
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">@milligenclikmgd</span>
                </div>
              </div>

              <a
                href={instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-pink-500/40 text-pink-700 hover:bg-gradient-to-tr hover:from-amber-400 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent text-xs sm:text-sm font-bold px-5 py-2 transition active:scale-95 uppercase tracking-wide shadow-xs"
              >
                TAKİP ET
              </a>
            </header>

            {/* Kart Gövdesi: Canlı Instagram Akışı */}
            <div ref={igBoxRef} className="relative bg-white overflow-hidden flex flex-col justify-between">
              {/* Canlı Instagram Iframe */}
              <div className="relative overflow-hidden bg-white flex flex-col justify-start min-h-[500px]">
                {!igLoaded && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-slate-400 gap-2.5">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                    <span className="text-xs font-semibold text-slate-600">Instagram canlı akışı yükleniyor…</span>
                  </div>
                )}

                <iframe
                  src={instagramEmbedUrl}
                  title="Milli Gençlik Derneği Instagram Akışı"
                  style={{ height: `${igFrameHeight}px` }}
                  className="w-full border-0 block"
                  scrolling="no"
                  allow="encrypted-media"
                  onLoad={() => setIgLoaded(true)}
                />
              </div>

              {/* Alt Şerit: Tümünü Gör Bağlantısı */}
              <a
                href={instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-slate-100 bg-gradient-to-r from-pink-50/50 via-slate-50 to-purple-50/50 hover:bg-slate-100/80 py-4 px-4 text-center transition group text-slate-700 shrink-0"
              >
                <Instagram size={16} className="text-pink-600" />
                <span className="text-xs sm:text-sm font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1.5">
                  10.000&apos;den fazla gönderi • Instagram&apos;da tümünü gör{" "}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
