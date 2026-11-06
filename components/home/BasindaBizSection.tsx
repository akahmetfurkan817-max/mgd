"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Camera, MapPin, X } from "lucide-react";
import { BASINDA_BIZ_ITEMS, type BasindaBizItem } from "@/data/basinda-biz";

export default function BasindaBizSection() {
  const [selectedItem, setSelectedItem] = useState<BasindaBizItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const displayedItems = BASINDA_BIZ_ITEMS.slice(0, 2);

  const handleOpenModal = (item: BasindaBizItem) => {
    setSelectedItem(item);
    setActiveImageIndex(0);
  };

  return (
    <section id="basinda-biz" className="py-20 bg-slate-50/60 border-t border-slate-200/60">
      <div className="container-x">
        {/* Başlık Alanı */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-bold text-primary mb-3">
              <Camera size={14} /> MİLLİ GENÇLİK SAHADA
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Basında Biz & Faaliyetlerimiz
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600 text-sm sm:text-base">
              81 il teşkilatımızın açılışları, gençlik buluşmaları, yaz etkinlikleri ve saha çalışmalarımızdan anlar.
            </p>
          </div>

          <Link
            href="/faaliyetler"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-secondary transition self-start sm:self-auto"
          >
            Tüm Faaliyetleri Gör ({BASINDA_BIZ_ITEMS.length}) <ArrowRight size={15} />
          </Link>
        </div>

        {/* 2 Kolonlu Öne Çıkan Kart Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Görsel Alanı */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Fotoğraf Arşivi Rozeti (milligenclik.org.tr Stili) */}
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-dark/90 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-sm">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* İçerik & Başlık */}
              <div className="p-5 flex flex-col flex-1 justify-between text-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition line-clamp-2 leading-snug min-h-[44px] flex items-center justify-center">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> {item.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {item.date}
                    </span>
                  </div>
                </div>

                {/* "Detaylar" Butonu (Screenshot 2 devtools stili .btn-style-two) */}
                <div className="mt-5">
                  <span
                    className="inline-flex items-center justify-center gap-1.5 rounded-[25px] border border-[#e0e0e0] px-6 py-2 text-sm font-semibold text-slate-700 bg-white group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200 shadow-sm"
                  >
                    Detaylar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Tümünü Gör Butonu */}
        <div className="mt-10 text-center">
          <Link
            href="/faaliyetler"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-dark transition active:scale-95"
          >
            Tüm Faaliyet ve Etkinlik Fotoğraf Arşivini Gör ({BASINDA_BIZ_ITEMS.length}) <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Detay & Fotoğraf Arşivi Modalı */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-3xl my-8 rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat Butonu */}
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
            >
              <X size={20} />
            </button>

            {/* Modal Başlık Bilgileri */}
            <div className="mb-4 pr-10">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-primary mb-2">
                {selectedItem.category} • {selectedItem.badge}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {selectedItem.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" /> {selectedItem.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {selectedItem.date}
                </span>
              </div>
            </div>

            {/* Büyük Görsel */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-6 border border-slate-200">
              <Image
                src={
                  selectedItem.galleryImages && selectedItem.galleryImages.length > 0
                    ? selectedItem.galleryImages[activeImageIndex] || selectedItem.image
                    : selectedItem.image
                }
                alt={selectedItem.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Çoklu Fotoğraf Galerisi Küçük Önizlemeleri */}
            {selectedItem.galleryImages && selectedItem.galleryImages.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Etkinlik Fotoğraf Galerisi ({selectedItem.galleryImages.length} Kare)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedItem.galleryImages.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${selectedItem.title} fotoğraf ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metin Açıklaması */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base border-t border-slate-100 pt-4">
              <p>{selectedItem.content}</p>
            </div>

            {/* Alt Kapat Butonu */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition active:scale-95"
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
