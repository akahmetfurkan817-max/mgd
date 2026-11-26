"use client";

import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { EVENTS } from "@/data/events";
import type { EventItem } from "@/types";

const MONTH_NAMES = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "Gençlik Şöleni": { bg: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", text: "text-red-700" },
  "İl Kongresi": { bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-600", text: "text-blue-700" },
  "Üniversite Buluşması": { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-600", text: "text-emerald-700" },
  "İl Divanı": { bg: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-600", text: "text-purple-700" },
  "Basın Toplantısı": { bg: "bg-slate-100 text-slate-800 border-slate-300", dot: "bg-slate-700", text: "text-slate-800" },
};

interface InteractiveCalendarProps {
  onSelectEvent?: (event: EventItem) => void;
}

export default function InteractiveCalendar({ onSelectEvent }: InteractiveCalendarProps) {
  // Gerçek günün tarihiyle başla
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const setToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDay(now.getDate());
  };

  // Ayın gün sayısını ve ilk günün haftanın hangi günü olduğunu hesaplama
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfWeek = useMemo(() => {
    // 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi -> Biz Pazartesi=0 yapmak istiyoruz
    const day = new Date(currentYear, currentMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [currentYear, currentMonth]);

  // Ayın etkinliklerini günlerine göre eşleme
  const eventsByDay = useMemo(() => {
    const map = new Map<number, EventItem[]>();
    const monthName = MONTH_NAMES[currentMonth];

    EVENTS.forEach((evt) => {
      // Örn: "15 Kasım 2026"
      const parts = evt.date.split(" ");
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parts[1];
        const year = parseInt(parts[2], 10);

        if (month === monthName && year === currentYear && !isNaN(day)) {
          if (!map.has(day)) map.set(day, []);
          map.get(day)!.push(evt);
        }
      }
    });

    return map;
  }, [currentYear, currentMonth]);

  const selectedDayEvents = eventsByDay.get(selectedDay) || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Üst Bar: Ay / Yıl ve Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 bg-gradient-to-r from-primary-dark via-primary to-secondary text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <CalendarIcon size={20} className="text-blue-200" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <p className="text-xs text-blue-200">Milli Gençlik Derneği Resmî Teşkilat Ajandası</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={setToday}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition border border-white/20"
          >
            Bugün
          </button>
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/20"
            aria-label="Önceki Ay"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/20"
            aria-label="Sonraki Ay"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* SOL: GERÇEK AY TAKVİM GRİDİ (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Haftanın Günleri Başlıkları */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-3">
            {DAY_NAMES.map((d, i) => (
              <div
                key={d}
                className={`text-xs font-extrabold uppercase py-2 ${
                  i >= 5 ? "text-red-500" : "text-slate-500"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Günler Kutuları */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Ayın ilk gününden önceki boşluklar */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-14 sm:h-20 rounded-xl bg-slate-50/50 border border-transparent"
              />
            ))}

            {/* Ayın Günleri */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const hasEvents = eventsByDay.has(dayNum);
              const dayEvents = eventsByDay.get(dayNum) || [];
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => setSelectedDay(dayNum)}
                  className={`group relative h-14 sm:h-20 rounded-xl p-1.5 sm:p-2 text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? "bg-blue-50/90 border-secondary ring-2 ring-secondary/30 shadow-md"
                      : hasEvents
                      ? "bg-white border-blue-200 hover:border-secondary hover:shadow-sm"
                      : "bg-white border-slate-100 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-extrabold font-mono rounded-md px-1 ${
                        isSelected
                          ? "bg-secondary text-white"
                          : hasEvents
                          ? "text-primary font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasEvents && (
                      <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    )}
                  </div>

                  {/* Etkinlik İpuçları (Masaüstünde) */}
                  {hasEvents && (
                    <div className="hidden sm:block truncate w-full">
                      <span className="text-[10px] font-bold text-secondary bg-blue-100/70 px-1.5 py-0.5 rounded truncate block">
                        {dayEvents[0]?.city || dayEvents[0]?.category}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kategori Renk Açıklamaları (Legend) */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Kategoriler:</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Gençlik Şöleni
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> İl Kongresi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Üniversite Buluşması
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-600" /> İl Divanı
            </span>
          </div>
        </div>

        {/* SAĞ: SEÇİLİ GÜNÜN PROGRAM VE ETKİNLİK DETAYLARI (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  Günün Ajandası
                </span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedDay} {MONTH_NAMES[currentMonth]} {currentYear}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 text-primary">
                {selectedDayEvents.length} Program
              </span>
            </div>

            {/* Etkinlik Listesi */}
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((evt) => {
                  const style =
                    CATEGORY_COLORS[evt.category] || CATEGORY_COLORS["Gençlik Şöleni"];
                  return (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-secondary/40 transition flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.bg}`}
                          >
                            {evt.category}
                          </span>
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 font-mono">
                            <Clock size={12} className="text-secondary" /> {evt.time}
                          </span>
                        </div>

                        <h5 className="text-base font-bold text-slate-900 leading-snug">
                          {evt.title}
                        </h5>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-secondary shrink-0" />
                          <span>
                            <strong>{evt.city}</strong> • {evt.venue}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-primary shrink-0" />
                          <span>{evt.speaker}</span>
                        </div>
                      </div>

                      {onSelectEvent && (
                        <button
                          type="button"
                          onClick={() => onSelectEvent(evt)}
                          className="w-full text-center py-2 text-xs font-bold text-primary hover:text-secondary bg-blue-50/70 hover:bg-blue-100/70 rounded-xl transition"
                        >
                          Program Detaylarını İncele →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl bg-white border border-slate-200">
                <CalendarIcon size={36} className="mx-auto text-slate-300 mb-3" />
                <h5 className="text-sm font-bold text-slate-700">Program Bulunmuyor</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Bu tarihte henüz resmî bir program ilan edilmemiştir. Yaklaşan ilk etkinliklerimizi incelemek için takvimdeki kırmızı noktalı günlere tıklayabilirsiniz.
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 mt-6 text-xs text-slate-500 flex items-center justify-between">
            <span>T.C. Genel Merkez Koordinasyonu</span>
            <span className="font-bold text-primary">MGD Ajanda v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
