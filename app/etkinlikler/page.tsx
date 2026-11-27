"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar as CalendarIcon, Clock, List, MapPin, User } from "lucide-react";
import { useEvents } from "@/hooks/useSiteData";
import EventModal from "@/components/modals/EventModal";
import InteractiveCalendar from "@/components/calendar/InteractiveCalendar";
import PageHero from "@/components/ui/PageHero";
import type { EventItem } from "@/types";

export default function EtkinliklerPage() {
  const { data: events } = useEvents();
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filter, setFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const categories = ["all", "İl Kongresi", "Üniversite Buluşması", "Gençlik Şöleni", "İl Divanı", "Basın Toplantısı"];

  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <PageHero
          pageKey="etkinlikler"
          breadcrumbLabel="Teşkilat Takvimi"
          defaultTitle="Program Takvimi & Etkinlikler"
          defaultSubtitle="Genel Başkanımız Sayın Ahmet Özvatan'ın ve Genel Merkez heyetimizin 81 ildeki ziyaretleri, kongreleri, üniversite buluşmaları ve gençlik etkinlikleri."
        />

        <section className="py-12">
          <div className="container-x">
            {/* Görünüm Seçici (Takvim vs Liste) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    viewMode === "calendar"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <CalendarIcon size={16} /> Aylık Takvim Görünümü
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    viewMode === "list"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <List size={16} /> Liste Görünümü
                </button>
              </div>

              {viewMode === "list" && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilter(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                        filter === cat
                          ? "bg-secondary text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat === "all" ? "Tümü" : cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GÖRÜNÜM 1: GERÇEK İNTERAKTİF AYLIK TAKVİM */}
            {viewMode === "calendar" ? (
              <InteractiveCalendar onSelectEvent={(evt) => setSelectedEvent(evt)} />
            ) : (
              /* GÖRÜNÜM 2: LİSTE GÖRÜNÜMÜ */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-blue-400/60 transition-all duration-300 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-primary">
                          {event.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={13} /> {event.time}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <MapPin size={14} className="text-primary" /> {event.city} — {event.venue}
                      </span>
                      <span className="font-bold text-primary group-hover:underline">
                        Detayları Gör →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
