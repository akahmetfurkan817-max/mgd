"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, GraduationCap, Megaphone, Newspaper, Sparkles, Users, X } from "lucide-react";
import { useNews } from "@/hooks/useSiteData";
import type { NewsCategory, NewsItem } from "@/types";

const CATEGORY_TABS = [
  "Tümü",
  "Duyurular & Burs",
  "Programlar",
  "Teşkilattan Haberler",
  "Basın Açıklamaları",
  "Genel Merkez",
];

const BADGE_STYLES: Record<string, string> = {
  "Duyurular & Burs": "bg-emerald-600 text-white",
  Programlar: "bg-purple-600 text-white",
  "Teşkilattan Haberler": "bg-blue-600 text-white",
  "Genel Merkez": "bg-primary text-white",
  Üniversite: "bg-secondary text-white",
  "Basın Açıklaması": "bg-slate-800 text-white",
};

export default function NewsShowcase() {
  const { data: news } = useNews();
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filtered =
    activeCategory === "Tümü"
      ? news
      : news.filter((n) => n.category === activeCategory);

  const displayed = filtered.slice(0, 4);

  return (
    <section id="haberler" className="bg-surface py-20 border-t border-slate-200/70">
      <div className="container-x">
        {/* Başlık Alanı */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-bold text-primary mb-2">
              <Newspaper size={13} /> GÜNDEM, BURS & TEŞKİLAT HABERLERİ
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Haberler, Burs & Duyurular
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
              Üniversite burs sonuçları, teşkilat faaliyetleri, gençlik programları ve resmî açıklamalar.
            </p>
          </div>

          <Link
            href="/haberler"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-secondary transition self-start sm:self-auto"
          >
            Tüm Haber ve Duyurular ({news.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {/* Kategori Filtre Butonları (Burs, Program, Teşkilat vb.) */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200/80">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat === "Duyurular & Burs" ? "🎓 Duyurular & Burs" : cat}
            </button>
          ))}
        </div>

        {/* 4 Kolonlu / 2 Kolonlu Kart Izgarası */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {displayed.map((n) => (
            <article
              key={n.id}
              onClick={() => setSelectedNews(n)}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:border-secondary/40 hover:-translate-y-1 cursor-pointer duration-300"
            >
              <div>
                {/* Görsel */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={n.image || "/images/basinda-biz/antalya-il.png"}
                    alt={n.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
                        BADGE_STYLES[n.category] || "bg-primary text-white"
                      }`}
                    >
                      {n.category}
                    </span>
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {n.summary}
                  </p>
                </div>
              </div>

              {/* Alt Bilgi */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <CalendarDays size={13} className="text-secondary" />
                  {new Date(n.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="font-bold text-primary group-hover:underline">
                  İncele →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Tümünü Gör Butonu */}
        <div className="mt-12 text-center">
          <Link
            href="/haberler"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition active:scale-95"
          >
            Tüm Haber ve Burs Duyurularını Gör ({news.length}) <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Haber Detay Modalı */}
      {selectedNews && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  BADGE_STYLES[selectedNews.category] || "bg-primary text-white"
                }`}
              >
                {selectedNews.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {selectedNews.image && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-5 bg-slate-900 border border-slate-200">
                <Image
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-2">
              {selectedNews.title}
            </h3>

            <div className="text-xs text-slate-400 mb-4">
              Yayın Tarihi:{" "}
              {new Date(selectedNews.date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-normal border-t border-slate-100 pt-4">
              <p className="font-semibold text-slate-800">{selectedNews.summary}</p>
              <p>
                Milli Gençlik Derneği Genel Merkez koordinasyonunda 81 ilimizde çalışmalarımız kararlılıkla devam etmektedir. Burs, gençlik etkinlikleri ve eğitim faaliyetlerimizle ilgili tüm güncel gelişmeleri resmî portalımızdan takip edebilirsiniz.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
