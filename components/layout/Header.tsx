"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Handshake,
  Landmark,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import FlipbookModal from "@/components/corporate/FlipbookModal";
import SearchModal from "@/components/modals/SearchModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeCorporateDoc, setActiveCorporateDoc] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-primary text-white transition-shadow duration-200 ${
          scrolled ? "shadow-lg shadow-primary-dark/25" : "border-b border-white/10"
        }`}
      >
        <div className="container-x flex h-[76px] items-center justify-between gap-4">
          {/* Sol: Logo + Ayırıcı + Menü */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link href="/" aria-label="MGD Ana Sayfa" className="shrink-0">
              <Logo light />
            </Link>

            <span className="hidden lg:block h-7 w-px bg-white/15" />

            {/* Masaüstü Navigasyon */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Ana menü">
              {/* KURUMSAL */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("kurumsal")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "kurumsal" ? null : "kurumsal")}
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-white/95 hover:text-white py-2 transition-colors"
                >
                  <span>Kurumsal</span>
                  <ChevronDown size={14} className="text-white/70" />
                </button>
                {activeDropdown === "kurumsal" && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl text-ink">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("hakkimizda");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <FileText size={14} className="text-secondary" /> Hakkımızda
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("tuzuk");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <BookOpen size={14} className="text-secondary" /> Dernek Tüzüğü
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("protokoller");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <Handshake size={14} className="text-secondary" /> Protokollerimiz
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("kurumsalKimlik");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <ShieldCheck size={14} className="text-secondary" /> Kurumsal Kimlik
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openDonate();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <Landmark size={14} className="text-secondary" /> Banka Hesapları (İBAN)
                      </button>
                      <Link
                        href="/kurumsal"
                        onClick={() => setActiveDropdown(null)}
                        className="mt-1 pt-2.5 border-t border-slate-100 w-full rounded-lg px-3 py-2 text-xs font-bold text-primary hover:bg-surface flex items-center justify-between"
                      >
                        <span>Tüm Kurumsal Sayfası</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* YÖNETİM */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("yonetim")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "yonetim" ? null : "yonetim")}
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-white/95 hover:text-white py-2 transition-colors"
                >
                  <span>Yönetim</span>
                  <ChevronDown size={14} className="text-white/70" />
                </button>
                {activeDropdown === "yonetim" && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl text-ink">
                      <Link
                        href="/kurumsal"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <User size={14} className="text-secondary" /> Genel Başkanımız
                      </Link>
                      <Link
                        href="/kurumsal"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Users size={14} className="text-secondary" /> Başkanlık Divanı
                      </Link>
                      <Link
                        href="/#teskilat"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Landmark size={14} className="text-secondary" /> 81 İl Teşkilatı
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ÖNCÜ ŞAHSİYETLER (Videoların olduğu üst konuma taşındı) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("oncu")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "oncu" ? null : "oncu")}
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-white/95 hover:text-white py-2 transition-colors"
                >
                  <span>Öncü Şahsiyetler</span>
                  <ChevronDown size={14} className="text-white/70" />
                </button>
                {activeDropdown === "oncu" && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl text-ink">
                      <Link
                        href="/oncu-sahsiyetler"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        Prof. Dr. Necmettin Erbakan
                      </Link>
                      <Link
                        href="/oncu-sahsiyetler"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        Tüm Öncü Şahsiyetler
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* MEDYA VE YAYINLAR (Videolar bu menünün altına alındı) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("medya")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "medya" ? null : "medya")}
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-white/95 hover:text-white py-2 transition-colors"
                >
                  <span>Medya ve Yayınlar</span>
                  <ChevronDown size={14} className="text-white/70" />
                </button>
                {activeDropdown === "medya" && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl text-ink">
                      <Link
                        href="/videolar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Video size={14} className="text-secondary" /> Videolar &amp; MGD TV
                      </Link>
                      <Link
                        href="/yayinlar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <BookOpen size={14} className="text-secondary" /> Yayınlar &amp; E-Kütüphane
                      </Link>
                      <Link
                        href="/haberler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Newspaper size={14} className="text-secondary" /> Haberler &amp; Burs Duyuruları
                      </Link>
                      <Link
                        href="/faaliyetler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Users size={14} className="text-secondary" /> Teşkilat Faaliyetleri
                      </Link>
                      <Link
                        href="/etkinlikler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <Calendar size={14} className="text-secondary" /> Program Takvimi
                      </Link>
                      <Link
                        href="/raporlar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition"
                      >
                        <FileText size={14} className="text-secondary" /> Basın Bildirileri &amp; Raporlar
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("kurumsalKimlik");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-surface hover:text-primary transition border-t border-slate-100 mt-1 pt-2.5"
                      >
                        <ShieldCheck size={14} className="text-secondary" /> Kurumsal Kimlik
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* İLETİŞİM */}
              <Link
                href="/#iletisim"
                className="text-[14px] font-semibold text-white/95 hover:text-white py-2 transition-colors"
              >
                İletişim
              </Link>
            </nav>
          </div>

          {/* Sağ: Arama + Üyelik / Başvuru */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Sitede Ara"
              title="Sitede Ara"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              onClick={openVolunteer}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-primary shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
            >
              <User size={16} />
              <span>Üyelik / Başvuru</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white lg:hidden hover:bg-white/20 transition"
              aria-label="Menüyü Aç"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobil Menü Çekmecesi */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-primary-dark/75 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-ink rounded-lg hover:bg-slate-100"
                  aria-label="Menüyü Kapat"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <span className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                    Kurumsal &amp; Yönetim
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    <Link href="/kurumsal" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Kurumsal &amp; Yönetim
                    </Link>
                    <Link href="/#teskilat" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      81 İl Teşkilatı
                    </Link>
                    <Link href="/oncu-sahsiyetler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Öncü Şahsiyetler
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                    Medya ve Yayınlar
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    <Link href="/videolar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Videolar &amp; MGD TV
                    </Link>
                    <Link href="/yayinlar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Yayınlar &amp; E-Kütüphane
                    </Link>
                    <Link href="/haberler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Haberler &amp; Burs Duyuruları
                    </Link>
                    <Link href="/faaliyetler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Teşkilat Faaliyetleri
                    </Link>
                    <Link href="/etkinlikler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Program Takvimi
                    </Link>
                    <Link href="/raporlar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Basın Bildirileri &amp; Raporlar
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openVolunteer();
                }}
                className="btn-primary w-full py-3"
              >
                <User size={16} /> Üyelik / Başvuru
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDonate();
                }}
                className="btn-outline w-full py-3"
              >
                <Landmark size={16} className="text-secondary" /> Bağış Yap (İBAN)
              </button>
            </div>
          </div>
        </div>
      )}

      <FlipbookModal docKey={activeCorporateDoc} onClose={() => setActiveCorporateDoc(null)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
