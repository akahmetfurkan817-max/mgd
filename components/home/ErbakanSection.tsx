"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, CheckCircle2, ChevronRight, Compass, Heart, Quote, Sparkles } from "lucide-react";

const ERBAKAN_QUOTES = [
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
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  return (
    <section id="erbakan" className="relative py-24 bg-gradient-to-b from-slate-900 via-primary-dark to-slate-900 text-white overflow-hidden">
      {/* Arka plan dekorları */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="container-x relative">
        {/* Üst Başlık */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-200 border border-white/10 mb-4 backdrop-blur">
            <Sparkles size={14} className="text-yellow-400" /> Milli Görüş Lideri
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            Prof. Dr. Necmettin Erbakan
          </h2>
          <p className="mt-3 text-lg text-blue-100/90 font-medium">
            54. T.C. Başbakanı • Milli Gençlik Davamızın Mimarı ve Rehberi (1926 – 2011)
          </p>
        </div>

        {/* Ana İçerik Grid: Portre ve Alıntı / Vizyon Kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Sol Kolon: Erbakan Hoca Resmi ve Rozet */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-40 blur-lg transition duration-500 group-hover:opacity-75" />
              <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-slate-950 p-3 shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-800">
                  <Image
                    src="/images/erbakan_portrait.png"
                    alt="Prof. Dr. Necmettin Erbakan"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-sm font-bold text-white tracking-wide">
                      “Bir Çiçekle Bahar Olmaz;
                    </p>
                    <p className="text-xs text-blue-200 font-medium">
                      Ama Her Bahar Bir Çiçekle Başlar.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Erbakan Hoca'nın Dava İlkeleri ve Alıntı Slider */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Dinamik Alıntı Kutusu */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-md shadow-xl mb-6">
              <Quote size={36} className="text-blue-300 mb-3 opacity-75" />
              <p className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
                “{ERBAKAN_QUOTES[activeQuoteIdx].quote}”
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-blue-200">
                  {ERBAKAN_QUOTES[activeQuoteIdx].context}
                </span>
                <div className="flex gap-2">
                  {ERBAKAN_QUOTES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveQuoteIdx(i)}
                      aria-label={`Alıntı ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === activeQuoteIdx ? "w-8 bg-blue-300" : "w-2 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Üç Temel Sütun */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10 transition">
                <Heart size={20} className="text-red-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Önce Ahlak & Maneviyat</h4>
                <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                  Kalbi vatan, millet ve Allah aşkıyla çarpan temiz bir gençlik.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10 transition">
                <Compass size={20} className="text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Yeniden Büyük Türkiye</h4>
                <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                  Sanayisiyle, teknolojisiyle ve adil düzeniyle lider Türkiye ideali.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10 transition">
                <BookOpen size={20} className="text-amber-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Yeni Bir Dünya</h4>
                <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                  Zulmün ve sömürünün bittiği, barış ve adaletin hâkim olduğu cihan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarihi Dönüm Noktaları Kronolojisi */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-xl font-bold text-center mb-8 text-blue-100">
            Milli Gençlik Davasının Tarihi Dönüm Noktaları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HISTORIC_MILESTONES.map((m) => (
              <div
                key={m.year}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:border-blue-400/50 transition duration-300"
              >
                <span className="inline-block text-2xl font-black text-blue-300 font-mono mb-1">
                  {m.year}
                </span>
                <h4 className="text-base font-bold text-white mb-1.5">{m.title}</h4>
                <p className="text-xs text-blue-100/80 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
