"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Heart,
  Instagram,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface InstagramGridItem {
  id: string;
  image: string;
  title: string;
  type?: "video" | "carousel" | "photo";
  likes: string;
}

const INSTAGRAM_POSTS: InstagramGridItem[] = [
  {
    id: "ig-1",
    image: "/images/slider/burs-universite.jpg",
    title: "Türkiye Geneli Eğitim & Burs Başvuruları Başladı",
    type: "video",
    likes: "2.4B",
  },
  {
    id: "ig-2",
    image: "/images/slider/genclik-soleni.jpg",
    title: "Ekim Ayı Şube İnsan Kaynakları ve Halkla İlişkiler Komisyon Toplantısı",
    type: "carousel",
    likes: "1.8B",
  },
  {
    id: "ig-3",
    image: "/images/slider/okuma-halkalari.jpg",
    title: "Milli Maarif ve İrfan Meclisi Büyük Salon Buluşması",
    type: "photo",
    likes: "3.1B",
  },
  {
    id: "ig-4",
    image: "/images/basinda-biz/teskilat.png",
    title: "81 İlde Teşkilat Seferberliği ve Saha Çalışmaları",
    type: "photo",
    likes: "1.5B",
  },
  {
    id: "ig-5",
    image: "/images/slider/haydi-milli-genclik.jpg",
    title: "Şube Liseler Komisyonu Gençlik Buluşması",
    type: "photo",
    likes: "2.2B",
  },
  {
    id: "ig-6",
    image: "/images/basinda-biz/yaz_etkinlikleri_cartoon.png",
    title: "Çocuklarla Oyun ve Yaz Etkinlikleri Atölyesi",
    type: "video",
    likes: "4.7B",
  },
];

export default function SocialMediaSection() {
  const facebookPageUrl = "https://www.facebook.com/milligenclikmgd/?ref=embed_page";
  const instagramPageUrl = "https://www.instagram.com/milligenclikmgd/";
  const instagramEmbedUrl = "https://www.instagram.com/milligenclikmgd/embed";

  // Facebook state
  const fbBoxRef = useRef<HTMLDivElement>(null);
  const [fbWidth, setFbWidth] = useState<number>(450);
  const [fbLoaded, setFbLoaded] = useState<boolean>(false);
  const [fbTimedOut, setFbTimedOut] = useState<boolean>(false);

  // Instagram state
  const igBoxRef = useRef<HTMLDivElement>(null);
  const [igWidth, setIgWidth] = useState<number>(450);
  const [igFrameHeight, setIgFrameHeight] = useState<number>(480);
  const [igLoaded, setIgLoaded] = useState<boolean>(false);
  const [igView, setIgView] = useState<"live" | "grid">("live");

  // Boyut hesaplama
  useEffect(() => {
    function updateDimensions() {
      if (fbBoxRef.current) {
        const w = Math.max(220, Math.min(500, Math.floor(fbBoxRef.current.clientWidth)));
        setFbWidth(w);
      }
      if (igBoxRef.current) {
        const w = Math.max(260, Math.min(540, Math.floor(igBoxRef.current.clientWidth)));
        setIgWidth(w);
        // Instagram embed kartı: profil başlığı (~150px) + 2 sıra kare fotoğraf + kenar payı
        const calculatedHeight = Math.round(150 + (w / 3) * 2 + 16);
        setIgFrameHeight(Math.max(460, calculatedHeight));
      }
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Facebook Watchdog timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!fbLoaded) {
        setFbTimedOut(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [fbLoaded]);

  const facebookEmbedSrc = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmilligenclikmgd&tabs=timeline&width=${fbWidth}&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&locale=tr_TR`;

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
          <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden h-[620px] sm:h-[640px]">
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

            {/* Kart Gövdesi */}
            <div ref={fbBoxRef} className="relative flex-1 bg-white overflow-hidden flex flex-col justify-center">
              {/* Yükleniyor Göstergesi */}
              {!fbLoaded && !fbTimedOut && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                  <span className="text-xs font-medium text-slate-500">Facebook akışı yükleniyor…</span>
                </div>
              )}

              {/* Canlı Facebook Sayfa Eklentisi (Iframe) */}
              <iframe
                key={`fb-embed-${fbWidth}`}
                src={facebookEmbedSrc}
                title="Milli Gençlik Derneği Facebook Akışı"
                className="w-full h-full border-0 block"
                scrolling="no"
                allow="encrypted-media"
                onLoad={() => {
                  setFbLoaded(true);
                  setFbTimedOut(false);
                }}
              />

              {/* Bloklanma / Yavaş Bağlantı Durumu Yedek Kartı */}
              {fbTimedOut && !fbLoaded && (
                <div className="absolute inset-0 bg-white z-20 flex flex-col justify-between p-6">
                  {/* Üst Logo ve Başlık */}
                  <div className="flex flex-col items-center text-center mt-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0b3874] to-[#1877F2] p-1 shadow-md mb-4 flex items-center justify-center">
                      <div className="relative w-full h-full rounded-xl bg-white p-2 overflow-hidden flex items-center justify-center">
                        <Image
                          src="/images/logo_crop.png"
                          alt="MGD"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      MGD Genel Merkez
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Milli Gençlik Derneği Resmî Facebook Sayfası
                    </p>
                    <p className="text-xs text-slate-600 mt-4 max-w-sm leading-relaxed">
                      Son paylaşımlarımızı, duyurularımızı ve etkinlik haberlerimizi Facebook üzerinden anlık takip edebilirsiniz.
                    </p>
                  </div>

                  {/* Alt Butonlar */}
                  <div className="space-y-2 mt-auto">
                    <a
                      href={facebookPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm py-3 flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.99]"
                    >
                      <span>Facebook&apos;ta Aç</span>
                      <ExternalLink size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setFbTimedOut(false);
                        setFbLoaded(false);
                      }}
                      className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 flex items-center justify-center gap-1 transition"
                    >
                      <RefreshCw size={13} />
                      Yeniden Dene
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* ==================== 2. INSTAGRAM WIDGET KARTI ==================== */}
          <article className="flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden h-[620px] sm:h-[640px]">
            {/* Kart Üst Başlık */}
            <header className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Instagram size={20} />
                </div>
                <span className="font-bold text-slate-800 text-base sm:text-lg">Instagram</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Görünüm Değiştirici: Canlı / Izgara */}
                <button
                  type="button"
                  onClick={() => setIgView(igView === "live" ? "grid" : "live")}
                  title={igView === "live" ? "Önizleme Izgarasına Geç" : "Canlı Akışa Geç"}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200 transition"
                >
                  {igView === "live" ? (
                    <>
                      <Sparkles size={12} className="text-pink-600" />
                      Izgara
                    </>
                  ) : (
                    <>
                      <RefreshCw size={12} className="text-pink-600" />
                      Canlı
                    </>
                  )}
                </button>

                <a
                  href={instagramPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pink-500/40 text-pink-700 hover:bg-gradient-to-tr hover:from-amber-400 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent text-xs font-bold px-4 py-1.5 transition active:scale-95 uppercase tracking-wide"
                >
                  TAKİP ET
                </a>
              </div>
            </header>

            {/* Kart Gövdesi */}
            <div ref={igBoxRef} className="relative flex-1 bg-white overflow-hidden flex flex-col">
              {igView === "live" ? (
                <>
                  {/* Canlı Instagram Iframe */}
                  <div className="relative flex-1 overflow-hidden bg-white flex flex-col justify-start">
                    {!igLoaded && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-pink-600" />
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

                  {/* Alt Şerit: Tümünü Gör Bağlantısı */}
                  <a
                    href={instagramPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-0.5 border-t border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 py-3.5 px-4 text-center transition group text-slate-700 shrink-0"
                  >
                    <span className="text-xs text-slate-500 font-medium">10.000&apos;den fazla gönderi</span>
                    <span className="text-xs sm:text-sm font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1.5">
                      Instagram&apos;da tümünü gör{" "}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </>
              ) : (
                /* ==================== IZGARA GÖRÜNÜMÜ ==================== */
                <div className="p-4 flex flex-col h-full justify-between">
                  {/* Profil Başlığı Box (Avatar + İsim + Takipçi + IG Rozeti) */}
                  <div className="pb-3 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {/* Instagram Hikaye Halka Efektli Avatar */}
                      <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
                        <div className="p-0.5 bg-white rounded-full">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                            <Image
                              src="/images/logo_crop.png"
                              alt="Milli Gençlik Derneği"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Kullanıcı Adı ve İstatistikler */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          milligenclikmgd
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          Milli Gençlik Derneği
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          <strong className="text-slate-800 font-bold">54 B</strong> takipçi •{" "}
                          <strong className="text-slate-800 font-bold">10.197</strong> gönderi
                        </p>
                      </div>
                    </div>

                    <a
                      href={instagramPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 transition p-1"
                      aria-label="Instagram'da gör"
                    >
                      <Instagram size={22} />
                    </a>
                  </div>

                  {/* 6'lı Fotoğraf / Video Izgarası (3x2 Birebir Grid) */}
                  <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden my-2 bg-slate-100 p-0.5">
                    {INSTAGRAM_POSTS.map((item) => (
                      <a
                        key={item.id}
                        href={instagramPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-slate-900 overflow-hidden block rounded-md"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 33vw, 200px"
                          className="object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                        />

                        {/* Sağ Üst Medya Rozeti */}
                        {item.type === "video" && (
                          <div className="absolute top-1.5 right-1.5 z-10 drop-shadow">
                            <Play size={13} className="text-white fill-white" />
                          </div>
                        )}
                        {item.type === "carousel" && (
                          <div className="absolute top-1.5 right-1.5 z-10 drop-shadow">
                            <Layers size={13} className="text-white" />
                          </div>
                        )}

                        {/* Hover Karartma Katmanı & Beğeni */}
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                          <Heart size={16} className="fill-white text-white mb-1" />
                          <span className="text-xs font-bold">{item.likes}</span>
                          <span className="text-[10px] text-pink-200 flex items-center gap-1 mt-1">
                            İncele <ExternalLink size={10} />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Alt Şerit: Tümünü Gör Bağlantısı */}
                  <a
                    href={instagramPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-0.5 border-t border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 py-2.5 px-4 rounded-xl text-center transition group text-slate-700"
                  >
                    <span className="text-xs sm:text-sm font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1.5">
                      Instagram&apos;da tümünü gör{" "}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </div>
              )}
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
