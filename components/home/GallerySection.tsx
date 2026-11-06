"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Tag, X } from "lucide-react";
import { GALLERY_ITEMS } from "@/data/gallery";
import type { GalleryItem } from "@/types";

export default function GallerySection() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  // Modal klavye kontrolleri (Esc, Sol/Sağ ok)
  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
      } else if (e.key === "ArrowLeft") {
        const idx = GALLERY_ITEMS.findIndex((g) => g.id === selected.id);
        const prev = (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
        setSelected(GALLERY_ITEMS[prev]);
      } else if (e.key === "ArrowRight") {
        const idx = GALLERY_ITEMS.findIndex((g) => g.id === selected.id);
        const next = (idx + 1) % GALLERY_ITEMS.length;
        setSelected(GALLERY_ITEMS[next]);
      }
    };

    window.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <section id="galeri" className="bg-surface py-20">
      <div className="container-x">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
            Sahadan Kareler
          </span>
          <h2 className="section-title mt-2">Etkinlik & Teşkilat Galerisi</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Gençlik kampları, şuralar, salon programları ve kardeşlik buluşmalarımızdan anlar.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(item);
                }
              }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-primary/80 backdrop-blur px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/40">
                    <Eye size={18} />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] text-blue-200">{item.date}</span>
                  <h3 className="text-base font-bold leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat butonu */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>

            {/* Büyük Resim */}
            <div className="relative h-[55vh] sm:h-[65vh] w-full bg-black">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Bilgi bandı */}
            <div className="p-5 text-white bg-slate-900/95 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-blue-300 mb-1">
                <Tag size={13} />
                <span>{selected.category}</span>
                <span>•</span>
                <span>{selected.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selected.title}</h3>
              {selected.description && (
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {selected.description}
                </p>
              )}
            </div>

            {/* Önceki / Sonraki butonları */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const idx = GALLERY_ITEMS.findIndex((g) => g.id === selected.id);
                const prev = (idx - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
                setSelected(GALLERY_ITEMS[prev]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition"
              aria-label="Önceki Fotoğraf"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const idx = GALLERY_ITEMS.findIndex((g) => g.id === selected.id);
                const next = (idx + 1) % GALLERY_ITEMS.length;
                setSelected(GALLERY_ITEMS[next]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition"
              aria-label="Sonraki Fotoğraf"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
