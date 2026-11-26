"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, ChevronRight, Mail, MapPin, MousePointerClick, Phone, Search, User, X } from "lucide-react";
import { MAP_PROVINCES, MAP_VIEWBOX } from "@/data/turkey-map";
import { getMergedDistricts } from "@/data/turkey-districts";
import { useProvinces } from "@/hooks/useSiteData";
import Avatar from "@/components/ui/Avatar";
import type { Province } from "@/types";

function DistrictsModal({ province, onClose }: { province: Province; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const allDistricts = useMemo(
    () => getMergedDistricts(province.plate, province.districts),
    [province.plate, province.districts],
  );

  const sortedAndFiltered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("tr");
    const filtered = q
      ? allDistricts.filter(
          (d) =>
            d.name.toLocaleLowerCase("tr").includes(q) ||
            d.chairName.toLocaleLowerCase("tr").includes(q) ||
            d.phone.includes(q),
        )
      : allDistricts;

    // Bilgisi girilen ilçeleri üstte, diğerlerini alfabetik göster
    return [...filtered].sort((a, b) => {
      const aFilled = Boolean(a.chairName.trim() || a.phone.trim());
      const bFilled = Boolean(b.chairName.trim() || b.phone.trim());
      if (aFilled !== bFilled) return aFilled ? -1 : 1;
      return a.name.localeCompare(b.name, "tr");
    });
  }, [allDistricts, search]);

  const assignedCount = useMemo(
    () => allDistricts.filter((d) => d.chairName.trim() || d.phone.trim()).length,
    [allDistricts],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-[#0B1E42] via-primary-dark to-primary px-6 py-5 text-white">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-200">
              {String(province.plate).padStart(2, "0")} · İLÇE TEŞKİLATLARI
            </p>
            <h3 className="mt-1 font-display text-2xl font-extrabold">
              {province.name} İlçe Başkanları
            </h3>
            <p className="mt-1 text-xs text-blue-100/90">
              Toplam {allDistricts.length} ilçe
              {assignedCount > 0 ? ` · ${assignedCount} ilçe başkanı kayıtlı` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Arama Çubuğu */}
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İlçe adı, ilçe başkanı veya telefon ara..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* İlçe Listesi */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedAndFiltered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Aramanıza uygun ilçe bulunamadı.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {sortedAndFiltered.map((d) => {
                const hasInfo = Boolean(d.chairName.trim() || d.phone.trim());
                return (
                  <div
                    key={d.id}
                    className={`rounded-2xl border p-4 transition ${
                      hasInfo
                        ? "border-primary/25 bg-blue-50/30 shadow-xs"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            hasInfo ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Building2 size={14} />
                        </span>
                        <h4 className="truncate font-bold text-sm text-primary-dark">{d.name}</h4>
                      </div>
                      {hasInfo && (
                        <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-ink">
                        <User size={13} className="shrink-0 text-secondary" />
                        <span className={d.chairName.trim() ? "font-semibold" : "text-slate-400 italic"}>
                          {d.chairName.trim() || "İlçe başkanı bilgisi güncelleniyor"}
                        </span>
                      </div>

                      {d.phone.trim() ? (
                        <a
                          href={`tel:${d.phone.replace(/[^0-9+]/g, "")}`}
                          className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                        >
                          <Phone size={13} className="shrink-0 text-secondary" />
                          <span>{d.phone}</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone size={13} className="shrink-0" />
                          <span>Telefon eklenmemiş</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProvinceCard({
  province,
  onClose,
  onOpenDistricts,
}: {
  province: Province;
  onClose: () => void;
  onOpenDistricts: () => void;
}) {
  const districtCount = getMergedDistricts(province.plate, province.districts).length;

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
        {/* Tıklanabilir İl Başlığı → İlçe Başkanları Modalını Açar */}
        <button
          type="button"
          onClick={onOpenDistricts}
          className="group -mx-2.5 -mt-1.5 rounded-xl px-2.5 py-2 pr-8 text-left hover:bg-blue-50/80 transition w-[calc(100%-1.5rem)]"
          title={`${province.name} ilçelerini ve ilçe başkanlarını görüntüle`}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <span>{String(province.plate).padStart(2, "0")} · İl Teşkilatı</span>
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-dark group-hover:text-secondary transition-colors">
              {province.name}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary group-hover:bg-primary group-hover:text-white transition shrink-0">
              <span>{districtCount} İlçe</span>
              <ChevronRight size={13} />
            </span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-secondary/90 group-hover:underline">
            İlçe başkanları ve iletişim bilgileri için tıklayın
          </p>
        </button>

        <div className="mt-5 flex items-center gap-4">
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
  const [districtsModalOpen, setDistrictsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: provinces } = useProvinces();
  const cardRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected === null || districtsModalOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
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
  }, [selected, districtsModalOpen]);

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
              <ProvinceCard
                province={province}
                onClose={() => setSelected(null)}
                onOpenDistricts={() => setDistrictsModalOpen(true)}
              />
            ) : (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center text-slate-500">
                <MousePointerClick size={36} className="mb-3 text-secondary" />
                Detayları görmek için haritadan bir il seçin.
              </div>
            )}
          </div>
        </div>
      </div>

      {province && districtsModalOpen && (
        <DistrictsModal province={province} onClose={() => setDistrictsModalOpen(false)} />
      )}
    </section>
  );
}
