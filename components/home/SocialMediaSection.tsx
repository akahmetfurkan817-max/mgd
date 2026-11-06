"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  Instagram,
  Loader2,
  Phone,
  ThumbsUp,
  UserCheck,
} from "lucide-react";

export default function SocialMediaSection() {
  const facebookPageUrl = "https://www.facebook.com/milligenclikmgd/?ref=embed_page";
  const instagramPageUrl = "https://www.instagram.com/milligenclikmgd/";
  const instagramEmbedUrl = "https://www.instagram.com/milligenclikmgd/embed";

  // Instagram state & responsive height
  const igBoxRef = useRef<HTMLDivElement>(null);
  const [igFrameHeight, setIgFrameHeight] = useState<number>(500);
  const [igLoaded, setIgLoaded] = useState<boolean>(false);

  useEffect(() => {
    function updateDimensions() {
      if (igBoxRef.current) {
        const w = Math.max(260, Math.min(540, Math.floor(igBoxRef.current.clientWidth)));
        // Instagram embed: profil başlığı (~150px) + 2 sıra kare fotoğraf + kenar payı
        const calculatedHeight = Math.round(150 + (w / 3) * 2 + 16);
        setIgFrameHeight(Math.max(480, calculatedHeight));
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sosyal Medya
          </h2>
        </div>

        {/* 2 Kolonlu Kart Izgarası: Sol Facebook - Sağ Instagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
          
          {/* ==================== 1. FACEBOOK WIDGET KARTI ==================== */}
          <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden h-[630px] sm:h-[650px]">
            {/* Kart Üst Başlık */}
            <header className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-800 text-base sm:text-lg">Facebook</span>
              </div>

              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-blue-600/30 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold px-4 py-1.5 transition active:scale-95 uppercase tracking-wide"
              >
                TAKİP ET
              </a>
            </header>

            {/* Kart Gövdesi: Canlı Facebook Akışı Tasarımı */}
            <div className="relative flex-1 bg-white overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Kapak Görseli ve 52 Sloganı */}
                <div className="relative h-28 sm:h-32 bg-gradient-to-r from-[#07244f] via-[#0e3b7a] to-[#07244f] p-4 text-white overflow-hidden flex items-center justify-end">
                  <div className="absolute -left-6 -top-6 w-32 h-32 opacity-15 pointer-events-none">
                    <Image
                      src="/images/logo-symbol.png"
                      alt=""
                      fill
                      className="object-contain filter brightness-200"
                    />
                  </div>

                  <div className="relative z-10 text-right pr-2">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="text-3xl sm:text-4xl font-black text-blue-200 font-mono tracking-tighter drop-shadow">
                        52
                      </span>
                      <div className="text-left leading-tight">
                        <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          sevgi ve
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-blue-200 tracking-wide">
                          kardeşliğin teminatıyız
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs backdrop-blur font-bold font-serif">
                    f
                  </div>
                </div>

                {/* Profil Başlığı, Avatar ve Takipçi */}
                <div className="px-4 pb-3">
                  <div className="-mt-8 mb-2 relative z-20 w-16 h-16 rounded-full bg-white p-1 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                    <div className="relative w-full h-full rounded-full bg-slate-50 overflow-hidden">
                      <Image
                        src="/images/logo_crop.png"
                        alt="MGD Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                      MGD Genel Merkez - Milli Gençlik Derneği
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      205 B takipçi • Resmî Facebook Sayfası
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-700 mt-2 leading-relaxed">
                    &ldquo;İnsanların en hayırlısı insanlığa faydalı olandır.&rdquo;{" "}
                    <a
                      href="https://www.milligenclik.org.tr"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      www.milligenclik.org.tr
                    </a>
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Briefcase size={12} className="text-slate-500" /> Sivil Toplum Örgütü (STÖ)
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Phone size={12} className="text-slate-500" /> +90 312 472 54 54
                    </span>
                  </div>

                  {/* Mavi Takip Et Butonu */}
                  <a
                    href={facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm py-2 flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.99]"
                  >
                    <UserCheck size={16} />
                    <span>Sayfayı Takip Et</span>
                  </a>
                </div>

                {/* Son Paylaşım Akışı */}
                <div className="border-t border-slate-100 pt-3 px-4 pb-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <Image
                        src="/images/logo_crop.png"
                        alt="MGD"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-bold text-slate-800">
                        MGD Genel Merkez - Milli Gençlik Derneği
                      </span>
                      <span className="text-slate-400">• 1g</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-snug line-clamp-2 mb-2">
                    📍 52. Dönem Ekim Ayı Şube İnsan Kaynakları ve Halkla İlişkiler komisyon Başkanları Toplantısı, Genel Başkan Yardımcımız Lokman...
                  </p>

                  <a
                    href={facebookPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative h-28 sm:h-32 rounded-lg overflow-hidden border border-blue-200/80 group shadow-xs"
                  >
                    <Image
                      src="/images/slider/yeniden-milli-genclik.jpg"
                      alt="Toplantı Paylaşımı"
                      fill
                      className="object-cover group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a2f64] via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-900/80 px-2 py-0.5 rounded backdrop-blur">
                        EKİM AYI ŞUBE İNSAN KAYNAKLARI TOPLANTISI
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Alt Şerit: Tümünü Gör Bağlantısı */}
              <a
                href={facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 py-3 px-4 text-center transition group text-slate-700 shrink-0"
              >
                <ThumbsUp size={14} className="text-blue-600" />
                <span className="text-xs sm:text-sm font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                  Facebook&apos;ta tümünü gör{" "}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </article>

          {/* ==================== 2. INSTAGRAM WIDGET KARTI ==================== */}
          <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden h-[630px] sm:h-[650px]">
            {/* Kart Üst Başlık */}
            <header className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Instagram size={20} />
                </div>
                <span className="font-bold text-slate-800 text-base sm:text-lg">Instagram</span>
              </div>

              <a
                href={instagramPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-pink-500/40 text-pink-700 hover:bg-gradient-to-tr hover:from-amber-400 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent text-xs font-bold px-4 py-1.5 transition active:scale-95 uppercase tracking-wide"
              >
                TAKİP ET
              </a>
            </header>

            {/* Kart Gövdesi: Canlı Instagram Akışı */}
            <div ref={igBoxRef} className="relative flex-1 bg-white overflow-hidden flex flex-col justify-between">
              {/* Canlı Instagram Iframe */}
              <div className="relative flex-1 overflow-hidden bg-white flex flex-col justify-start">
                {!igLoaded && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-7 h-7 animate-spin text-pink-600" />
                    <span className="text-xs font-medium text-slate-500">Instagram canlı akışı yükleniyor…</span>
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
                className="flex flex-col items-center justify-center gap-0.5 border-t border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 py-3 px-4 text-center transition group text-slate-700 shrink-0"
              >
                <span className="text-xs text-slate-500 font-medium">10.000&apos;den fazla gönderi</span>
                <span className="text-xs sm:text-sm font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1.5">
                  Instagram&apos;da tümünü gör{" "}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
