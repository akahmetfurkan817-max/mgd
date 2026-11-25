"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, CalendarDays, FileCheck, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FlipbookModal from "@/components/corporate/FlipbookModal";
import { PROTOCOL_PARTNERS } from "@/data/corporate";

export default function ProtokolDetayPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [flipbookOpen, setFlipbookOpen] = useState(false);

  const partner = PROTOCOL_PARTNERS.find((p) => p.id === id) || PROTOCOL_PARTNERS[0];
  const others = PROTOCOL_PARTNERS.filter((p) => p.id !== partner.id);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sol: Protokol İmza Fotoğrafı, Özet ve İnteraktif Okuyucu Butonu (8 sütun) */}
            <article className="lg:col-span-8">
              <ScrollReveal y={20} duration={650}>
                <Link
                  href="/protokollerimiz"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition mb-6"
                >
                  <ArrowLeft size={14} /> Protokollere Dön
                </Link>

                <span className="block text-xs font-extrabold uppercase tracking-wider text-secondary mb-2">
                  {partner.category}
                </span>

                <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-ink leading-tight">
                  {partner.name}
                </h1>

                {/* Meta Şerit */}
                <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <CalendarDays size={14} className="text-primary" /> İmza Tarihi: {partner.signDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono font-bold text-primary">
                    <FileCheck size={14} /> {partner.officialNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                    <ShieldCheck size={14} /> Yürürlükte
                  </span>
                </div>

                {/* Protokol İmza Fotoğrafı */}
                <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-primary-dark shadow-lg">
                  <Image
                    src="/images/mgd/11102025-il-baskanlari-toplantisi.jpg"
                    alt={`${partner.name} Protokol İmza Töreni`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-white/90 font-semibold">
                    <span>Protokol İmza ve İş Birliği Programı</span>
                    <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-1">
                      MGD Genel Merkez
                    </span>
                  </div>
                </div>

                {/* Protokol Açıklaması */}
                <div className="mt-8 space-y-5 text-sm sm:text-base leading-relaxed text-slate-700">
                  <p className="font-semibold text-ink text-base sm:text-lg">{partner.scope}</p>
                  <p>
                    Milli Gençlik Derneği ile <strong>{partner.name}</strong> arasında imzalanan bu resmî iş birliği protokolü; gençlerimizin eğitim, kültür, ahlak, sosyal sorumluluk ve akademik gelişim alanlarında desteklenmesini kapsamaktadır.
                  </p>
                  <p>
                    Protokol metninin tamamını aşağıdaki etkileşimli dergi / PDF okuyucu üzerinden sayfa sayfa inceleyebilir veya resmî nüshasını indirebilirsiniz.
                  </p>
                </div>

                {/* İnteraktif Protokol Okuyucu Aksiyon Kartı */}
                <div className="mt-8 rounded-3xl border border-primary/20 bg-gradient-to-r from-[#0A1E3F] via-primary to-[#1D56B8] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-200">
                      Resmî Protokol Nüshası
                    </span>
                    <h2 className="mt-1 font-display text-xl font-extrabold text-white">
                      Protokol Metnini Sayfa Sayfa Oku
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-blue-100/85">
                      Admin panelinden PDF yüklendiğinde otomatik olarak sayfa çevirmeli okuyucuda açılır.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlipbookOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-blue-50 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-primary shadow-lg transition shrink-0 active:scale-95"
                  >
                    <BookOpen size={17} />
                    <span>Protokolü Oku</span>
                  </button>
                </div>
              </ScrollReveal>
            </article>

            {/* Sağ: Diğer Protokoller (4 sütun) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <ScrollReveal delay={100} y={24} duration={750}>
                <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6">
                  <h2 className="font-display text-base font-extrabold text-ink pb-4 mb-4 border-b border-slate-200/80">
                    Diğer Protokollerimiz
                  </h2>
                  <div className="space-y-3">
                    {others.map((o) => (
                      <Link
                        key={o.id}
                        href={`/protokollerimiz/${o.id}`}
                        className="group block rounded-2xl bg-white border border-slate-200/70 p-4 hover:border-primary/40 hover:shadow-md transition"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {o.category}
                        </span>
                        <h3 className="mt-1 text-sm font-bold text-ink group-hover:text-primary transition-colors">
                          {o.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-400">{o.signDate}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <FlipbookModal
        docKey={flipbookOpen ? "protokoller" : null}
        customTitle={`${partner.name} — Resmî Protokol`}
        onClose={() => setFlipbookOpen(false)}
      />
    </div>
  );
}
