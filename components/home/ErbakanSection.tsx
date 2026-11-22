"use client";

import { useState } from "react";
import Image from "next/image";
import { useSiteSettings } from "@/hooks/useSiteData";

const DEFAULT_ERBAKAN_QUOTES = [
  {
    quote: "Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.",
    context: "Gençlik Şuuru ve Maneviyat Üzerine",
  },
  {
    quote: "Gençlik bir milletin geleceğidir. Gençliğini ihmal edenler, geleceklerini imha ederler.",
    context: "Teşkilatlanma ve Gelecek Vizyonu",
  },
  {
    quote: "Bizim davamızda kimse kendisi için yaşamaz; herkes kardeşi için yaşar.",
    context: "Kardeşlik ve Fedakarlık Ahlakı",
  },
  {
    quote: "İman varsa imkân da vardır; milli görüşçü asla pes etmez.",
    context: "Azim ve Mücadele Ruhu",
  },
];

const HISTORIC_MILESTONES = [
  {
    year: "1969",
    title: "Milli Görüş'ün Doğuşu",
    desc: "Milletimizin öz değerlerine dönüş ve bağımsız şahlanış hareketinin başlangıcı.",
  },
  {
    year: "1974",
    title: "Ağır Sanayi ve Kıbrıs Zaferi",
    desc: "Türkiye genelinde yüzlerce fabrika temeli ve Kıbrıs Barış Harekâtı kararlılığı.",
  },
  {
    year: "1975",
    title: "Milli Gençlik Hareketi",
    desc: "Anadolu sathında 'Önce Ahlak ve Maneviyat' şuuruyla kurulan gençlik ocakları.",
  },
  {
    year: "1997",
    title: "D-8 ve Yeni Bir Dünya",
    desc: "Savaş değil barış, çatışma değil diyalog, çifte standart değil adalet ilkeleriyle D-8 kuruluşu.",
  },
];

export default function ErbakanSection() {
  const { data: settings } = useSiteSettings();
  const erbakan = settings.erbakan;
  const quotes = erbakan?.quotes && erbakan.quotes.length > 0 ? erbakan.quotes : DEFAULT_ERBAKAN_QUOTES;

  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);
  const safeIdx = activeQuoteIdx < quotes.length ? activeQuoteIdx : 0;

  return (
    <section id="erbakan" className="bg-[#081529] py-20 lg:py-24 text-white border-b border-white/10">
      <div className="container-x">
        {/* Başlık */}
        <div className="max-w-3xl pb-10 border-b border-white/10">
          <div className="section-eyebrow mb-3">
            <span className="h-[1.5px] w-7 bg-gold" />
            <span>{erbakan?.badge || "Milli Görüş Lideri"}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {erbakan?.title || "Prof. Dr. Necmettin Erbakan"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            {erbakan?.subtitle || "54. T.C. Başbakanı • Milli Gençlik Davamızın Mimarı ve Rehberi (1926 – 2011)"}
          </p>
        </div>

        {/* Portre & Alıntı */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none overflow-hidden rounded-2xl border border-white/15 bg-slate-950">
              <div className="relative aspect-[4/4.8] w-full">
                <Image
                  src={erbakan?.portrait || "/images/erbakan_portrait.png"}
                  alt="Prof. Dr. Necmettin Erbakan"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06101F] via-transparent to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-center">
                  <p className="font-serif text-base italic text-white">
                    &ldquo;Bir çiçekle bahar olmaz; ama her bahar bir çiçekle başlar.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Alıntı Kutusu */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-7 sm:p-9">
              <div className="font-serif text-5xl leading-none text-gold/50 select-none mb-2">&ldquo;</div>
              <p className="font-serif text-xl sm:text-2xl lg:text-[27px] leading-relaxed text-white">
                {quotes[safeIdx].quote}
              </p>

              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-light">
                  {quotes[safeIdx].context}
                </span>
                <div className="flex items-center gap-2">
                  {quotes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveQuoteIdx(i)}
                      aria-label={`Alıntı ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === safeIdx ? "w-8 bg-gold" : "w-2 bg-white/25 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Üç Temel Hedef */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-[11px] font-bold text-gold-light">01</span>
                <h4 className="mt-2 text-sm font-bold text-white">Önce Ahlak &amp; Maneviyat</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Kalbi vatan, millet ve Allah aşkıyla çarpan şuurlu bir gençlik.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-[11px] font-bold text-gold-light">02</span>
                <h4 className="mt-2 text-sm font-bold text-white">Yeniden Büyük Türkiye</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Sanayisiyle, teknolojisiyle ve adil düzeniyle lider Türkiye ideali.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <span className="font-mono text-[11px] font-bold text-gold-light">03</span>
                <h4 className="mt-2 text-sm font-bold text-white">Yeni Bir Dünya</h4>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Zulmün ve sömürünün bittiği, barış ve adaletin hâkim olduğu cihan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kronoloji */}
        <div className="mt-14 pt-12 border-t border-white/10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light mb-6">
            Tarihi Dönüm Noktaları
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HISTORIC_MILESTONES.map((m) => (
              <div
                key={m.year}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-gold/40"
              >
                <span className="font-serif text-3xl font-bold text-gold-light">
                  {m.year}
                </span>
                <h4 className="mt-2.5 text-base font-bold text-white">{m.title}</h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
