"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useDonate } from "@/components/donate/DonateProvider";
import { useSiteSettings } from "@/hooks/useSiteData";
import FlipbookModal from "@/components/corporate/FlipbookModal";

export default function Footer() {
  const { openDonate } = useDonate();
  const { data: settings } = useSiteSettings();
  const [activeCorporateDoc, setActiveCorporateDoc] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const contact = settings.contact || {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Milli Gençlik Cad. Çankaya / Ankara",
    xUrl: "https://x.com/milligenclikmgd",
    instagramUrl: "https://www.instagram.com/milligenclikmgd/",
    youtubeUrl: "https://www.youtube.com/@MilliGenclikDernegi",
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setSubscribed(true);
        setNewsletterEmail("");
        setTimeout(() => setSubscribed(false), 4500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <footer id="iletisim" className="relative overflow-hidden bg-[#061529] text-slate-300 border-t border-white/10">
        {/* Sağ Arka Plan Büyük Selçuklu Yıldızı Filigranı (TÜGVA ilhamlı) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none select-none absolute -right-16 bottom-6 h-[420px] w-[420px] text-white/[0.045]"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
        >
          <rect x="42" y="42" width="116" height="116" rx="4" />
          <rect x="42" y="42" width="116" height="116" rx="4" transform="rotate(45 100 100)" />
        </svg>

        {/* E-Bülten Şeridi */}
        <div className="relative border-b border-white/10 bg-gradient-to-r from-[#0B2245] via-primary to-[#0D2B5C]">
          <div className="container-x py-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-200">
                E-Bülten Aboneliği
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                Faaliyetlerimizden ve Duyurularımızdan Haberdar Olun
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
                Haftalık teşkilat bültenleri, burs duyuruları ve genel merkez açıklamaları e-posta adresinize gelsin.
              </p>
            </div>

            <form
              onSubmit={handleNewsletter}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                className="w-full sm:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/70 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-primary text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={15} /> Kaydedildi
                  </>
                ) : (
                  <>
                    <Send size={14} /> Abone Ol
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Ana Footer İçeriği */}
        <div className="container-x relative grid gap-10 py-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          {/* Sol: Logo + İletişim Satırları + Sosyal İkonlar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Logo light />
            </div>

            <div className="space-y-3.5 text-sm">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-blue-300 group-hover:bg-white/20 transition">
                  <MapPin size={15} />
                </span>
                <span className="pt-1 leading-relaxed">
                  <strong className="text-white">Adres:</strong> {contact.address}
                </span>
              </a>

              <a
                href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-blue-300 group-hover:bg-white/20 transition">
                  <Phone size={15} />
                </span>
                <span>
                  <strong className="text-white">Telefon:</strong> {contact.phone}
                </span>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-blue-300 group-hover:bg-white/20 transition">
                  <Mail size={15} />
                </span>
                <span>
                  <strong className="text-white">E-Posta:</strong> {contact.email}
                </span>
              </a>
            </div>

            {/* Yasal + Sosyal İkonlar */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-400">
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("tuzuk")}
                  className="hover:text-white transition-colors"
                >
                  Dernek Tüzüğü
                </button>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  KVKK &amp; İletişim
                </Link>
                <span className="inline-flex items-center gap-1.5 text-blue-200/80">
                  <ShieldCheck size={14} /> Resmî STK
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={contact.xUrl || "https://x.com/milligenclikmgd"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white hover:text-[#061529] transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={contact.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white hover:text-[#061529] transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={contact.youtubeUrl || "https://www.youtube.com/@MilliGenclikDernegi"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white hover:text-[#061529] transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Kurumsal */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              Kurumsal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/genel-baskan" className="hover:text-white transition-colors">
                  Genel Başkanımız
                </Link>
              </li>
              <li>
                <Link href="/baskanlik-divani" className="hover:text-white transition-colors">
                  Başkanlık Divanı
                </Link>
              </li>
              <li>
                <Link href="/protokollerimiz" className="hover:text-white transition-colors">
                  Protokollerimiz
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("tuzuk")}
                  className="hover:text-white transition-colors text-left"
                >
                  Dernek Tüzüğü
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openDonate}
                  className="text-blue-300 hover:text-white transition-colors text-left font-semibold"
                >
                  Banka Hesapları (İBAN)
                </button>
              </li>
            </ul>
          </div>

          {/* Haberler & Arşiv */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              Haberler &amp; Arşiv
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/haberler" className="hover:text-white transition-colors">
                  Gündem &amp; Haberler
                </Link>
              </li>
              <li>
                <Link href="/faaliyetler" className="hover:text-white transition-colors">
                  Teşkilat Faaliyetleri
                </Link>
              </li>
              <li>
                <Link href="/raporlar" className="hover:text-white transition-colors">
                  Basın Bildirileri &amp; Raporlar
                </Link>
              </li>
              <li>
                <Link href="/yayinlar" className="hover:text-white transition-colors">
                  Yayınlar &amp; E-Kütüphane
                </Link>
              </li>
              <li>
                <Link href="/dosya-arsivi" className="hover:text-white transition-colors">
                  Dosya Arşivi
                </Link>
              </li>
              <li>
                <Link href="/oncu-sahsiyetler" className="hover:text-white transition-colors">
                  Öncü Şahsiyetler
                </Link>
              </li>
            </ul>
          </div>

          {/* Medya & Hızlı Erişim */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              Medya &amp; Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/videolar" className="hover:text-white transition-colors">
                  MGD TV &amp; Videolar
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="hover:text-white transition-colors">
                  Program Takvimi
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <a
                  href="https://milbis.net/giris"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  MİLBİS Giriş →
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.07] hover:bg-white/15 text-slate-200 text-xs font-semibold transition border border-white/10"
                >
                  <span>Yönetim Paneli</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Telif */}
        <div className="relative border-t border-white/10 py-6 text-xs text-slate-500">
          <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Milli Gençlik Derneği (MGD) — Tüm Hakları Saklıdır.</span>
            <span className="text-slate-400 font-medium">Önce Ahlak ve Maneviyat</span>
          </div>
        </div>
      </footer>

      <FlipbookModal docKey={activeCorporateDoc} onClose={() => setActiveCorporateDoc(null)} />
    </>
  );
}
