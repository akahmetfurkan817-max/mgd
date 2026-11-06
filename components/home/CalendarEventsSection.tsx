"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { EVENTS } from "@/data/events";
import EventModal from "@/components/modals/EventModal";
import InteractiveCalendar from "@/components/calendar/InteractiveCalendar";
import type { EventItem } from "@/types";

export default function CalendarEventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <section id="program-takvimi" className="relative py-20 bg-gradient-to-b from-slate-50 to-blue-50/30 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarIcon size={13} />
              <span>Resmî Teşkilat Ajandası & Takvim</span>
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
            Tüm Takvimi Tam Ekran İncele ({EVENTS.length}) <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gerçek İnteraktif Aylık Takvim Modülü */}
        <InteractiveCalendar onSelectEvent={(evt) => setSelectedEvent(evt)} />
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
