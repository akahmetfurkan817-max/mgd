"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useNews, useSiteSettings } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";

export default function NewsShowcase() {
  const { data: news } = useNews();
  const { data: settings } = useSiteSettings();
  const categoryTabs = ["Tümü", ...(settings.categories?.news || [])];
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filtered =
    activeCategory === "Tümü"
      ? news
      : news.filter((n) => n.category === activeCategory);

  const displayed = filtered.slice(0, 4);

  return (
    <section id="haberler" className="bg-ivory py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container-x">
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200/80">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="h-[1.5px] w-7 bg-gold" />
              <span>Gündem &amp; Duyurular</span>
            </div>
            <h2 className="section-title">Haberler, Burs &amp; Duyurular</h2>
          </div>

          <Link
            href="/haberler"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-gold transition-colors self-start sm:self-auto group"
          >
            <span>Tüm Haberler ({news.length})</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Kategori Sekmeleri */}
        <div className="mt-6 mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Haber Kartları — Doğrudan haber detay sayfasına gider */}
        {displayed.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-14 text-center">
            <p className="text-sm text-slate-500">Bu kategoride henüz yayınlanmış bir içerik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayed.map((n) => (
              <Link
                key={n.id}
                href={`/haberler/${slugify(n.title)}`}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={n.image || "/images/basinda-biz/antalya-il.png"}
                      alt={n.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                      {n.category}
                    </span>
                    <h3 className="mt-2 font-serif text-lg font-bold text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {n.title}
                    </h3>
                    <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {n.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <CalendarDays size={13} className="text-gold" />
                    {new Date(n.date).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-primary group-hover:text-gold transition-colors">
                    Oku →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
