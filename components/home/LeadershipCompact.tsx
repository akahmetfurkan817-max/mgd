"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Folder,
  Home,
  Map,
  ScrollText,
  Users,
} from "lucide-react";
import { useLeaders, usePresident, useSiteSettings } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";
import FlipbookModal from "@/components/corporate/FlipbookModal";

export default function LeadershipCompact() {
  const { data: president } = usePresident();
  const { data: leaders } = useLeaders();
  const { data: settings } = useSiteSettings();
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const showDormitory = Boolean(settings.managementCards?.showDormitory);
  const dormitoryPhoto = settings.managementCards?.dormitoryPhoto || "";

  return (
    <section id="yonetim" className="bg-white py-14 sm:py-20">
      <div className="container-x">
        {/* Başlık: | Yönetim */}
        <div className="mb-7 flex items-center gap-3">
          <span className="h-7 w-1 rounded-full bg-[#0071BC]" />
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A365C]">
            Yönetim
          </h2>
        </div>

        {/* Ana Grid: Sol Genel Başkan Portresi + Sağ Kurumsal Kartlar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Sol: Genel Başkan Portre Kartı (4 sütun) */}
          <Link
            href={`/baskanlik-divani/${slugify(president.name) || "ahmet-ozvatan"}`}
            className="lg:col-span-4 group relative block min-h-[360px] sm:min-h-[410px] overflow-hidden rounded-2xl bg-[#0A365C] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={president.photo || "/images/ahmet-ozvatan.jpg"}
              alt={president.name}
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06223C]/95 via-[#06223C]/25 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {president.name}
              </h3>
              <p className="mt-0.5 text-xs sm:text-sm font-medium text-blue-100/90">
                {president.title || "MGD Genel Başkanı"}
              </p>
            </div>
          </Link>

          {/* Sağ: 2 Sıra Kurumsal Kartlar (8 sütun) */}
          <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5">
            {/* Üst Sıra: Koyu Lacivert (#0A365C) */}
            <div className={`grid grid-cols-1 gap-4 sm:gap-5 flex-1 ${showDormitory ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              <Link
                href="/baskanlik-divani"
                className="group flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#0A365C] p-6 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0D4270] hover:shadow-lg"
              >
                <Users size={26} strokeWidth={1.6} className="text-[#4DA8DA]" />
                <div>
                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                    Başkanlık Divanı
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/75">
                    {leaders.length} üye
                  </p>
                </div>
              </Link>

              <Link
                href="/#teskilat"
                className="group flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#0A365C] p-6 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0D4270] hover:shadow-lg"
              >
                <Map size={26} strokeWidth={1.6} className="text-[#4DA8DA]" />
                <div>
                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                    Şube Başkanları
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/75">
                    81 il teşkilatı
                  </p>
                </div>
              </Link>

              {showDormitory && (
                <Link
                  href="/#teskilat"
                  className="group relative overflow-hidden flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#0A365C] p-6 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0D4270] hover:shadow-lg"
                >
                  {dormitoryPhoto && (
                    <>
                      <Image
                        src={dormitoryPhoto}
                        alt="Ev ve Yurt Sorumluları"
                        fill
                        className="object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-[#0A365C]/65" />
                    </>
                  )}
                  <Home size={26} strokeWidth={1.6} className="relative z-10 text-[#4DA8DA]" />
                  <div className="relative z-10">
                    <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                      Ev ve Yurt Sorumluları
                    </h3>
                    <p className="mt-1 text-xs text-blue-100/75">
                      81 ilde sorumlu
                    </p>
                  </div>
                </Link>
              )}
            </div>

            {/* Alt Sıra: Kurumsal Parlak Mavi (#006BB6) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 flex-1">
              <Link
                href="/faaliyetler"
                className="group flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#006BB6] p-6 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0078CC] hover:shadow-lg"
              >
                <Briefcase size={26} strokeWidth={1.6} className="text-white/90" />
                <div>
                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                    Komisyonlar
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/85">
                    Komisyon ve görev alanları
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setActiveDoc("tuzuk")}
                className="group flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#006BB6] p-6 text-left text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0078CC] hover:shadow-lg"
              >
                <ScrollText size={26} strokeWidth={1.6} className="text-white/90" />
                <div>
                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                    Tüzüğümüz
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/85">
                    Derneğimizin kuruluş esasları
                  </p>
                </div>
              </button>

              <Link
                href="/dosya-arsivi"
                className="group flex flex-col justify-between min-h-[168px] sm:min-h-[195px] rounded-2xl bg-[#006BB6] p-6 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#0078CC] hover:shadow-lg"
              >
                <Folder size={26} strokeWidth={1.6} className="text-white/90" />
                <div>
                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white">
                    Dosya Arşivi
                  </h3>
                  <p className="mt-1 text-xs text-blue-100/85">
                    Kurumsal kimlik ve dönem dosyaları
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FlipbookModal docKey={activeDoc} onClose={() => setActiveDoc(null)} />
    </section>
  );
}
