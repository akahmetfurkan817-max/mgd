"use client";

import { useMemo, useState } from "react";
import { Mail, MapPin, MousePointerClick, Phone, Search } from "lucide-react";
import { MAP_PROVINCES, MAP_VIEWBOX } from "@/data/turkey-map";
import { useProvinces } from "@/hooks/useSiteData";
import Avatar from "@/components/ui/Avatar";
import type { Province } from "@/types";

function ProvinceCard({ province }: { province: Province }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
        {String(province.plate).padStart(2, "0")} · İl Teşkilatı
      </p>
      <h3 className="mt-1 text-2xl font-bold text-primary-dark">{province.name}</h3>

      <div className="mt-5 flex items-center gap-4">
        <Avatar name={province.chairName} src={province.chairPhoto} size={80} />
        <div>
          <p className="text-xs text-slate-500">İl Başkanı</p>
          <p className="text-lg font-semibold text-ink">{province.chairName}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-slate-700">
        <li className="flex gap-2">
          <MapPin size={18} className="mt-0.5 shrink-0 text-secondary" /> {province.address}
        </li>
        <li className="flex gap-2">
          <Phone size={18} className="shrink-0 text-secondary" /> {province.phone}
        </li>
        <li className="flex gap-2">
          <Mail size={18} className="shrink-0 text-secondary" /> {province.email}
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

  const province = useMemo(() => provinces.find((p) => p.plate === selected) ?? null, [provinces, selected]);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return [];
    return provinces.filter((p) => p.name.toLocaleLowerCase("tr").includes(q)).slice(0, 6);
  }, [provinces, query]);
  const hoverName = MAP_PROVINCES.find((p) => p.plate === hovered)?.name;

  return (
    <section id="teskilat" className="bg-surface py-20">
      <div className="container-x">
        <div className="mb-10 text-center">
          <h2 className="section-title">81 İlde Teşkilat</h2>
          <p className="mt-3 text-slate-600">Haritadan bir il seçerek il başkanlığı bilgilerine ulaşın.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
              <div className="relative mb-3 max-w-xs">
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
                      d={p.d}
                      role="button"
                      tabIndex={0}
                      aria-label={p.name}
                      aria-pressed={active}
                      onClick={() => setSelected(p.plate)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(p.plate);
                        }
                      }}
                      onMouseEnter={() => setHovered(p.plate)}
                      onMouseLeave={() => setHovered(null)}
                      fill={active ? "#1E3A8A" : hover ? "#2563EB" : "#BFD3F8"}
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

          <div className="lg:col-span-2">
            {province ? (
              <ProvinceCard province={province} />
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
