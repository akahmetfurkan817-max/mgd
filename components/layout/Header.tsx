"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  FolderArchive,
  Handshake,
  Landmark,
  LogIn,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Tv,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useDonate } from "@/components/donate/DonateProvider";
import { useVolunteer } from "@/components/volunteer/VolunteerProvider";
import { useOncuSahsiyetler, usePresident, useSiteSettings } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";
import FlipbookModal from "@/components/corporate/FlipbookModal";
import SearchModal from "@/components/modals/SearchModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeCorporateDoc, setActiveCorporateDoc] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { openDonate } = useDonate();
  const { openVolunteer } = useVolunteer();
  const { data: settings } = useSiteSettings();
  const { data: pioneers } = useOncuSahsiyetler();
  const { data: president } = usePresident();
  const presidentHref = `/baskanlik-divani/${slugify(president?.name || "ahmet-ozvatan")}`;

  const navLabels = {
    programTakvimi: settings.headerLabels?.programTakvimi || "Program Takvimi",
    kurumsal: settings.headerLabels?.kurumsal || "Kurumsal",
    yonetim: settings.headerLabels?.yonetim || "Yönetim",
    oncuSahsiyetler: settings.headerLabels?.oncuSahsiyetler || "Öncü Şahsiyetler",
    haberler: settings.headerLabels?.haberler || "Haberler",
    dosyaArsivi: settings.headerLabels?.dosyaArsivi || "Dosya Arşivi",
    medya: settings.headerLabels?.medya || "Medya",
    iletisim: settings.headerLabels?.iletisim || "İletişim",
    bagisYap: settings.headerLabels?.bagisYap || "Bağış Yap",
    uyelikBasvuru: settings.headerLabels?.uyelikBasvuru || "Üyelik / Başvuru",
    milbisGiris: settings.headerLabels?.milbisGiris || "MİLBİS Giriş",
    milbisUrl: settings.headerLabels?.milbisUrl || "https://milbis.net/giris",
  };

  const contact = settings.contact || {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Ankara",
    xUrl: "https://x.com/milligenclikmgd",
    instagramUrl: "https://www.instagram.com/milligenclikmgd/",
    youtubeUrl: "https://www.youtube.com/@MilliGenclikDernegi",
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navBtnClass = (active: boolean) =>
    `relative flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-bold transition-all ${
      active
        ? "bg-white/15 text-white"
        : "text-white hover:bg-white/15 hover:text-white"
    }`;

  return (
    <>
      {/* Üst Kurumsal Bilgi & Sosyal Medya Barı (Bizi Takip Et!) */}
      <div className="relative z-30 bg-[#0B1E42] text-white/85 border-b border-white/10">
        <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 flex h-10 items-center justify-between gap-3 text-[11.5px]">
          <div className="hidden md:flex items-center gap-4 lg:pl-[156px] xl:pl-[168px]">
            <Link
              href="/etkinlikler"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white font-semibold transition-colors"
            >
              <Calendar size={13} className="text-blue-300" />
              <span>{navLabels.programTakvimi}</span>
            </Link>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <span className="md:hidden text-[11px] font-semibold text-blue-200 truncate">
              Milli Gençlik Derneği
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wide text-blue-200/95">
                Bizi Takip Et!
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={contact.xUrl || "https://x.com/milligenclikmgd"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-primary transition-all"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={contact.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-primary transition-all"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={contact.youtubeUrl || "https://www.youtube.com/@MilliGenclikDernegi"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-primary transition-all"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Premium Header — Yüksek Kontrastlı Koyu Lacivert Zemin */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0D2554]/95 backdrop-blur-xl shadow-[0_12px_36px_-10px_rgba(6,16,38,0.55)] border-b border-white/15"
            : "bg-[#0F2B63] border-b border-white/15"
        } text-white`}
      >
        <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 flex h-[72px] items-center justify-between gap-2">
          {/* Sol: Premium Sarkan MGD Logo Rozeti + Ayırıcı + Menü */}
          <div className="flex items-center gap-3 xl:gap-4 min-w-0">
            {/* Mobil & Tablet Yatay Logo */}
            <Link href="/" aria-label="MGD Ana Sayfa" className="shrink-0 lg:hidden">
              <Logo light />
            </Link>

            {/* Masaüstü: Üstten Sarkan Resmî MGD Logo Kalkanı (Birebir #253573 Zemin & Resmî Amblem) */}
            <div className="relative hidden lg:block w-[138px] xl:w-[148px] h-[72px] shrink-0">
              <Link
                href="/"
                aria-label="Milli Gençlik Derneği Ana Sayfa"
                className={`group absolute left-0 right-0 z-50 flex items-center justify-center bg-[#253573] transition-all duration-300 ${
                  scrolled
                    ? "top-0 h-[82px] rounded-b-2xl shadow-[0_12px_28px_-8px_rgba(4,12,32,0.6)]"
                    : "-top-10 h-[134px] rounded-b-2xl shadow-[0_18px_36px_-10px_rgba(4,12,32,0.65)]"
                }`}
              >
                <div
                  className={`relative z-10 transition-all duration-300 group-hover:scale-105 ${
                    scrolled ? "h-16 w-16" : "h-[104px] w-[104px]"
                  }`}
                >
                  <Image
                    src="/images/mgd-shield-logo.jpg"
                    alt="Milli Gençlik Derneği"
                    fill
                    sizes="108px"
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </Link>
            </div>

            <span className="hidden xl:block h-6 w-px bg-white/15 shrink-0" />

            {/* Masaüstü Navigasyon */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Ana menü">
              {/* KURUMSAL */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("kurumsal")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "kurumsal" ? null : "kurumsal")}
                  className={navBtnClass(isActive("/kurumsal") || isActive("/protokollerimiz"))}
                >
                  <span>{navLabels.kurumsal}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/70 transition-transform duration-200 ${
                      activeDropdown === "kurumsal" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "kurumsal" && (
                  <div className="absolute left-0 top-full pt-2.5 z-50 animate-dropdown">
                    <div className="w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,30,60,0.28)] text-ink">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("hakkimizda");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <FileText size={14} className="text-secondary shrink-0" /> Hakkımızda
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("tuzuk");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <BookOpen size={14} className="text-secondary shrink-0" /> Dernek Tüzüğü
                      </button>
                      <Link
                        href="/protokollerimiz"
                        onClick={() => setActiveDropdown(null)}
                        className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <Handshake size={14} className="text-secondary shrink-0" /> Protokollerimiz
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCorporateDoc("kurumsalKimlik");
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <ShieldCheck size={14} className="text-secondary shrink-0" /> Kurumsal Kimlik
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          openDonate();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary flex items-center gap-2.5 transition"
                      >
                        <Landmark size={14} className="text-secondary shrink-0" /> Banka Hesapları (İBAN)
                      </button>
                      <Link
                        href="/kurumsal"
                        onClick={() => setActiveDropdown(null)}
                        className="mt-1 pt-2.5 border-t border-slate-100 w-full rounded-xl px-3.5 py-2 text-xs font-bold text-primary hover:bg-blue-50 flex items-center justify-between"
                      >
                        <span>Kurumsal Belgeler</span>
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
                  className={navBtnClass(isActive("/genel-baskan") || isActive("/baskanlik-divani"))}
                >
                  <span>{navLabels.yonetim}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/70 transition-transform duration-200 ${
                      activeDropdown === "yonetim" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "yonetim" && (
                  <div className="absolute left-0 top-full pt-2.5 z-50 animate-dropdown">
                    <div className="w-60 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,30,60,0.28)] text-ink">
                      <Link
                        href={presidentHref}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <User size={14} className="text-secondary shrink-0" /> Genel Başkanımız
                      </Link>
                      <Link
                        href="/baskanlik-divani"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <Users size={14} className="text-secondary shrink-0" /> Başkanlık Divanı
                      </Link>
                      <Link
                        href="/#teskilat"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <Landmark size={14} className="text-secondary shrink-0" /> 81 İl Teşkilatı
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ÖNCÜ ŞAHSİYETLER */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("oncu")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "oncu" ? null : "oncu")}
                  className={navBtnClass(isActive("/oncu-sahsiyetler"))}
                >
                  <span>{navLabels.oncuSahsiyetler}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/70 transition-transform duration-200 ${
                      activeDropdown === "oncu" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "oncu" && (
                  <div className="absolute left-0 top-full pt-2.5 z-50 animate-dropdown">
                    <div className="w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,30,60,0.28)] text-ink">
                      {pioneers.slice(0, 5).map((p) => (
                        <Link
                          key={p.id}
                          href={`/oncu-sahsiyetler/${p.id}`}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                        >
                          <Sparkles size={13} className="text-secondary shrink-0" />
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                      <Link
                        href="/oncu-sahsiyetler"
                        onClick={() => setActiveDropdown(null)}
                        className="mt-1 pt-2.5 border-t border-slate-100 w-full rounded-xl px-3.5 py-2 text-xs font-bold text-primary hover:bg-blue-50 flex items-center justify-between"
                      >
                        <span>Tüm Öncü Şahsiyetler</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* HABERLER (Öncü Şahsiyetler ile Medya arasında!) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("haberler")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/haberler"
                  className={navBtnClass(
                    isActive("/haberler") ||
                      isActive("/faaliyetler") ||
                      isActive("/raporlar") ||
                      isActive("/yayinlar"),
                  )}
                >
                  <span>{navLabels.haberler}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/70 transition-transform duration-200 ${
                      activeDropdown === "haberler" ? "rotate-180 text-white" : ""
                    }`}
                  />
                  {isActive("/haberler") && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-white" />
                  )}
                </Link>
                {activeDropdown === "haberler" && (
                  <div className="absolute left-0 top-full pt-2.5 z-50 animate-dropdown">
                    <div className="w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,30,60,0.28)] text-ink">
                      <Link
                        href="/haberler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary hover:bg-blue-50/80 transition"
                      >
                        <Newspaper size={14} className="text-secondary shrink-0" /> Tüm Gündem &amp; Haberler
                      </Link>
                      <Link
                        href="/haberler?cat=Duyurular%20%26%20Burs"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <Sparkles size={14} className="text-secondary shrink-0" /> Haberler &amp; Burs Duyuruları
                      </Link>
                      <Link
                        href="/faaliyetler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <Users size={14} className="text-secondary shrink-0" /> Teşkilat Faaliyetleri
                      </Link>
                      <Link
                        href="/raporlar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <FileText size={14} className="text-secondary shrink-0" /> Basın Bildirileri &amp; Raporlar
                      </Link>
                      <Link
                        href="/yayinlar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <BookOpen size={14} className="text-secondary shrink-0" /> Yayınlar &amp; E-Kütüphane
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* DOSYA ARŞİVİ */}
              <Link href="/dosya-arsivi" className={navBtnClass(isActive("/dosya-arsivi"))}>
                <span>{navLabels.dosyaArsivi}</span>
                {isActive("/dosya-arsivi") && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-white" />
                )}
              </Link>

              {/* MEDYA */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("medya")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(activeDropdown === "medya" ? null : "medya")}
                  className={navBtnClass(isActive("/videolar") || isActive("/etkinlikler"))}
                >
                  <span>{navLabels.medya}</span>
                  <ChevronDown
                    size={13}
                    className={`text-white/70 transition-transform duration-200 ${
                      activeDropdown === "medya" ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "medya" && (
                  <div className="absolute left-0 top-full pt-2.5 z-50 animate-dropdown">
                    <div className="w-60 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,30,60,0.28)] text-ink">
                      <Link
                        href="/videolar"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition"
                      >
                        <Tv size={14} className="text-secondary shrink-0" /> MGD TV &amp; Video Galeri
                      </Link>
                      <Link
                        href="/etkinlikler"
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:text-primary transition border-t border-slate-100 mt-1 pt-2.5"
                      >
                        <Calendar size={14} className="text-secondary shrink-0" /> Program Takvimi
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* İLETİŞİM */}
              <Link href="/iletisim" className={navBtnClass(isActive("/iletisim"))}>
                <span>{navLabels.iletisim}</span>
                {isActive("/iletisim") && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-white" />
                )}
              </Link>
            </nav>
          </div>

          {/* Sağ: Arama + Üyelik / Başvuru + MİLBİS Giriş */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Sitede Ara"
              title="Sitede Ara"
            >
              <Search size={16} />
            </button>

            <Link
              href="/bagis"
              className="hidden sm:inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-xl bg-gold px-3.5 py-2 text-[12px] font-extrabold text-white shadow-sm transition hover:bg-[#2563EB] active:scale-[0.98]"
            >
              <Landmark size={14} />
              <span>{navLabels.bagisYap}</span>
            </Link>

            <button
              type="button"
              onClick={openVolunteer}
              className="hidden sm:inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[12px] font-bold text-[#0F2B63] shadow-sm transition hover:bg-blue-50 active:scale-[0.98]"
            >
              <User size={14} />
              <span>{navLabels.uyelikBasvuru}</span>
            </button>

            <a
              href={navLabels.milbisUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-white/25 active:scale-[0.98]"
            >
              <LogIn size={14} />
              <span>{navLabels.milbisGiris}</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white lg:hidden hover:bg-white/20 transition"
              aria-label="Menüyü Aç"
            >
              <Menu size={19} />
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
                    <Link href="/genel-baskan" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Genel Başkanımız
                    </Link>
                    <Link href="/baskanlik-divani" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Başkanlık Divanı
                    </Link>
                    <Link href="/protokollerimiz" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Protokollerimiz
                    </Link>
                    <Link href="/kurumsal" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Kurumsal Belgeler &amp; Tüzük
                    </Link>
                    <Link href="/oncu-sahsiyetler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      {navLabels.oncuSahsiyetler}
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                    {navLabels.haberler} &amp; Arşiv
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    <Link href="/haberler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Haberler &amp; Burs Duyuruları
                    </Link>
                    <Link href="/faaliyetler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Teşkilat Faaliyetleri
                    </Link>
                    <Link href="/raporlar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Basın Bildirileri &amp; Raporlar
                    </Link>
                    <Link href="/yayinlar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      Yayınlar &amp; E-Kütüphane
                    </Link>
                    <Link href="/dosya-arsivi" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      {navLabels.dosyaArsivi}
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                    {navLabels.medya} &amp; {navLabels.iletisim}
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    <Link href="/videolar" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      MGD TV &amp; Video Galeri
                    </Link>
                    <Link href="/etkinlikler" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      {navLabels.programTakvimi}
                    </Link>
                    <Link href="/iletisim" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-surface">
                      {navLabels.iletisim}
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
                <User size={16} /> {navLabels.uyelikBasvuru}
              </button>
              <a
                href={navLabels.milbisUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                <LogIn size={16} /> {navLabels.milbisGiris} <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDonate();
                }}
                className="btn-outline w-full py-3"
              >
                <Landmark size={16} className="text-secondary" /> {navLabels.bagisYap}
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
