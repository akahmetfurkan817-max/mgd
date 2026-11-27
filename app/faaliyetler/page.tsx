"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { ArrowLeft, Calendar, Camera, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { BASINDA_BIZ_ITEMS, type BasindaBizItem } from "@/data/basinda-biz";

export default function FaaliyetlerPage() {
  const [selectedItem, setSelectedItem] = useState<BasindaBizItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [filterLocation, setFilterLocation] = useState<string>("Tümü");

  const locations = ["Tümü", ...Array.from(new Set(BASINDA_BIZ_ITEMS.map((i) => i.location)))];

  const filtered = BASINDA_BIZ_ITEMS.filter(
    (item) => filterLocation === "Tümü" || item.location === filterLocation
  );

  const handleOpenModal = (item: BasindaBizItem) => {
    setSelectedItem(item);
    setActiveImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          pageKey="faaliyetler"
          breadcrumbLabel="Faaliyetler & Basında Biz"
          defaultTitle="Faaliyetlerimiz & Basın Arşivi"
          defaultSubtitle="81 il teşkilatımızın açılışları, salon programları, gençlik kampları, robotik kodlama atölyeleri ve saha çalışmalarımızın fotoğraf galerisi."
        />

        <section className="py-12">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 mr-2">Bölge / Şehir Filtrele:</span>
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setFilterLocation(loc)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${
                    filterLocation === loc
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenModal(item)}
                  className="group relative flex flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        <Camera size={12} /> {item.badge || "Fotoğraf Arşivi"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <MapPin size={13} className="text-blue-300" /> {item.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-white/80">
                        <Calendar size={12} /> {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.galleryImages ? `${item.galleryImages.length} Fotoğraf` : "Detaylar"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                        İncele →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition shadow-lg"
            >
              <X size={20} />
            </button>

            <div className="relative h-80 sm:h-96 w-full bg-slate-950">
              <Image
                src={
                  selectedItem.galleryImages && selectedItem.galleryImages.length > 0
                    ? selectedItem.galleryImages[activeImageIndex] || selectedItem.image
                    : selectedItem.image
                }
                alt={selectedItem.title}
                fill
                className="object-contain"
              />
              {selectedItem.galleryImages && selectedItem.galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Önceki Fotoğraf"
                    onClick={() =>
                      setActiveImageIndex((i) =>
                        i === 0 ? selectedItem.galleryImages!.length - 1 : i - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki Fotoğraf"
                    onClick={() =>
                      setActiveImageIndex((i) =>
                        i === selectedItem.galleryImages!.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {activeImageIndex + 1} / {selectedItem.galleryImages.length}
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  <MapPin size={14} /> {selectedItem.location}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={14} /> {selectedItem.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {selectedItem.title}
              </h2>
              <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedItem.content}
              </p>

              {selectedItem.galleryImages && selectedItem.galleryImages.length > 1 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Fotoğraf Galerisi ({selectedItem.galleryImages.length})
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedItem.galleryImages.map((img: string, idx: number) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-20 w-full overflow-hidden rounded-xl border-2 transition ${
                          activeImageIndex === idx ? "border-primary ring-2 ring-primary/30" : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt={`Küçük resim ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
