"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import PageHero from "@/components/ui/PageHero";
import FlipbookModal from "@/components/corporate/FlipbookModal";
import { CORPORATE_DOCS, PROTOCOL_PARTNERS } from "@/data/corporate";
import {
  ArrowLeft,
  BookOpen,
  Download,
  FileCheck,
  FileText,
  Handshake,
  Layers,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function KurumsalPage() {
  const [activeTab, setActiveTab] = useState<"hakkimizda" | "tuzuk" | "protokoller" | "kurumsalKimlik">("hakkimizda");
  const [flipbookOpen, setFlipbookOpen] = useState(false);

  const currentDoc = CORPORATE_DOCS[activeTab] || CORPORATE_DOCS.hakkimizda;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <PageHero
          pageKey="kurumsal"
          breadcrumbLabel="Kurumsal Neşriyat"
          defaultTitle="Kurumsal Belgeler & Resmî Tüzük"
          defaultSubtitle="Milli Gençlik Derneği tarihçesi, resmî tüzüğü, bakanlık ve kurumlarla imzalanan protokoller ve kurumsal kimlik standartları."
        />

        {/* 4 Ana Sekme: Hakkımızda, Tüzüğümüz, Protokollerimiz, Kurumsal Kimlik */}
        <section className="py-10">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("hakkimizda")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeTab === "hakkimizda"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <FileText size={16} /> Hakkımızda
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tuzuk")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeTab === "tuzuk"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <BookOpen size={16} /> Dernek Tüzüğümüz
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("protokoller")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeTab === "protokoller"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Handshake size={16} /> Protokollerimiz
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("kurumsalKimlik")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeTab === "kurumsalKimlik"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Sparkles size={16} /> Kurumsal Kimlik
              </button>
            </div>

            {/* Belge Kartı ve Dergi Şeklinde Aç Butonu */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                    {currentDoc.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                    {currentDoc.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{currentDoc.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Dergi / Flipbook Aç Butonu */}
                  <button
                    type="button"
                    onClick={() => setFlipbookOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-secondary text-white font-bold text-sm shadow-lg hover:shadow-xl transition active:scale-95"
                  >
                    <BookOpen size={18} />
                    <span>Dergi Formatında Oku (Sayfaları Çevir)</span>
                  </button>

                  {/* PDF İndir */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                  >
                    <Download size={16} />
                    <span>PDF İndir</span>
                  </button>
                </div>
              </div>

              {/* Protokoller Sekmesi İçin Özel Protokol Kartları */}
              {activeTab === "protokoller" && (
                <div className="mb-10">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    Yürürlükteki Kurumsal İş Birliği ve Protokol Ortaklarımız
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {PROTOCOL_PARTNERS.map((partner) => (
                      <div
                        key={partner.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 hover:border-emerald-500/50 hover:bg-white hover:shadow-lg transition duration-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {partner.category}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {partner.officialNumber}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mb-2">
                            {partner.name}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            {partner.scope}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                          <span>İmza: {partner.signDate}</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <ShieldCheck size={12} /> Resmî Protokol
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sayfa Sayfa İçerik Önizlemesi */}
              <div className="space-y-8">
                {currentDoc.pages.map((page) => (
                  <div
                    key={page.pageNumber}
                    className="p-6 sm:p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                          {page.chapterTitle}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                          {page.heading}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Sayfa {page.pageNumber}
                      </span>
                    </div>

                    <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
                      {page.body.map((p, i) => (
                        <p key={i} className="text-justify">
                          {p}
                        </p>
                      ))}
                    </div>

                    {page.notes && (
                      <p className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-500 italic">
                        {page.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Yönetim Hızlı Geçiş Bandı */}
        <ScrollReveal y={24} duration={700}>
          <section className="pb-16">
            <div className="container-x grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link
                href="/genel-baskan"
                className="rounded-3xl bg-gradient-to-r from-[#071933] to-primary p-7 text-white shadow-lg hover:-translate-y-1 transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Yönetim</span>
                  <h3 className="font-display text-xl font-extrabold mt-1">Genel Başkanımız</h3>
                </div>
                <span className="text-lg font-bold">→</span>
              </Link>
              <Link
                href="/baskanlik-divani"
                className="rounded-3xl bg-gradient-to-r from-[#0A2547] to-secondary p-7 text-white shadow-lg hover:-translate-y-1 transition flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-200">Yönetim</span>
                  <h3 className="font-display text-xl font-extrabold mt-1">Başkanlık Divanı</h3>
                </div>
                <span className="text-lg font-bold">→</span>
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <Footer />

      {/* Sesli Flipbook Modalı */}
      <FlipbookModal docKey={flipbookOpen ? activeTab : null} onClose={() => setFlipbookOpen(false)} />
    </div>
  );
}
