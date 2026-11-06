"use client";

import { useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Tag,
  User,
  X,
} from "lucide-react";
import type { EventItem } from "@/types";

interface EventModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const handleAddToCalendar = () => {
    alert(`"${event.title}" etkinliği takviminize kaydedildi!`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-dark via-primary to-secondary text-white">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                event.status === "Yaklaşan"
                  ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                  : "bg-slate-500/30 text-slate-300 border border-slate-400/40"
              }`}
            >
              {event.status}
            </span>
            <span className="text-xs text-blue-200/80">• {event.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 leading-snug">{event.title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-sm">
            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500">TARİH</p>
                <p className="font-bold text-primary-dark">{event.date}</p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center gap-3 text-slate-700">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">SAAT</p>
                  <p className="font-bold text-primary-dark">{event.time}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500">ŞEHİR / MEKÂN</p>
                <p className="font-bold text-primary-dark">{event.city}</p>
                <p className="text-xs text-slate-600">{event.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <User className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-slate-500">KONUŞMACI / KATILIMCI</p>
                <p className="font-bold text-primary-dark">{event.speaker}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Program Hakkında</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Kapat
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCalendar}
              className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Calendar size={14} /> Takvimime Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
