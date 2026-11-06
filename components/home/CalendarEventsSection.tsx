"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { EVENTS } from "@/data/events";
import EventModal from "@/components/modals/EventModal";
import type { EventItem } from "@/types";

export default function CalendarEventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Homepage only shows top 2 upcoming events
  const displayedEvents = EVENTS.slice(0, 2);

  return (
    <section id="program-takvimi" className="relative py-16 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarIcon size={13} />
              <span>Teşkilat & Genel Başkan Ajandası</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Program Takvimi
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl">
              Genel Başkanımız Sayın Ahmet Özvatan&apos;ın ve Genel Merkez heyetimizin 81 ildeki ziyaret, kongre ve gençlik buluşmaları.
            </p>
          </div>

          <Link
            href="/etkinlikler"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition group self-start sm:self-auto"
          >
            Tüm Takvimi İncele ({EVENTS.length}) <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Events Grid: 2 Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="group relative flex flex-col justify-between bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Top Badge & Date Block */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-white text-center shadow-sm">
                    <span className="block text-[10px] uppercase font-bold text-blue-200">
                      {event.date.split(" ")[1] || "KASIM"}
                    </span>
                    <span className="block text-xl font-extrabold leading-none">
                      {event.date.split(" ")[0]}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      event.status === "Yaklaşan"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                    {event.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition line-clamp-2 mt-0.5">
                    {event.title}
                  </h3>
                </div>

                {/* Event Location & Speaker Meta */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-secondary shrink-0" />
                    <span className="truncate">
                      <strong>{event.city}</strong> — {event.venue}
                    </span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-secondary shrink-0" />
                      <span>Saat: {event.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-secondary shrink-0" />
                    <span className="truncate">{event.speaker}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-secondary group-hover:text-primary transition flex items-center gap-1">
                  Program Detayı <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-slate-400">İncele</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link to Full Calendar */}
        <div className="mt-10 text-center">
          <Link
            href="/etkinlikler"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-secondary text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all group"
          >
            <span>81 İldeki Tüm Teşkilat Programlarını ve Ajandayı İncele ({EVENTS.length})</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Detail Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
