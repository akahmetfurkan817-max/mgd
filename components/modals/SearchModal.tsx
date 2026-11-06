"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  MapPin,
  Newspaper,
  Search,
  Users,
  Video,
  X,
} from "lucide-react";
import { NEWS } from "@/data/news";
import { REPORTS } from "@/data/reports";
import { EVENTS } from "@/data/events";
import { VIDEOS } from "@/data/videos";
import { LEADERS } from "@/data/leaders";
import { PROVINCES } from "@/data/provinces";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (type: string, id: string) => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    const matchedNews = NEWS.filter(
      (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedReports = REPORTS.filter(
      (r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedEvents = EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.speaker.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedVideos = VIDEOS.filter(
      (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedLeaders = LEADERS.filter(
      (l) => l.name.toLowerCase().includes(q) || l.title.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedProvinces = PROVINCES.filter(
      (p) => p.name.toLowerCase().includes(q) || p.chairName.toLowerCase().includes(q)
    ).slice(0, 3);

    const total =
      matchedNews.length +
      matchedReports.length +
      matchedEvents.length +
      matchedVideos.length +
      matchedLeaders.length +
      matchedProvinces.length;

    return {
      news: matchedNews,
      reports: matchedReports,
      events: matchedEvents,
      videos: matchedVideos,
      leaders: matchedLeaders,
      provinces: matchedProvinces,
      total,
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 flex flex-col max-h-[80vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="h-5 w-5 text-secondary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Haber, rapor, etkinlik, il veya yönetici ara..."
            className="flex-1 bg-transparent text-sm md:text-base text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
            >
              Temizle
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {!query || query.length < 2 ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="h-10 w-10 mx-auto text-blue-200 mb-3" />
              <p className="text-sm font-medium text-slate-600">Aradığınız kelimeyi yazmaya başlayın</p>
              <p className="text-xs text-slate-400 mt-1">Örn: &ldquo;Kongre&rdquo;, &ldquo;Haftalık Rapor&rdquo;, &ldquo;İstanbul&rdquo;, &ldquo;Erbakan&rdquo;, &ldquo;Maarif&rdquo;</p>
            </div>
          ) : results && results.total === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm font-semibold text-slate-700">“{query}” ile eşleşen sonuç bulunamadı.</p>
              <p className="text-xs text-slate-400 mt-1">Lütfen farklı anahtar kelimeler ile tekrar deneyin.</p>
            </div>
          ) : results ? (
            <>
              {/* Haberler */}
              {results.news.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-2">
                    <Newspaper size={14} /> Haberler & Duyurular ({results.news.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.news.map((item) => (
                      <a
                        key={item.id}
                        href="#haberler"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-blue-50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.summary}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-primary shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Raporlar */}
              {results.reports.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-2 mb-2">
                    <FileText size={14} /> Basın Bildirileri & Raporlar ({results.reports.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.reports.map((item) => (
                      <a
                        key={item.id}
                        href="#raporlar"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-blue-50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-secondary transition">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.date}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-secondary shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Takvimi */}
              {results.events.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2 mb-2">
                    <Calendar size={14} /> Program Takvimi ({results.events.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.events.map((item) => (
                      <a
                        key={item.id}
                        href="#program-takvimi"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-amber-50/50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.city} • {item.venue} • {item.date}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-amber-700 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Videolar */}
              {results.videos.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-2 mb-2">
                    <Video size={14} /> Videolar ({results.videos.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.videos.map((item) => (
                      <a
                        key={item.id}
                        href="#videolar"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-red-50/50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{item.duration} • {item.date}</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-red-600 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* İller */}
              {results.provinces.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2 mb-2">
                    <MapPin size={14} /> İl Teşkilatları ({results.provinces.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.provinces.map((p) => (
                      <a
                        key={p.plate}
                        href="#teskilat-haritasi"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-emerald-50/50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition">
                            {p.plate} - {p.name} İl Başkanlığı
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">İl Başkanı: {p.chairName}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-700 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Kadro */}
              {results.leaders.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-2 mb-2">
                    <Users size={14} /> Yönetim Kurulu ({results.leaders.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {results.leaders.map((l) => (
                      <a
                        key={l.id}
                        href="#yonetim-kurulu"
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-purple-50/50 transition group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-purple-800 transition">
                            {l.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{l.title}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-700 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Kapatmak için ESC tuşuna basabilirsiniz</span>
          <span className="font-semibold text-primary">Milli Gençlik Derneği Canlı Arama</span>
        </div>
      </div>
    </div>
  );
}
