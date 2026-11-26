"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FileText,
  Newspaper,
  Search,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useNews, useSiteSettings } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";

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

function HaberlerContent() {
  const searchParams = useSearchParams();
  const { data: news } = useNews();
  const { data: settings } = useSiteSettings();
  const filters = ["Tümü", ...(settings.categories?.news || [])];
  const [filter, setFilter] = useState<string>("Tümü");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam && filters.includes(catParam)) {
      setFilter(catParam);
    }
  }, [searchParams, filters]);

  const filtered = news.filter((n) => {
    const matchesCat = filter === "Tümü" || n.category === filter;
    const matchesSearch =
      search.trim() === "" ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const showHeroBento = filtered.length >= 3 && search.trim() === "";
  const heroMain = showHeroBento ? filtered[0] : null;
  const heroSide = showHeroBento ? filtered.slice(1, 3) : [];
  const gridItems = showHeroBento ? filtered.slice(3) : filtered;

  return (
    <main className="flex-1 bg-white">
      {/* Üst Başlık ve Hızlı Alt Bölümler */}
      <section className="pt-10 pb-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container-x">
          <ScrollReveal y={18} duration={650}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-8 w-1.5 rounded-full bg-primary" />
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                    Gündem ve Haberler
                  </h1>
                </div>
                <p className="mt-2.5 text-sm text-slate-600 max-w-2xl">
                  Milli Gençlik Derneği genel merkez haberleri, burs duyuruları, teşkilat faaliyetleri, basın bildirileri ve yayınlar.
                </p>
              </div>

              {/* Arama Kutusu */}
              <div className="relative w-full lg:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Haber veya duyuru ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-ink shadow-xs focus:border-primary focus:outline-none transition"
                />
              </div>
            </div>

            {/* Haberler Altındaki Hızlı Bağlantı Kartları */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/faaliyetler"
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 hover:border-primary/40 hover:bg-blue-50/40 transition"
              >
                <span className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-ink group-hover:text-primary">
                  <Users size={16} className="text-secondary" /> Teşkilat Faaliyetleri
                </span>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                href="/raporlar"
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 hover:border-primary/40 hover:bg-blue-50/40 transition"
              >
                <span className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-ink group-hover:text-primary">
                  <FileText size={16} className="text-secondary" /> Basın Bildirileri &amp; Raporlar
                </span>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                href="/yayinlar"
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 hover:border-primary/40 hover:bg-blue-50/40 transition"
              >
                <span className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-ink group-hover:text-primary">
                  <BookOpen size={16} className="text-secondary" /> Yayınlar &amp; E-Kütüphane
                </span>
                <ChevronRight size={15} className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Kategori Filtre Hapları */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    filter === f
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* İçerik Alanı */}
      <section className="py-10 sm:py-12">
        <div className="container-x space-y-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
              <Newspaper size={42} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">Haber Bulunamadı</h3>
              <p className="text-xs text-slate-500 mt-1">
                Seçili kategori veya arama kriterlerine uygun bir haber bulunmuyor.
              </p>
            </div>
          ) : (
            <>
              {/* Saadet Partisi Tarzı Asimetrik Manşet Bento Vitrini */}
              {showHeroBento && heroMain && (
                <ScrollReveal y={26} duration={750}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Sol Büyük Manşet Kartı (8 sütun) */}
                    <Link
                      href={`/haberler/${slugify(heroMain.title) || heroMain.id}`}
                      className="lg:col-span-8 group relative block min-h-[360px] sm:min-h-[450px] overflow-hidden rounded-3xl bg-primary-dark shadow-lg"
                    >
                      <Image
                        src={heroMain.image || "/images/mgd/haydi-milli-genclik.jpg"}
                        alt={heroMain.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      <div className="absolute top-5 left-5">
                        <span className="rounded-full bg-primary/90 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-white shadow">
                          {heroMain.category}
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-9">
                        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-sm">
                          {heroMain.title}
                        </h2>
                        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-extrabold text-primary shadow-md transition-all group-hover:bg-blue-50 group-hover:gap-2.5">
                          <span>Devamını Oku</span>
                          <ChevronRight size={15} />
                        </div>
                      </div>
                    </Link>

                    {/* Sağ Üst Üste 2 Öne Çıkan Kart (4 sütun) */}
                    <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                      {heroSide.map((item) => (
                        <Link
                          key={item.id}
                          href={`/haberler/${slugify(item.title) || item.id}`}
                          className="group relative block min-h-[212px] overflow-hidden rounded-3xl bg-primary-dark shadow-md"
                        >
                          <Image
                            src={item.image || "/images/mgd/nicin-milli-genclik.jpg"}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                          <div className="absolute bottom-0 inset-x-0 p-5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block mb-1">
                              {item.category}
                            </span>
                            <h3 className="font-display text-base sm:text-lg font-extrabold text-white leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
                              {item.title}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Alt 3 Sütunlu Temiz Haber Izgarası */}
              {gridItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                  {gridItems.map((n, idx) => (
                    <ScrollReveal key={n.id} delay={(idx % 3) * 70} y={24} duration={700}>
                      <Link
                        href={`/haberler/${slugify(n.title) || n.id}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                          <Image
                            src={n.image || "/images/mgd/11102025-il-baskanlari-toplantisi.jpg"}
                            alt={n.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[10.5px] font-bold text-white shadow">
                            {n.category}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col pt-4 px-1">
                          <h3 className="font-display text-base sm:text-lg font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {n.title}
                          </h3>
                          <p className="mt-2 flex-1 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {n.summary}
                          </p>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <CalendarDays size={13} />
                              {formatTrDate(n.date)}
                            </span>
                            <span className="inline-flex items-center gap-1 font-extrabold text-primary group-hover:text-secondary transition-colors">
                              Haberin Devamı <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default function HaberlerPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 bg-white py-24 text-center text-sm text-slate-400">Yükleniyor...</div>}>
        <HaberlerContent />
      </Suspense>
      <Footer />
    </div>
  );
}
