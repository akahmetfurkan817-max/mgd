"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { EVENTS } from "@/data/events";
import EventModal from "@/components/modals/EventModal";
import type { EventItem } from "@/types";

export default function EtkinliklerPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const categories = ["all", "İl Kongresi", "Üniversite Buluşması", "Gençlik Şöleni", "Basın Toplantısı"];

  const filtered = filter === "all" ? EVENTS : EVENTS.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-slate-950 via-primary-dark to-slate-900 text-white py-16 sm:py-20 border-b border-blue-900/30">
          <div className="container-x">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Ana Sayfa
              </Link>
              <span>/</span>
              <span>Teşkilat Takvimi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading">
              Program Takvimi & Etkinlikler
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
              Genel Başkanımız Sayın Ahmet Özvatan&apos;ın ve Genel Merkez heyetimizin 81 ildeki ziyaretleri, kongreleri, üniversite buluşmaları ve gençlik etkinlikleri.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-slate-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition ${
                    filter === cat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat === "all" ? "Tümü" : cat}
                </button>
              ))}
            </div>

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
          </div>
        </section>
      </main>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      <Footer />
    </div>
  );
}
