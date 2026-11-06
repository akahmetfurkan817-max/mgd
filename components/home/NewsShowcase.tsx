"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { useNews } from "@/hooks/useSiteData";
import type { NewsCategory } from "@/types";

const BADGE: Record<NewsCategory, string> = {
  "Genel Merkez": "bg-primary text-white",
  Üniversite: "bg-secondary text-white",
  "Basın Açıklaması": "bg-slate-800 text-white",
};

export default function NewsShowcase() {
  const { data: news } = useNews();
  const featuredNews = news.slice(0, 2);

  return (
    <section id="haberler" className="bg-surface py-20 border-t border-slate-200/70">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-bold text-primary mb-2">
              <Newspaper size={13} /> GÜNDEM & DUYURULAR
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Haberler & Basın Açıklamaları
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
              Genel Merkezimiz ve teşkilatlarımızdan öne çıkan son gelişmeler.
            </p>
          </div>

          <Link
            href="/haberler"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-secondary transition self-start sm:self-auto"
          >
            Tüm Haberleri İncele ({news.length}) <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredNews.map((n) => (
            <article
              key={n.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:border-blue-300"
            >
              <div className="h-44 bg-gradient-to-br from-primary-dark via-primary to-secondary relative flex items-end p-5">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-md ${BADGE[n.category]}`}>
                  {n.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-ink leading-snug hover:text-primary transition-colors">
                  {n.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {n.summary}
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarDays size={14} className="text-primary" />
                    {new Date(n.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <Link
                    href="/haberler"
                    className="font-bold text-primary hover:text-secondary inline-flex items-center gap-1"
                  >
                    Haberi Oku <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/haberler"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-dark transition active:scale-95"
          >
            Tüm Haberleri ve Açıklamaları Gör ({news.length}) <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
