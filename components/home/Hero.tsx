"use client";

import Image from "next/image";
import { CheckCircle2, HeartHandshake, Sparkles, UserPlus } from "lucide-react";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import { useSiteSettings } from "@/hooks/useSiteData";
import TornPaperDivider from "@/components/ui/TornPaperDivider";

export default function Hero() {
  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();
  const { data: settings } = useSiteSettings();
  const hero = settings.hero;

  return (
    <section
      id="kurumsal"
      className="relative overflow-hidden bg-gradient-to-br from-[#060e20] via-primary-dark to-[#0f214a] text-white pt-12 pb-0"
    >
      {/* milligenclik.org.tr Erbakan Portresi Arka Plan Entegrasyonu */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-full lg:w-1/2 flex items-center justify-end overflow-hidden opacity-45 lg:opacity-75 select-none">
        <div className="relative h-full w-full max-w-xl">
          <Image
            src="/images/erbakan_portrait.png"
            alt="Prof. Dr. Necmettin Erbakan Portresi"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-right-bottom mix-blend-screen filter contrast-125 brightness-100"
            priority
            unoptimized
          />
          {/* Yumuşak degradeler */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e20] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent" />
        </div>
      </div>

      {/* Dekoratif Mavi & Amber Işıma */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container-x relative py-16 lg:py-24">
        {/* Ana Manşet Metinleri */}
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-200 border border-white/15 backdrop-blur-md shadow-sm">
            <Sparkles size={14} className="text-amber-400" />
            {hero?.badge || "Milli Gençlik Derneği Genel Merkezi"}
          </div>

          <h1 className="text-4xl font-black leading-[1.15] sm:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-sm">
            {hero?.titleLine1 || "Gençliğin Sesi,"}
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-200 bg-clip-text text-transparent">
              {hero?.titleLine2 || "Milletin Geleceği"}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal">
            {hero?.description ||
              "Milli Gençlik Derneği olarak 81 ilde; ahlak, ilim, irfan ve vatan sevgisiyle yetişen şuurlu bir gençlik için gece gündüz çalışıyoruz."}
          </p>

          {/* Hızlı Öne Çıkan Değerler */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-200/90">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Önce Ahlak ve Maneviyat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> 81 İl Teşkilatı
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Üniversite & Lise Komisyonları
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openVolunteer}
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-blue-50 shadow-xl hover:shadow-2xl active:scale-95"
            >
              <UserPlus size={18} className="text-primary" /> {hero?.volunteerBtnText || "Gönüllü Ol"}
            </button>
            <button
              type="button"
              onClick={openDonate}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 shadow-md"
            >
              <HeartHandshake size={18} className="text-emerald-300" /> {hero?.donateBtnText || "Bağış Yap"}
            </button>
          </div>
        </div>
      </div>

      {/* milligenclik.org.tr Birebir Yırtık Kâğıt Kenarlığı */}
      <TornPaperDivider fillColor="#ffffff" />
    </section>
  );
}
