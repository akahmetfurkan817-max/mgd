"use client";

import { useSiteSettings } from "@/hooks/useSiteData";

const PILLARS = [
  {
    num: "01",
    title: "Şuur ve İstikamet",
    desc: "Tarihinden ve kadim medeniyet değerlerinden ilham alarak, çağın dayattığı savrulmalara karşı sağlam bir irade ve istikamet ortaya koyan bir gençlik yetiştirmek.",
  },
  {
    num: "02",
    title: "İlim ve İrfan",
    desc: "Akademik ve teknik alanlarda en yüksek başarıyı hedeflerken, ilmini insanlığın refahı, adaleti ve ahlakı için kullanan yetkin kadrolar inşa etmek.",
  },
  {
    num: "03",
    title: "Kardeşlik ve Hizmet",
    desc: "81 ilde hiçbir ayrım gözetmeksizin tüm gençlere kucak açan, dayanışmayı esas alan ve “İnsanların en hayırlısı insanlara faydalı olandır” anlayışıyla çalışan bir teşkilat ağı.",
  },
];

export default function VisionSection() {
  const { data: settings } = useSiteSettings();
  const vision = settings.vision;

  return (
    <section id="vizyon" className="bg-ivory py-20 lg:py-24 border-b border-slate-200/80">
      <div className="container-x">
        {/* Düstur Alıntı Paneli */}
        <div className="rounded-2xl bg-primary-dark px-6 py-12 sm:px-12 sm:py-16 lg:px-20 text-white text-center border border-white/10">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-light">
              <span className="h-[1px] w-6 bg-gold" />
              <span>{vision?.tag || "Temel Düsturumuz"}</span>
              <span className="h-[1px] w-6 bg-gold" />
            </span>

            <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              {vision?.heading || "“Önce Ahlak ve Maneviyat”"}
            </h2>

            <blockquote className="mt-6 font-serif text-lg sm:text-2xl italic leading-relaxed text-slate-200">
              {vision?.quote || "“Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.”"}
            </blockquote>

            <p className="mt-5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-gold-light">
              {vision?.author || "— Prof. Dr. Necmettin Erbakan"}
            </p>
          </div>
        </div>

        {/* 3 Temel Sütun */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((item) => (
            <div
              key={item.num}
              className="rounded-xl border border-slate-200/90 bg-white p-8 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <span className="font-mono text-xs font-bold tracking-widest text-gold">
                {item.num}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
