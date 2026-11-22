"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, UserPlus } from "lucide-react";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function Hero() {
  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();
  const { data: settings } = useSiteSettings();
  const hero = settings.hero;

  return (
    <section
      id="kurumsal"
      className="relative bg-ivory border-b border-slate-200/80 overflow-hidden"
    >
      <div className="container-x py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Sol: Editoryal Manifesto */}
          <div className="lg:col-span-7">
            <div className="section-eyebrow mb-4">
              <span className="h-[1.5px] w-7 bg-gold" />
              <span>{hero?.badge || "Milli Gençlik Derneği Genel Merkezi"}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-ink leading-[1.08]">
              {hero?.titleLine1 || "Gençliğin Sesi,"}
              <br />
              <span className="text-primary">
                {hero?.titleLine2 || "Milletin Geleceği"}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              {hero?.description ||
                "Milli Gençlik Derneği olarak 81 ilde; ahlak, ilim, irfan ve vatan sevgisiyle yetişen şuurlu bir gençlik için gece gündüz çalışıyoruz."}
            </p>

            {/* Kurumsal Temel Değerler Şeridi */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-200/90 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">01 / Düstur</p>
                <p className="mt-1 text-sm font-semibold text-ink">Önce Ahlak ve Maneviyat</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">02 / Teşkilat</p>
                <p className="mt-1 text-sm font-semibold text-ink">81 İl ve İlçe Temsilciliği</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">03 / Eğitim</p>
                <p className="mt-1 text-sm font-semibold text-ink">Üniversite &amp; Lise Komisyonları</p>
              </div>
            </div>

            {/* Eylem Butonları */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={openVolunteer}
                className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
              >
                <UserPlus size={17} />
                <span>{hero?.volunteerBtnText || "Gönüllü Ol"}</span>
              </button>

              <button
                type="button"
                onClick={openDonate}
                className="inline-flex items-center gap-2.5 rounded-lg border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-ink transition-all hover:border-primary hover:text-primary active:scale-[0.98]"
              >
                <HeartHandshake size={17} className="text-gold" />
                <span>{hero?.donateBtnText || "Bağış Yap"}</span>
              </button>

              <Link
                href="/kurumsal"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-primary transition-colors group"
              >
                <span>Kurumsal Kimlik</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Sağ: Çerçeveli Kurumsal Portre Kartı */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-primary-dark border border-slate-200 shadow-xl">
                <Image
                  src="/images/erbakan_portrait.png"
                  alt="Prof. Dr. Necmettin Erbakan"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-top"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                    Kurucu Vizyon
                  </span>
                  <p className="mt-2 font-serif text-lg sm:text-xl italic leading-snug text-white">
                    &ldquo;Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.&rdquo;
                  </p>
                  <p className="mt-2.5 text-xs font-semibold text-slate-300">
                    Prof. Dr. Necmettin Erbakan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
