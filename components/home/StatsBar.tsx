"use client";

import { useSiteSettings } from "@/hooks/useSiteData";

export default function StatsBar() {
  const { data: settings } = useSiteSettings();
  const statsList = settings.stats || [];

  if (statsList.length === 0) return null;

  return (
    <section className="bg-white border-b border-slate-200/80">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
          {statsList.map((stat, i) => (
            <div
              key={stat.id || stat.label}
              className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between"
            >
              <span className="font-mono text-[11px] font-semibold tracking-widest text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-primary tabular-nums">
                {stat.value}
              </div>
              <p className="mt-2 text-sm font-bold text-ink">
                {stat.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
