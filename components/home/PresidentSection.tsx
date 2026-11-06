"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, GraduationCap, Heart, Mail, MapPin, MessageSquare, Quote, User } from "lucide-react";
import { usePresident } from "@/hooks/useSiteData";

export default function PresidentSection() {
  const { data: president } = usePresident();
  const [activeTab, setActiveTab] = useState<"mesaj" | "cv">("mesaj");

  return (
    <section id="yonetim" className="py-20 bg-gradient-to-b from-white via-slate-50/60 to-white relative overflow-hidden">
      {/* Arka plan yumuşak ışık efektleri */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl animate-pulse-glow" />

      <div className="container-x relative">
        {/* Başlık Alanı */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <User size={13} /> Genel Merkez Liderliği
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Genel Başkanımız Ahmet Özvatan
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Milli Gençlik Derneği Genel Başkanlığı vizyonu, gençliğe hitabı ve özgeçmişi.
          </p>

          {/* Sekme Butonları (Animasyonlu Geçiş) */}
          <div className="mt-6 inline-flex p-1.5 rounded-full bg-slate-200/70 backdrop-blur-sm border border-slate-300/60 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("mesaj")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "mesaj"
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <MessageSquare size={15} /> Genel Başkanımızın Mesajı
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cv")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === "cv"
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <BookOpen size={15} /> Özgeçmiş & Biyografi
            </button>
          </div>
        </div>

        {/* Ana İçerik Kartı */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:border-blue-400/40 hover:shadow-2xl md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Sol: Genel Başkan Fotoğrafı (İşaretsiz, Sade, Prestijli) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative group/photo">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-20 blur group-hover/photo:opacity-40 transition duration-500" />
                <div className="relative h-56 w-56 sm:h-64 sm:w-64 overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-slate-100">
                  <Image
                    src={president.photo || "/images/ahmet-ozvatan.jpg"}
                    alt={president.name}
                    fill
                    sizes="(max-width: 640px) 224px, 256px"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover/photo:scale-105"
                    priority
                    unoptimized
                  />
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-900 tracking-tight">
                {president.name}
              </h3>
              <p className="text-sm font-bold text-secondary mt-0.5">{president.title}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Milli Gençlik Derneği Genel Merkezi</p>

              {/* Hızlı Bilgi Rozetleri */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-xs">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  <MapPin size={11} className="text-primary" /> Söğüt / Bilecik
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  <GraduationCap size={11} className="text-primary" /> İlahiyat & Kamu Yönt.
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  <Heart size={11} className="text-red-500" /> Evli, 3 Çocuk
                </span>
              </div>

              {/* Sosyal Medya ve E-Posta Butonları */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <a
                  href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-primary text-xs font-bold transition border border-blue-200/60 shadow-sm"
                  title="Resmî E-posta Gönder"
                >
                  <Mail size={13} className="text-secondary" /> E-Posta
                </a>
                <a
                  href={president.xUrl || "https://x.com/milligenclikmgd"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
                  title="X (Twitter) Hesabı"
                  aria-label="X (Twitter)"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white transition shadow-sm hover:opacity-90"
                  title="Instagram Hesabı"
                  aria-label="Instagram"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Sağ: Mesaj ve Özgeçmiş İçerikleri (Her İkisi de DOM'da, Anında Geçişli) */}
            <div className="lg:col-span-8 lg:border-l lg:border-slate-200 lg:pl-10">
              {/* 1. SEKME: Genel Başkanımızın Mesajı */}
              <div className={`${activeTab === "mesaj" ? "block animate-fade-in-up" : "hidden"} space-y-5`}>
                <div className="flex items-center gap-3 text-secondary/40">
                  <Quote size={40} className="text-secondary" />
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
                    Milli Gençliğe Hitap
                  </span>
                </div>

                <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-serif italic">
                  {president.message}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{president.name}</p>
                    <p className="text-xs text-secondary font-semibold">Milli Gençlik Derneği Genel Başkanı</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cv")}
                    className="text-xs font-bold text-primary hover:text-secondary underline underline-offset-4 transition"
                  >
                    Özgeçmişini Oku →
                  </button>
                </div>
              </div>

              {/* 2. SEKME: Ahmet Özvatan Özgeçmiş & Biyografi */}
              <div className={`${activeTab === "cv" ? "block animate-fade-in-up" : "hidden"} space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base`}>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap size={20} className="text-primary" /> Ahmet Özvatan Kimdir?
                  </h4>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Biyografi
                  </span>
                </div>

                <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-3">
                  <p>
                    <strong>Ahmet Özvatan</strong>, 1983 yılında Osmanlı Devleti&apos;nin temellerinin atıldığı kadim şehir <strong>Bilecik&apos;in Söğüt ilçesinde</strong> dünyaya geldi.
                  </p>

                  <p>
                    İlk ve orta öğrenimini Bilecik İmam Hatip Ortaokulunda tamamladıktan sonra Sakarya İmam Hatip Lisesinden mezun oldu. Yükseköğrenimini <strong>Ankara Üniversitesi İlahiyat Fakültesi</strong>&apos;nde tamamlayan Özvatan, eş zamanlı olarak <strong>Anadolu Üniversitesi İktisat Fakültesi Kamu Yönetimi Bölümü</strong>&apos;nden de mezun oldu. Halen akademik alanda yüksek lisans eğitimini sürdürmektedir.
                  </p>

                  <p>
                    Gençlik yıllarından itibaren Milli Görüş davası ve sivil toplum kuruluşlarında aktif sorumluluklar üstlendi:
                  </p>

                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li><strong>Prof. Dr. Necmettin Erbakan Vakfı</strong> Bilecik İl Başkanlığı görevini yürüttü.</li>
                    <li><strong>Ege Bölgesi Eğitim Başkanlığı</strong> görevini deruhte etti.</li>
                    <li>28. Dönem Milletvekili Genel Seçimlerinde <strong>Bilecik Milletvekili Adayı</strong> oldu ve akabinde <strong>Genel Başkan Danışmanlığı</strong> görevini yürüttü.</li>
                    <li>Milli Görüş camiasının gençlik teşkilatlanması olan <strong>Milli Gençlik Derneği&apos;nin (MGD) Genel Başkanlığı</strong> görevini sürdürmektedir.</li>
                  </ul>

                  {/* Resmî İletişim & Sosyal Medya Butonları */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-wrap items-center justify-between gap-3 mt-4">
                    <div>
                      <p className="text-xs font-bold text-primary-dark">Resmî İletişim & Sosyal Medya</p>
                      <p className="text-[11px] text-slate-500">Genel Başkanımızın resmî kanalları</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-primary text-xs font-bold transition border border-blue-200 shadow-sm hover:bg-blue-50"
                      >
                        <Mail size={13} className="text-secondary" /> E-Posta Gönder
                      </a>
                      <a
                        href={president.xUrl || "https://x.com/milligenclikmgd"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition shadow-sm hover:bg-slate-800"
                      >
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>X / Twitter</span>
                      </a>
                      <a
                        href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white text-xs font-bold transition shadow-sm hover:opacity-90"
                      >
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Ahmet Özvatan evli ve 3 çocuk babasıdır.
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href="#program-takvimi"
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-primary text-xs font-bold transition flex items-center gap-1.5 border border-blue-200/60"
                      >
                        Program Takvimi →
                      </a>
                      <a
                        href="#galeri"
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        Fotoğraflar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
