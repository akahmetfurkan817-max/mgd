"use client";

import { Building2, CalendarCheck, GraduationCap, Users2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

const ICONS = [Building2, GraduationCap, Users2, CalendarCheck];

export default function StatsBar() {
  const { data: settings } = useSiteSettings();
  const statsList = settings.stats || [];

  return (
    <section className="relative -mt-6 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-blue-900/60 bg-gradient-to-r from-[#0F172A] via-[#172554] to-[#1E3A8A] p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {statsList.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length] || Users2;
            return (
              <div
                key={stat.id || stat.label}
                className="group relative flex flex-col items-center text-center transition-transform hover:-translate-y-1"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20 transition group-hover:bg-blue-500/25 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-mono text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-blue-100 sm:text-base">
                  {stat.label}
                </p>
                <p className="mt-0.5 hidden text-xs text-blue-200/70 sm:block">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
