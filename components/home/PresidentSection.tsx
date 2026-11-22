"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { usePresident } from "@/hooks/useSiteData";

export default function PresidentSection() {
  const { data: president } = usePresident();
  const [activeTab, setActiveTab] = useState<"mesaj" | "cv">("mesaj");

  const bioParagraphs = (president.bio || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="yonetim" className="bg-white py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container-x">
        {/* Üst Başlık ve Sekme Çubuğu */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="h-[1.5px] w-7 bg-gold" />
              <span>Genel Merkez Liderliği</span>
            </div>
            <h2 className="section-title">{president.name}</h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {president.title || "Milli Gençlik Derneği Genel Başkanı"}
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-surface p-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("mesaj")}
              className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "mesaj"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-ink"
              }`}
            >
              Genel Başkanın Mesajı
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cv")}
              className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "cv"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-ink"
              }`}
            >
              Özgeçmiş &amp; Biyografi
            </button>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Sol: Portre ve İletişim */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-ivory">
              <div className="relative aspect-[4/4.5] w-full bg-slate-100">
                <Image
                  src={president.photo || "/images/ahmet-ozvatan.jpg"}
                  alt={president.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top"
                  unoptimized
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-xl font-bold text-ink">{president.name}</h3>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gold">
                  {president.title || "Genel Başkan"}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
                  >
                    <Mail size={13} className="text-gold" /> E-Posta
                  </a>
                  <a
                    href={president.xUrl || "https://x.com/milligenclikmgd"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
                  >
                    X / Twitter
                  </a>
                  <a
                    href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Mesaj veya Biyografi */}
          <div className="lg:col-span-8">
            {activeTab === "mesaj" ? (
              <div className="animate-fade-in-up">
                <div className="font-serif text-6xl leading-none text-gold/40 select-none mb-2">&ldquo;</div>
                <blockquote className="font-serif text-xl sm:text-2xl lg:text-[26px] leading-relaxed text-ink font-normal whitespace-pre-line">
                  {president.message}
                </blockquote>

                <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-ink">{president.name}</p>
                    <p className="text-xs text-slate-500">{president.title || "Milli Gençlik Derneği Genel Başkanı"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cv")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors self-start sm:self-auto"
                  >
                    <span>Özgeçmişi İncele</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in-up space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    {president.name} — Özgeçmiş
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                    Biyografi
                  </span>
                </div>

                {bioParagraphs.length > 0 ? (
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
                    {bioParagraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
                    <p>
                      <strong>Ahmet Özvatan</strong>, 1983 yılında Bilecik&apos;in Söğüt ilçesinde dünyaya geldi. İlk ve orta öğrenimini Bilecik İmam Hatip Ortaokulunda, lise öğrenimini Sakarya İmam Hatip Lisesinde tamamladı.
                    </p>
                    <p>
                      Yükseköğrenimini <strong>Ankara Üniversitesi İlahiyat Fakültesi</strong> ve eş zamanlı olarak <strong>Anadolu Üniversitesi İktisat Fakültesi Kamu Yönetimi Bölümü</strong>&apos;nde tamamladı.
                    </p>
                    <p>
                      Prof. Dr. Necmettin Erbakan Vakfı Bilecik İl Başkanlığı, Ege Bölgesi Eğitim Başkanlığı ve Genel Başkan Danışmanlığı görevlerinin ardından Milli Gençlik Derneği (MGD) Genel Başkanlığı görevini sürdürmektedir. Evli ve 3 çocuk babasıdır.
                    </p>
                  </div>
                )}

                <div className="pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("mesaj")}
                    className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors"
                  >
                    ← Mesaja Dön
                  </button>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/etkinlikler"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-ink hover:border-primary hover:text-primary transition-colors"
                    >
                      Program Takvimi <ArrowRight size={13} />
                    </Link>
                    <Link
                      href="/faaliyetler"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-colors"
                    >
                      Faaliyetler
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
