"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, Quote, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePresident } from "@/hooks/useSiteData";

export default function GenelBaskanPage() {
  const { data: president } = usePresident();
  const [activeTab, setActiveTab] = useState<"mesaj" | "cv">("mesaj");

  const bioParagraphs = (president.bio || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#071933] text-white flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          {/* Üst Başlık */}
          <ScrollReveal y={18} duration={650}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-300 mb-2">
                  Milli Gençlik Derneği
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Genel Başkanımız
                </h1>
              </div>

              <Link
                href="/baskanlik-divani"
                className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition"
              >
                <Users size={16} className="text-blue-300" />
                <span>Başkanlık Divanı</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>

          {/* TÜGVA İlhamlı Premium Detay Kartı */}
          <ScrollReveal delay={80} y={26} duration={750}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Sol: Büyük Renkli Portre (4 sütun) */}
              <div className="lg:col-span-4">
                <div className="relative aspect-[4/4.8] w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0C254A] shadow-2xl">
                  <Image
                    src={president.photo || "/images/ahmet-ozvatan.jpg"}
                    alt={president.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover object-top"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              {/* Sağ: Gradyanlı Detay ve Sekme Kartı (8 sütun) */}
              <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-br from-[#0F3163] via-[#0B254B] to-[#071A36] p-7 sm:p-10 shadow-2xl">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {president.name}
                      </h2>
                      <p className="mt-1 text-base sm:text-lg italic font-medium text-blue-200/90">
                        {president.title || "Milli Gençlik Derneği Genel Başkanı"}
                      </p>
                    </div>

                    {/* Sekme Seçici */}
                    <div className="inline-flex rounded-xl bg-black/25 p-1 border border-white/10 self-start">
                      <button
                        type="button"
                        onClick={() => setActiveTab("mesaj")}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                          activeTab === "mesaj"
                            ? "bg-white text-primary shadow"
                            : "text-blue-100 hover:text-white"
                        }`}
                      >
                        Genel Başkanın Mesajı
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("cv")}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                          activeTab === "cv"
                            ? "bg-white text-primary shadow"
                            : "text-blue-100 hover:text-white"
                        }`}
                      >
                        Özgeçmiş
                      </button>
                    </div>
                  </div>

                  {/* İçerik */}
                  <div className="mt-7">
                    {activeTab === "mesaj" ? (
                      <div className="space-y-5">
                        <Quote size={34} className="text-blue-300/40" />
                        <blockquote className="text-base sm:text-xl leading-relaxed text-blue-50/95 font-medium whitespace-pre-line">
                          {president.message}
                        </blockquote>
                      </div>
                    ) : (
                      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-blue-100/90">
                        {bioParagraphs.length > 0 ? (
                          bioParagraphs.map((p, idx) => <p key={idx}>{p}</p>)
                        ) : (
                          <p>
                            Milli Gençlik Derneği Genel Başkanı olarak 81 ilde, ilçelerde ve üniversite kampüslerinde gençliğin ahlak, ilim ve maneviyat çizgisinde yetişmesi için çalışmalarını sürdürmektedir.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt: Sosyal Medya İkonları (Beyaz Yuvarlatılmış) + Aksiyon */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <a
                      href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B254B] hover:bg-blue-100 transition shadow"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                      aria-label="E-Posta"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B254B] hover:bg-blue-100 transition shadow"
                    >
                      <Mail size={17} />
                    </a>
                    <a
                      href={president.xUrl || "https://x.com/milligenclikmgd"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="X"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B254B] hover:bg-blue-100 transition shadow"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>

                  <Link
                    href="/baskanlik-divani"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary hover:bg-blue-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition"
                  >
                    <span>Başkanlık Divanı&apos;nı İncele</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
