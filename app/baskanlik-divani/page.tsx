"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLeaders, usePresident } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";

export default function BaskanlikDivaniPage() {
  const { data: leaders } = useLeaders();
  const { data: president } = usePresident();

  const presidentSlug = slugify(president?.name || "genel-baskan");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A2547] via-[#0B2D59] to-[#071A34] text-white flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          {/* Üst Başlık */}
          <ScrollReveal y={18} duration={650}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-300 mb-2">
                  Milli Gençlik Derneği Yönetimi
                </span>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Başkanlık Divanı
                </h1>
                <p className="mt-2.5 text-sm sm:text-base text-blue-100/80 max-w-2xl">
                  Genel Başkanımız ve Genel Başkan Yardımcılarımız — özgeçmiş ve detaylar için kartlara tıklayın.
                </p>
              </div>

              <Link
                href={`/baskanlik-divani/${presidentSlug}`}
                className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition"
              >
                <span>{president?.name || "Genel Başkanımız"}</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Genel Başkan Öne Çıkan Kart (Üstte Ayrı) */}
          {president && (
            <ScrollReveal delay={50} y={22} duration={700} className="mb-12">
              <div className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-md p-5 sm:p-7 max-w-3xl mx-auto hover:bg-white/[0.11] hover:border-blue-300/40 transition-all duration-300 shadow-2xl">
                <Link
                  href={`/baskanlik-divani/${presidentSlug}`}
                  className="relative h-36 w-36 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-2xl bg-[#07182E] border-2 border-white/20 shadow-lg block"
                >
                  <Image
                    src={president.photo || "/images/ahmet-ozvatan.jpg"}
                    alt={president.name}
                    fill
                    sizes="160px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </Link>

                <div className="text-center sm:text-left flex-1">
                  <span className="inline-block rounded-full bg-secondary/90 px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-white mb-2">
                    Genel Başkan
                  </span>
                  <Link href={`/baskanlik-divani/${presidentSlug}`} className="block">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white group-hover:text-blue-200 transition-colors">
                      {president.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-sm text-blue-200/85 font-medium">
                    {president.title}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-between gap-3">
                    <Link
                      href={`/baskanlik-divani/${presidentSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-blue-200 transition"
                    >
                      Özgeçmiş &amp; Mesaj <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <a
                        href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-100 hover:bg-white hover:text-[#0A2547] transition"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href={president.xUrl || "https://x.com/milligenclikmgd"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="X"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-100 hover:bg-white hover:text-[#0A2547] transition"
                      >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      <a
                        href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                        aria-label="E-Posta"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-100 hover:bg-white hover:text-[#0A2547] transition"
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Genel Başkan Yardımcıları — 4 Sütunlu Renkli Portre Izgarası + Premium Alt Sosyal İkonlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leaders.map((leader, idx) => {
              const memberSlug = slugify(leader.name) || leader.id;
              return (
                <ScrollReveal key={leader.id} delay={(idx % 4) * 65} y={26} duration={700}>
                  <div className="group flex h-full flex-col">
                    {/* Renkli Portre Kutusu */}
                    <Link
                      href={`/baskanlik-divani/${memberSlug}`}
                      className="relative aspect-[4/4.3] w-full overflow-hidden rounded-2xl bg-[#07182E] shadow-xl border border-white/10 block"
                    >
                      {leader.photo ? (
                        <Image
                          src={leader.photo}
                          alt={leader.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F2F5A] to-[#07182E]">
                          <User size={56} className="text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    </Link>

                    {/* Alt Yuvarlatılmış İsim / Unvan + Zarif Sosyal Medya Bandı */}
                    <div className="mt-2.5 flex-1 flex flex-col justify-between rounded-2xl bg-white/[0.09] group-hover:bg-white/[0.14] border border-white/10 px-4 py-4 text-center transition-all duration-300">
                      <Link href={`/baskanlik-divani/${memberSlug}`} className="block">
                        <h3 className="font-display text-[15px] sm:text-base font-extrabold text-white group-hover:text-blue-200 transition-colors leading-snug">
                          {leader.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-blue-200/85 line-clamp-2">
                          {leader.title}
                        </p>
                      </Link>

                      {/* Premium Minimal Sosyal Medya & Mail İkonları */}
                      <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
                        <a
                          href={leader.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Instagram"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-100/90 hover:bg-white hover:text-[#0A2547] transition-all"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                        <a
                          href={leader.xUrl || "https://x.com/milligenclikmgd"}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="X"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-100/90 hover:bg-white hover:text-[#0A2547] transition-all"
                        >
                          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                        <a
                          href={`mailto:${leader.email || "iletisim@milligenclik.org.tr"}`}
                          aria-label="E-Posta"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-100/90 hover:bg-white hover:text-[#0A2547] transition-all"
                        >
                          <Mail size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
