"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Mail, MapPin, MousePointerClick, Phone, Search, X } from "lucide-react";
import { MAP_PROVINCES, MAP_VIEWBOX } from "@/data/turkey-map";
import { useProvinces } from "@/hooks/useSiteData";
import Avatar from "@/components/ui/Avatar";
import type { Province } from "@/types";

function ProvinceCard({ province, onClose }: { province: Province; onClose: () => void }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm relative flex flex-col justify-between">
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink transition"
      >
        <X size={18} />
      </button>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-secondary">
          {String(province.plate).padStart(2, "0")} · İl Teşkilatı
        </p>
        <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-primary-dark pr-8">
          {province.name}
        </h3>

        <div className="mt-6 flex items-center gap-4">
          <Avatar name={province.chairName} src={province.chairPhoto} size={88} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">İl Başkanı</p>
            <p className="mt-0.5 text-lg sm:text-xl font-bold text-ink">{province.chairName}</p>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-3.5 text-sm sm:text-[15px] text-slate-700 pt-5 border-t border-slate-100">
        <li>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${province.address} ${province.name}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex gap-2 hover:text-primary transition-colors group"
          >
            <MapPin size={18} className="mt-0.5 shrink-0 text-secondary" />
            <span className="group-hover:underline underline-offset-4">{province.address}</span>
          </a>
        </li>
        <li>
          <a
            href={`tel:${province.phone.replace(/[^0-9+]/g, "")}`}
            className="flex gap-2 hover:text-primary transition-colors group"
          >
            <Phone size={18} className="shrink-0 text-secondary" />
            <span className="group-hover:underline underline-offset-4">{province.phone}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${province.email}`}
            className="flex gap-2 hover:text-primary transition-colors group"
          >
            <Mail size={18} className="shrink-0 text-secondary" />
            <span className="group-hover:underline underline-offset-4">{province.email}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function TurkeyMap() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const { data: provinces } = useProvinces();
  const cardRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Harita üzerindeki il (path), bilgi kartı veya il arama kutusu dışına tıklandığında seçimi temizle
      if (target.closest("path[data-province]")) return;
      if (cardRef.current?.contains(target)) return;
      if (searchRef.current?.contains(target)) return;
      setSelected(null);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [selected]);

  const province = useMemo(() => provinces.find((p) => p.plate === selected) ?? null, [provinces, selected]);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return [];
    return provinces.filter((p) => p.name.toLocaleLowerCase("tr").includes(q)).slice(0, 6);
  }, [provinces, query]);
  const hoverName = MAP_PROVINCES.find((p) => p.plate === hovered)?.name;

  return (
    <section id="teskilat" className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="container-x relative z-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              AYNI İDEAL, FARKLI ŞEHİRLER
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Size en yakın <span className="text-primary">Millî Gençlik.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-500 sm:text-right leading-relaxed font-medium">
            Haritadan ilinizi seçin.
            <br className="hidden sm:inline" /> Teşkilatınızla tanışın.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-8">
            <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
              <div ref={searchRef} className="relative mb-3 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="İl ara..."
                  aria-label="İl ara"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none"
                />
                {results.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                    {results.map((r) => (
                      <li key={r.plate}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-surface"
                          onClick={() => {
                            setSelected(r.plate);
                            setQuery("");
                          }}
                        >
                          {r.plate} – {r.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <svg viewBox={MAP_VIEWBOX} className="h-auto w-full" role="group" aria-label="Türkiye il haritası">
                {MAP_PROVINCES.map((p) => {
                  const active = p.plate === selected;
                  const hover = p.plate === hovered;
                  return (
                    <path
                      key={p.plate}
                      data-province={p.plate}
                      d={p.d}
                      role="button"
                      tabIndex={0}
                      aria-label={p.name}
                      aria-pressed={active}
                      onClick={() => setSelected((prev) => (prev === p.plate ? null : p.plate))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected((prev) => (prev === p.plate ? null : p.plate));
                        }
                      }}
                      onMouseEnter={() => setHovered(p.plate)}
                      onMouseLeave={() => setHovered(null)}
                      fill={active ? "#1B3B7B" : hover ? "#1D56B8" : "#C9DCF6"}
                      stroke="#FFFFFF"
                      strokeWidth={active ? 1.6 : 0.9}
                      strokeLinejoin="round"
                      className="cursor-pointer transition-colors duration-150"
                    />
                  );
                })}
              </svg>
              <p className="mt-2 h-5 text-center text-sm font-medium text-primary">{hoverName ?? ""}</p>
            </div>
          </div>

          <div ref={cardRef} className="lg:col-span-4">
            {province ? (
              <ProvinceCard province={province} onClose={() => setSelected(null)} />
            ) : (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
                <MousePointerClick size={36} className="mb-3 text-secondary" />
                Detayları görmek için haritadan bir il seçin.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
