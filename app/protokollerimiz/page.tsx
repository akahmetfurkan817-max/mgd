"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Handshake, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { PROTOCOL_PARTNERS, type ProtocolPartner } from "@/data/corporate";

const CATEGORIES: ("Tümü" | ProtocolPartner["category"])[] = [
  "Tümü",
  "Bakanlık & Kamu",
  "Üniversite",
  "Sivil Toplum & Vakıf",
];

export default function ProtokollerimizPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Tümü");

  const filtered =
    category === "Tümü"
      ? PROTOCOL_PARTNERS
      : PROTOCOL_PARTNERS.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-[#070E1A] text-white flex flex-col">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container-x">
          {/* ondigital.com.tr tarzı ultra-temiz minimalist üst başlık */}
          <ScrollReveal y={20} duration={700}>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-300 mb-3">
                <Handshake size={14} /> Kurumsal İş Birlikleri
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.08]">
                Protokollerimiz
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                Milli Gençlik Derneği olarak eğitim, gençlik, burs, akademik araştırma ve uluslararası kardeşlik alanlarında kurumlarla imzaladığımız resmî protokoller.
              </p>
            </div>

            {/* Kategori Filtre Hapları (ondigital stili) */}
            <div className="mt-9 flex flex-wrap items-center gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                    category === cat
                      ? "bg-white text-[#070E1A] shadow-lg"
                      : "border border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* 3 Sütunlu Minimalist Kurum Logolu Kart Izgarası */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((partner, idx) => (
              <ScrollReveal key={partner.id} delay={(idx % 3) * 80} y={28} duration={750}>
                <Link href={`/protokollerimiz/${partner.id}`} className="group block">
                  {/* Minimalist Koyu Kart Kutusu */}
                  <div className="relative flex aspect-[16/11] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0F1B30] to-[#0A1322] p-8 transition-all duration-500 group-hover:border-blue-400/45 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-15px_rgba(29,86,184,0.3)]">
                    <div className="relative flex flex-col items-center gap-4 text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/15 p-3.5 shadow-inner transition-transform duration-500 group-hover:scale-105">
                        <Image
                          src={partner.logo || "/images/mgd-logo.png"}
                          alt={partner.name}
                          width={64}
                          height={64}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-mono font-bold text-blue-200 border border-white/10">
                        <ShieldCheck size={11} /> {partner.officialNumber}
                      </span>
                    </div>
                  </div>

                  {/* Alt Başlık + Ok + Kategori (ondigital stili) */}
                  <div className="mt-4 px-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {partner.name}
                      </h2>
                      <ArrowRight
                        size={18}
                        className="mt-1 shrink-0 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {partner.category} • {partner.signDate}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
