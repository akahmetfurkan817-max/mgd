"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileCheck,
  FileText,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import { useSiteSettings } from "@/hooks/useSiteData";
import CorporateModal from "@/components/modals/CorporateModal";
import SearchModal from "@/components/modals/SearchModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeCorporateDoc, setActiveCorporateDoc] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();
  const { data: settings } = useSiteSettings();

  const contact = settings.contact || {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Ankara",
  };

  return (
    <>
      {/* 1. KURUMSAL TOP BAR (Yeniden Refah Partisi Stili - Gece Mavisi) */}
      <div className="bg-[#0A192F] text-slate-300 text-[11px] border-b border-blue-900/40 hidden md:block">
        <div className="container-x flex h-9 items-center justify-between">
          {/* Sol: İletişim Bilgileri */}
          <div className="flex items-center gap-5">
            <a
              href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Phone size={12} className="text-secondary" />
              <span>{contact.phone}</span>
            </a>
            <span className="text-white/20">|</span>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <Mail size={12} className="text-secondary" />
              <span>{contact.email}</span>
            </a>
            <span className="text-white/20">|</span>
            <span className="text-blue-300 font-medium">{contact.address}</span>
          </div>

          {/* Sağ: Hızlı Linkler ve Sosyal Medya */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveCorporateDoc("gelirGider")}
              className="hover:text-blue-200 transition"
            >
              Mali Şeffaflık
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={openDonate}
              className="flex items-center gap-1 hover:text-blue-200 transition font-semibold"
            >
              <Landmark size={11} className="text-secondary" />
              <span>Banka Hesap Numaraları (İBAN)</span>
            </button>
            <span className="text-white/20">•</span>
            <a
              href="https://x.com/milligenclikmgd"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              X: @milligenclikmgd
            </a>
            <a
              href="https://www.instagram.com/milligenclikmgd/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* 2. ANA HEADER (Beyaz & Mavi Aksanlı) */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container-x flex h-20 items-center justify-between gap-3">
          {/* Sol: Logo */}
          <Link href="/" aria-label="MGD Ana Sayfa" className="shrink-0">
            <Logo />
          </Link>

          {/* Orta: Yeniden Refah Partisi Mimarisi Menü Ağacı */}
          <nav className="hidden items-center gap-5 xl:gap-6 lg:flex" aria-label="Ana menü">
            <Link
              href="/"
              className="text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
            >
              ANASAYFA
            </Link>

            {/* DERNEK / KURUMSAL DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("kurumsal")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
              >
                KURUMSAL <ChevronDown size={13} className="text-slate-500" />
              </button>
              {activeDropdown === "kurumsal" && (
                <div className="absolute left-0 top-full w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCorporateDoc("tuzuk");
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <FileText size={14} className="text-secondary" /> Dernek Tüzüğü
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCorporateDoc("program");
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <BookOpen size={14} className="text-secondary" /> Teşkilat Programı
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCorporateDoc("gelirGider");
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <FileCheck size={14} className="text-secondary" /> Gelir - Gider & Mali Şeffaflık
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCorporateDoc("kurumsalKimlik");
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <Sparkles size={14} className="text-secondary" /> Kurumsal Kimlik & Logo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openDonate();
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-blue-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                  >
                    <Landmark size={14} className="text-primary" /> Banka Hesap Numaraları (İBAN)
                  </button>
                </div>
              )}
            </div>

            {/* KADRO DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("kadro")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
              >
                KADRO <ChevronDown size={13} className="text-slate-500" />
              </button>
              {activeDropdown === "kadro" && (
                <div className="absolute left-0 top-full w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <Link
                    href="/#yonetim"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Genel Başkanımız & Biyografi
                  </Link>
                  <Link
                    href="/#baskanlik-divani"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Başkanlık Divanı
                  </Link>
                  <Link
                    href="/#teskilat"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    81 İl Teşkilatı
                  </Link>
                </div>
              )}
            </div>

            {/* HABERLER DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("haberler")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
              >
                HABERLER <ChevronDown size={13} className="text-slate-500" />
              </button>
              {activeDropdown === "haberler" && (
                <div className="absolute left-0 top-full w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <Link
                    href="/haberler"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Gündem & Manşetler
                  </Link>
                  <Link
                    href="/haberler"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Basın Açıklamaları
                  </Link>
                  <Link
                    href="/faaliyetler"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Teşkilat Faaliyetleri & Medya
                  </Link>
                </div>
              )}
            </div>

            {/* RAPORLAR */}
            <Link
              href="/raporlar"
              className="text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
            >
              RAPORLAR
            </Link>

            {/* PROGRAM TAKVİMİ */}
            <Link
              href="/etkinlikler"
              className="text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2 flex items-center gap-1"
            >
              <Calendar size={13} className="text-secondary" />
              <span>TAKVİM</span>
            </Link>

            {/* YAYINLAR & E-KÜTÜPHANE */}
            <Link
              href="/yayinlar"
              className="text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
            >
              YAYINLAR
            </Link>

            {/* İLKELER (VAATLER) */}
            <Link
              href="/#ilkeler"
              className="text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
            >
              İLKELER
            </Link>

            {/* MULTİMEDYA */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("medya")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs xl:text-sm font-bold text-slate-800 transition hover:text-secondary py-2"
              >
                MULTİMEDYA <ChevronDown size={13} className="text-slate-500" />
              </button>
              {activeDropdown === "medya" && (
                <div className="absolute left-0 top-full w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <Link
                    href="/videolar"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Video Galeri
                  </Link>
                  <Link
                    href="/faaliyetler"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Faaliyet & Fotoğraf Arşivi
                  </Link>
                  <Link
                    href="/#sosyal-medya"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-secondary"
                  >
                    Sosyal Medya (@milligenclikmgd)
                  </Link>
                </div>
              )}
            </div>

            {/* Prof. Dr. Necmettin Erbakan Özel Butonu */}
            <Link
              href="/#erbakan"
              className="group flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white border border-blue-200/80 shadow-sm"
            >
              <Sparkles size={13} className="text-secondary group-hover:text-yellow-300" />
              <span>Prof. Dr. Necmettin Erbakan</span>
            </Link>
          </nav>

          {/* Sağ: Arama İkonu + Aksiyon Butonları */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Canlı Arama Butonu */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-secondary transition border border-slate-200 shadow-sm"
              aria-label="Sitede Ara"
              title="Sitede Ara"
            >
              <Search size={16} />
            </button>

            {/* Bağışçımız Ol & Gönüllümüz Ol Butonları */}
            <button
              type="button"
              onClick={openDonate}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0A192F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1E3A8A] shadow-md hover:shadow-lg active:scale-95"
            >
              <HeartHandshake size={14} /> Bağış Yap
            </button>
            <button
              type="button"
              onClick={openVolunteer}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1E3A8A] px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary shadow-md hover:shadow-lg active:scale-95"
            >
              <UserPlus size={14} /> Gönüllü Ol
            </button>

            {/* Mobil Menü Butonu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 lg:hidden hover:text-primary rounded-lg hover:bg-slate-100 transition"
              aria-label="Menüyü Aç"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBİL MENÜ ÇEKMECESİ (DRAWER) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                  aria-label="Menüyü Kapat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Arama Butonu */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500 hover:text-primary transition"
              >
                <Search size={15} className="text-secondary" />
                <span>Haber, rapor veya teşkilat ara...</span>
              </button>

              {/* Mobile Linkler */}
              <div className="mt-5 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-bold text-slate-800 hover:bg-blue-50"
                >
                  Ana Sayfa
                </Link>

                <div className="py-2 border-t border-slate-100 mt-2">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kurumsal
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveCorporateDoc("tuzuk");
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Dernek Tüzüğü
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveCorporateDoc("program");
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Teşkilat Programı
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveCorporateDoc("gelirGider");
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Gelir - Gider & Mali Şeffaflık
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveCorporateDoc("kurumsalKimlik");
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Kurumsal Kimlik & Logo
                  </button>
                </div>

                <div className="py-2 border-t border-slate-100">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kadro & Teşkilat
                  </span>
                  <Link
                    href="/#yonetim"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Genel Başkanımız
                  </Link>
                  <Link
                    href="/#baskanlik-divani"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Başkanlık Divanı
                  </Link>
                  <Link
                    href="/#teskilat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    81 İl Teşkilat Haritası
                  </Link>
                </div>

                <div className="py-2 border-t border-slate-100">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Yayın & Faaliyetler
                  </span>
                  <Link
                    href="/haberler"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Gündem & Haberler
                  </Link>
                  <Link
                    href="/faaliyetler"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Teşkilat Faaliyetleri & Medya
                  </Link>
                  <Link
                    href="/raporlar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Basın Bildirileri & Raporlar
                  </Link>
                  <Link
                    href="/etkinlikler"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Program Takvimi & Ajanda
                  </Link>
                  <Link
                    href="/yayinlar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    E-Kütüphane & Yayınlar
                  </Link>
                  <Link
                    href="/videolar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Video Galeri
                  </Link>
                  <Link
                    href="/#ilkeler"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Milli Gençlik İlkeleri (Vaatler)
                  </Link>
                  <Link
                    href="/#sosyal-medya"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                  >
                    Sosyal Medya (@milligenclikmgd)
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Alt Aksiyonlar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openVolunteer();
                }}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus size={15} /> Gönüllü Ol
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDonate();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <HeartHandshake size={15} /> Bağış Yap (İBAN)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALLAR */}
      <CorporateModal
        docKey={activeCorporateDoc}
        onClose={() => setActiveCorporateDoc(null)}
      />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
