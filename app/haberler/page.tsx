"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CalendarDays, Newspaper, Search, X, ArrowLeft } from "lucide-react";
import { useNews } from "@/hooks/useSiteData";
import Link from "next/link";
import type { NewsCategory, NewsItem } from "@/types";

const FILTERS: ("Tümü" | NewsCategory)[] = [
  "Tümü",
  "Duyurular & Burs",
  "Programlar",
  "Teşkilattan Haberler",
  "Genel Merkez",
  "Basın Açıklaması",
  "Üniversite",
];

const BADGE: Record<NewsCategory, string> = {
  "Duyurular & Burs": "bg-emerald-600 text-white",
  Programlar: "bg-purple-600 text-white",
  "Teşkilattan Haberler": "bg-blue-600 text-white",
  "Genel Merkez": "bg-primary text-white",
  Üniversite: "bg-secondary text-white",
  "Basın Açıklaması": "bg-slate-800 text-white",
};

export default function HaberlerPage() {
  const { data: news } = useNews();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tümü");
  const [search, setSearch] = useState("");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const filtered = news.filter((n) => {
    const matchesCat = filter === "Tümü" || n.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-slate-950 via-primary-dark to-slate-900 text-white py-16 sm:py-20 border-b border-blue-900/30">
          <div className="container-x">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Ana Sayfa
              </Link>
              <span>/</span>
              <span>Haberler & Basın</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
              Haberler & Basın Açıklamaları
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
              Milli Gençlik Derneği Genel Merkezimiz, il teşkilatlarımız ve üniversite birimlerimizin tüm haberleri, basın duyuruları ve bültenleri.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-x">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${
                      filter === f
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Haber veya duyuru ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs sm:text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <Newspaper size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700">Haber Bulunamadı</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arama kriterlerinize uygun bir haber veya basın açıklaması yer almıyor.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((n) => (
                  <article
                    key={n.id}
                    onClick={() => setSelectedNews(n)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:border-blue-400/60 cursor-pointer"
                  >
                    <div className="h-44 bg-gradient-to-br from-primary-dark via-primary to-secondary relative flex items-end p-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${BADGE[n.category]}`}>
                        {n.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                        {n.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {n.summary}
                      </p>
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarDays size={14} className="text-primary" />
                          {new Date(n.date).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-bold text-primary group-hover:underline">
                          Detayları Oku →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedNews && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setSelectedNews(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[selectedNews.category]}`}>
              {selectedNews.category}
            </span>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-4 leading-snug">
              {selectedNews.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 mb-6 pb-4 border-b border-slate-100">
              <CalendarDays size={14} />
              <span>
                {new Date(selectedNews.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span>Milli Gençlik Derneği Genel Merkezi</span>
            </div>

            <div className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed space-y-4">
              <p className="font-semibold text-slate-800 text-sm sm:text-base">
                {selectedNews.summary}
              </p>
              <p>
                Milli Gençlik Derneği olarak milletimizin birlik ve beraberliği, gençlerimizin milli ve manevi değerlerle donanması yolunda çalışmalarımızı kararlılıkla sürdürüyoruz. Genel Merkezimiz koordinasyonunda Türkiye&apos;nin dört bir yanında gençlerimize yönelik ahlak, ilim, sanat ve teknoloji faaliyetlerimiz kesintisiz devam etmektedir.
              </p>
              <p>Kamuoyuna saygıyla duyurulur.</p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
