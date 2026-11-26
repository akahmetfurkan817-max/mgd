"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Download, FolderArchive, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useArchiveItems, useSiteSettings } from "@/hooks/useSiteData";

function formatTrDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function DosyaArsiviPage() {
  const { data: items } = useArchiveItems();
  const { data: settings } = useSiteSettings();
  const categories = ["Tümü", ...(settings.categories?.archive || [])];
  const [category, setCategory] = useState<string>("Tümü");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const matchCat = category === "Tümü" || item.category === category;
    const matchSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container-x">
          {/* Başlık, Arama ve Filtreler (Saadet Dosya Arşivi düzeni, MGD renkleri) */}
          <ScrollReveal y={18} duration={650}>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-8 w-1.5 rounded-full bg-primary" />
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                Dosya Arşivi
              </h1>
            </div>

            {/* Tam Genişlik Arama Çubuğu */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Medya veya arşiv içeriği ara..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none transition"
              />
            </div>

            {/* Kategori Filtre Hapları */}
            <div className="flex flex-wrap items-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                    category === cat
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* 3 Sütunlu Kart Izgarası */}
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 py-20 text-center">
              <FolderArchive size={42} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">Arşiv Dosyası Bulunamadı</h3>
              <p className="text-xs text-slate-500 mt-1">
                Seçili kategori veya arama kelimesine uygun içerik bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((item, idx) => {
                const rawUrl = (item.fileUrl || item.downloadUrl || "#").trim();
                const targetUrl =
                  rawUrl === "#" || rawUrl.startsWith("/") || /^https?:\/\//i.test(rawUrl)
                    ? rawUrl
                    : `https://${rawUrl}`;
                const isExternal = /^https?:\/\//i.test(targetUrl);

                return (
                  <ScrollReveal key={item.id} delay={(idx % 3) * 70} y={24} duration={700}>
                    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                      {/* Kapak Görseli */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={item.coverImage || "/images/mgd/haydi-milli-genclik.jpg"}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[10.5px] font-bold text-white shadow">
                          {item.category}
                        </span>
                      </div>

                      {/* Kart Gövdesi */}
                      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                        <div>
                          <h2 className="font-display text-base sm:text-lg font-extrabold text-ink leading-snug group-hover:text-primary transition-colors">
                            {item.title}
                          </h2>
                          {item.description && (
                            <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Tek Birleşik Buton: Görüntüle ve İndir (MGD Renkleri) + Tarih */}
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                          <a
                            href={targetUrl}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-secondary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
                          >
                            <Download size={14} />
                            <span>Görüntüle ve İndir</span>
                          </a>

                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0">
                            <CalendarDays size={12} />
                            {formatTrDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
