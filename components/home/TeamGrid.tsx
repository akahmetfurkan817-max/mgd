"use client";

import { useState } from "react";
import {
  Briefcase,
  ChevronRight,
  FileText,
  Mail,
  Users,
  X,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useLeaders, usePresident } from "@/hooks/useSiteData";
import type { Leader } from "@/types";

interface ActivePerson {
  name: string;
  title: string;
  photo: string;
  bio: string;
  email?: string;
  xUrl?: string;
  instagramUrl?: string;
  roleBadge?: string;
}

export default function TeamGrid() {
  const [activeLeader, setActiveLeader] = useState<ActivePerson | null>(null);
  const { data: leaders } = useLeaders();
  const { data: president } = usePresident();

  return (
    <section
      id="baskanlik-divani"
      className="bg-slate-50/70 py-20 lg:py-28 border-t border-slate-200/60 relative overflow-hidden"
    >
      {/* Anchor yönlendirmeleri (eski linkler ve menülerle tam uyum için) */}
      <div id="kadro" className="absolute -top-24" />
      <div id="yonetim-kurulu" className="absolute -top-24" />
      <div id="komisyonlar" className="absolute -top-24" />

      {/* Dekoratif Arka Plan Parıltısı */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container-x relative">
        {/* Üst Başlık Alanı */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-3">
            <Users size={13} /> Milli Gençlik Derneği
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl md:text-5xl font-heading">
            Başkanlık Divanı
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-0.5 w-8 bg-primary rounded-full" />
            <p className="text-sm sm:text-base font-semibold text-slate-600">
              Yeni Dönem Başkanlık Divanımız
            </p>
            <span className="h-0.5 w-8 bg-primary rounded-full" />
          </div>
        </div>

        {/* GENEL BAŞKAN (EN ÜST ORTADA) */}
        {president && (
          <div className="max-w-md mx-auto mb-14">
            <div
              onClick={() =>
                setActiveLeader({
                  name: president.name,
                  title: president.title,
                  photo: president.photo || "/images/ahmet-ozvatan.jpg",
                  bio: president.bio,
                  email: president.email,
                  xUrl: president.xUrl,
                  instagramUrl: president.instagramUrl,
                  roleBadge: "Genel Başkan",
                })
              }
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-b from-white via-white to-blue-50/40 p-6 shadow-lg hover:shadow-2xl hover:border-primary hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <div>
                <div className="flex justify-center mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-primary text-white shadow-sm shadow-primary/30">
                    Genel Başkan
                  </span>
                </div>

                {/* Portre Fotoğrafı */}
                <div className="flex justify-center my-3">
                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <Avatar
                      name={president.name}
                      src={president.photo || "/images/ahmet-ozvatan.jpg"}
                      size={116}
                      rounded="2xl"
                      className="shadow-xl ring-4 ring-primary/20 object-cover"
                    />
                  </div>
                </div>

                {/* İsim ve Görevi */}
                <div className="text-center mt-2 mb-3">
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-primary transition-colors leading-snug">
                    {president.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-bold text-secondary">
                    {president.title}
                  </p>
                </div>

                {/* Biyografi / CV Özeti */}
                <div className="rounded-2xl bg-white/90 p-3.5 border border-blue-100 text-left my-2 shadow-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <FileText size={12} className="text-primary" /> Özgeçmiş
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {president.bio}
                  </p>
                </div>
              </div>

              {/* Alt Buton ve Sosyal/Mail */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                  CV & Mesajı İncele <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>

                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`mailto:${president.email || "baskan@milligenclik.org.tr"}`}
                    className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-blue-50 transition"
                    title="E-Posta Gönder"
                  >
                    <Mail size={14} />
                  </a>
                  <a
                    href={president.xUrl || "https://x.com/milligenclikmgd"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    title="X (Twitter)"
                  >
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={president.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition"
                    title="Instagram"
                  >
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divan Üyeleri Başlık Çizgisi */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-16 bg-slate-200" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Başkanlık Divanı Üyeleri
          </h3>
          <span className="h-px w-16 bg-slate-200" />
        </div>

        {/* 10 Üyeli Başkanlık Divanı Izgarası */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              onClick={() =>
                setActiveLeader({
                  name: leader.name,
                  title: leader.title,
                  photo: leader.photo,
                  bio: leader.bio,
                  email: leader.email,
                  xUrl: leader.xUrl,
                  instagramUrl: leader.instagramUrl,
                  roleBadge: "Başkanlık Divanı",
                })
              }
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              <div>
                {/* Portre Fotoğrafı */}
                <div className="flex justify-center my-3">
                  <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <Avatar
                      name={leader.name}
                      src={leader.photo}
                      size={104}
                      rounded="2xl"
                      className="shadow-md ring-2 ring-blue-100 object-cover"
                    />
                  </div>
                </div>

                {/* İsim ve Görevi */}
                <div className="text-center mt-2 mb-3">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-primary transition-colors leading-snug">
                    {leader.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-secondary leading-tight min-h-[28px] flex items-center justify-center">
                    {leader.title}
                  </p>
                </div>

                {/* Biyografi / CV Özeti */}
                <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-left my-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    <FileText size={12} className="text-primary" /> Özgeçmiş
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>

              {/* Alt Buton ve Sosyal/Mail */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                  CV İncele <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>

                {/* Sosyal Medya ve Mail İkonları */}
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`mailto:${leader.email || "iletisim@milligenclik.org.tr"}`}
                    className="p-1.5 text-slate-400 hover:text-primary rounded-lg hover:bg-blue-50 transition"
                    title="E-Posta Gönder"
                  >
                    <Mail size={14} />
                  </a>
                  <a
                    href={leader.xUrl || "https://x.com/milligenclikmgd"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                    title="X (Twitter)"
                    aria-label="X (Twitter)"
                  >
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={leader.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-pink-600 rounded-lg hover:bg-pink-50 transition"
                    title="Instagram"
                    aria-label="Instagram"
                  >
                    <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* İnteraktif Özgeçmiş (CV) & Detay Modalı */}
      {activeLeader && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveLeader(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Kapat Butonu */}
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setActiveLeader(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition"
            >
              <X size={20} />
            </button>

            {/* Modal Üst Başlık & Avatar */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5 pr-8">
              <Avatar
                name={activeLeader.name}
                src={activeLeader.photo}
                size={80}
                rounded="2xl"
                className="shadow-lg ring-2 ring-blue-100 object-cover"
              />
              <div>
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-primary mb-1">
                  {activeLeader.roleBadge || "Başkanlık Divanı"}
                </span>
                <h4 className="text-xl font-extrabold text-slate-900">{activeLeader.name}</h4>
                <p className="text-xs font-bold text-secondary">{activeLeader.title}</p>
              </div>
            </div>

            {/* Resmî İletişim Butonları */}
            <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">Resmî İletişim:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${activeLeader.email || "iletisim@milligenclik.org.tr"}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-primary hover:bg-blue-50 transition shadow-sm"
                >
                  <Mail size={13} className="text-secondary" /> E-Posta
                </a>
                <a
                  href={activeLeader.xUrl || "https://x.com/milligenclikmgd"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                  title="X (Twitter)"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={activeLeader.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white hover:opacity-90 transition"
                  title="Instagram"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Biyografi / CV Metni */}
            <div className="py-2 space-y-4">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-primary" /> Biyografi & Görevi
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                  {activeLeader.bio}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
                <p className="text-xs text-blue-900 font-medium">
                  Milli Gençlik Derneği Başkanlık Divanı bünyesinde milli ve manevi gençlik ideallerimizin hayata geçirilmesinden sorumludur.
                </p>
              </div>
            </div>

            {/* Kapat Butonu */}
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setActiveLeader(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
