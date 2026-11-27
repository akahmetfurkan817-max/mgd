"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Film, Image as ImageIcon, Quote, Sparkles, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHero from "@/components/ui/PageHero";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";

export default function OncuSahsiyetlerPage() {
  const { data: pioneers } = useOncuSahsiyetler();

  return (
    <div className="min-h-screen bg-[#061124] text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Premium Editorial Banner */}
        <PageHero
          pageKey="oncu-sahsiyetler"
          breadcrumbLabel="Davamızın Mimarları"
          defaultEyebrow="Külliyat & Rehber Şahsiyetler"
          defaultTitle="Öncü Şahsiyetlerimiz"
          defaultSubtitle="Milli Gençlik hareketine ruh veren, ömrünü ahlak, ilim ve medeniyet davasına adayan büyük önderlerimizin her biri için hazırlanan özel biyografi, video, fotoğraf ve kitap arşivi."
        />

        {/* Alt Alta Premium Tam Genişlik Şahsiyet Kartları */}
        <section className="py-12 sm:py-16">
          <div className="container-x space-y-8">
            {pioneers.map((leader, idx) => {
              const hasBg = Boolean(leader.backgroundImage?.trim());
              const hasPortrait = Boolean(leader.portrait?.trim());
              const isReversed = idx % 2 === 1;

              return (
                <ScrollReveal key={leader.id} delay={60} y={32} duration={800}>
                  <Link
                    href={`/oncu-sahsiyetler/${leader.id}`}
                    className="group relative block overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#0E264C] via-[#091B38] to-[#061124] shadow-2xl transition-all duration-500 hover:border-blue-300/45 hover:-translate-y-1"
                  >
                    {/* Özelleştirilebilir Tam Arka Plan Görseli */}
                    {hasBg && (
                      <>
                        <Image
                          src={leader.backgroundImage!}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#061124]/95 via-[#071630]/85 to-[#061124]/60" />
                      </>
                    )}

                    <div
                      className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 ${
                        isReversed ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      {/* Portre Alanı (Boş bırakılabilir) */}
                      <div className="lg:col-span-4">
                        <div className="relative aspect-[4/4.4] w-full max-w-sm mx-auto overflow-hidden rounded-3xl border border-white/20 bg-white/[0.04] shadow-2xl">
                          {hasPortrait ? (
                            <Image
                              src={leader.portrait}
                              alt={leader.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/25">
                              <User size={64} />
                              <span className="text-xs font-semibold uppercase tracking-widest">
                                Portre Alanı
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#040D1D]/70 via-transparent to-transparent" />
                          {leader.period && (
                            <span className="absolute bottom-4 left-4 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs font-bold text-blue-100">
                              {leader.period}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Metin ve Arşiv Özeti Alanı */}
                      <div className="lg:col-span-8 flex flex-col justify-between">
                        <div>
                          {leader.badge && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 mb-3">
                              <Sparkles size={12} /> {leader.badge}
                            </span>
                          )}

                          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
                            {leader.name}
                          </h2>

                          {leader.title && (
                            <p className="mt-1.5 text-sm sm:text-base font-semibold text-blue-200/85">
                              {leader.title}
                            </p>
                          )}

                          {leader.motto && (
                            <blockquote className="mt-5 rounded-2xl border-l-4 border-amber-400 bg-white/[0.06] px-5 py-4 text-sm sm:text-base italic text-blue-50/95 leading-relaxed">
                              <Quote size={16} className="inline mr-2 text-amber-300" />
                              {leader.motto}
                            </blockquote>
                          )}

                          {leader.bioSections[0]?.content && (
                            <p className="mt-5 text-sm text-slate-300 leading-relaxed line-clamp-3">
                              {leader.bioSections[0].content}
                            </p>
                          )}
                        </div>

                        <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                            <span className="inline-flex items-center gap-1.5">
                              <Film size={14} className="text-blue-300" /> {leader.videos.length} Video
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <ImageIcon size={14} className="text-sky-300" /> {leader.photos.length} Fotoğraf
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <BookOpen size={14} className="text-emerald-300" /> {leader.books.length} Kitap &amp; PDF
                            </span>
                          </div>

                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-extrabold text-primary shadow-lg transition-all group-hover:bg-blue-50 group-hover:gap-3">
                            <span>Özel Sayfasını İncele</span>
                            <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
