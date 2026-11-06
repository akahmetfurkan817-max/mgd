"use client";

import { BookOpen, Compass, HeartHandshake, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function VisionSection() {
  const { data: settings } = useSiteSettings();
  const vision = settings.vision;

  return (
    <section id="vizyon" className="relative overflow-hidden bg-white py-20 lg:py-24">
      {/* Hafif desen */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="container-x relative">
        {/* Erbakan Hoca Alıntı Bandı */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-slate-900 p-8 text-white shadow-xl sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-12 -translate-y-12 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-12 translate-y-12 rounded-full bg-secondary/15 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200 backdrop-blur ring-1 ring-white/15">
              <Sparkles size={14} /> {vision?.tag || "Temel Düsturumuz"}
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              {vision?.heading || "“Önce Ahlak ve Maneviyat”"}
            </h2>

            <blockquote className="mt-6 text-lg italic leading-relaxed text-blue-100 sm:text-2xl font-serif">
              {vision?.quote || "“Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.”"}
            </blockquote>

            <p className="mt-4 font-semibold text-secondary sm:text-base tracking-wide">
              {vision?.author || "— Prof. Dr. Necmettin Erbakan"}
            </p>
          </div>
        </div>

        {/* Kurumsal Vizyon & Misyon 3'lü Kart Yapısı */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200 bg-surface p-8 transition-all duration-200 hover:-translate-y-1.5 hover:border-secondary hover:shadow-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              <Compass size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark">Şuur ve İstikamet</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Tarihinden ve kadim medeniyet değerlerinden ilham alarak, çağın dayattığı ifsat edici akımlara karşı sağlam bir irade ve istikamet ortaya koyan bir gençlik yetiştirmek.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-surface p-8 transition-all duration-200 hover:-translate-y-1.5 hover:border-secondary hover:shadow-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition group-hover:bg-secondary group-hover:text-white">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark">İlim ve İrfan</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Akademik ve teknik alanlarda en yüksek başarıyı hedeflerken, ilmini insanlığın refahı, adaleti ve ahlakı için kullanan yetkin kadrolar inşa etmek.
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-surface p-8 transition-all duration-200 hover:-translate-y-1.5 hover:border-secondary hover:shadow-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <HeartHandshake size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark">Kardeşlik ve Hizmet</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              81 ilde hiçbir ayrım gözetmeksizin tüm gençlere kucak açan, dayanışmayı esas alan ve &ldquo;İnsanların en hayırlısı insanlara faydalı olandır&rdquo; anlayışıyla çalışan bir teşkilat ağı.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
