"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, Loader2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function SocialMediaSection() {
  const { data: settings } = useSiteSettings();
  const instagramPageUrl = settings.contact?.instagramUrl || "https://www.instagram.com/milligenclikmgd/";
  const instagramEmbedUrl = `${instagramPageUrl.replace(/\/+$/, "")}/embed`;

  const igBoxRef = useRef<HTMLDivElement>(null);
  const [igFrameHeight, setIgFrameHeight] = useState<number>(540);
  const [igLoaded, setIgLoaded] = useState<boolean>(false);

  useEffect(() => {
    function updateDimensions() {
      if (igBoxRef.current) {
        const w = Math.max(280, Math.min(680, Math.floor(igBoxRef.current.clientWidth)));
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
      className="bg-white py-20 lg:py-24 border-b border-slate-200/80"
    >
      <div className="container-x">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="section-eyebrow justify-center mb-3">
            <span className="h-[1.5px] w-7 bg-gold" />
            <span>Resmî Sosyal Medya</span>
            <span className="h-[1.5px] w-7 bg-gold" />
          </div>
          <h2 className="section-title">Sosyal Medyada Milli Gençlik</h2>
          <p className="mt-2.5 text-sm text-slate-600">
            Genel Merkez duyuruları, şube buluşmaları ve gençlik etkinliklerimizden güncel paylaşımlar.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
            <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-ivory">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Instagram size={19} />
                </div>
                <div>
                  <span className="font-bold text-ink text-sm sm:text-base block leading-tight">
                    Instagram
                  </span>
                  <span className="text-xs text-slate-500 font-medium">@milligenclikmgd</span>
                </div>
              </div>

              <a
                href={instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white hover:border-primary hover:bg-primary hover:text-white text-ink text-xs font-bold px-4 py-2 transition-all uppercase tracking-wider"
              >
                Takip Et
              </a>
            </header>

            <div ref={igBoxRef} className="relative bg-white overflow-hidden">
              <div className="relative overflow-hidden bg-white min-h-[500px]">
                {!igLoaded && (
                  <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-slate-400 gap-2.5">
                    <Loader2 className="w-7 h-7 animate-spin text-primary" />
                    <span className="text-xs font-medium text-slate-500">Instagram akışı yükleniyor…</span>
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

              <a
                href={instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-t border-slate-100 bg-ivory hover:bg-slate-100/80 py-4 px-4 text-center transition group text-ink"
              >
                <Instagram size={15} className="text-gold" />
                <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                  Instagram&apos;da tüm gönderileri gör
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
