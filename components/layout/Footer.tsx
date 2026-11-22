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
      <footer id="iletisim" className="bg-primary-dark text-slate-300 border-t border-white/10">
        {/* E-Bülten Şeridi */}
        <div className="border-b border-white/10 bg-primary">
          <div className="container-x py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-200">
                E-Bülten Aboneliği
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                Faaliyetlerimizden ve Duyurularımızdan Haberdar Olun
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-1">
                Haftalık teşkilat bültenleri, burs duyuruları ve genel merkez açıklamaları e-posta adresinize gelsin.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-primary text-xs font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
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

        {/* Ana Footer Sütunları */}
        <div className="container-x grid gap-10 py-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          {/* Kurumsal Özet */}
          <div className="lg:col-span-4 space-y-5">
            <Logo light />
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Milli Gençlik Derneği; &ldquo;Önce Ahlak ve Maneviyat&rdquo; düsturuyla 81 ilde, üniversite kampüslerinde ve ilçelerde gençliğin ilim, irfan ve aksiyon merkezi olarak faaliyet göstermektedir.
            </p>

            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-white/[0.04] p-3.5 rounded-lg border border-white/10">
              <ShieldCheck size={17} className="text-gold-light shrink-0 mt-0.5" />
              <span>T.C. İçişleri Bakanlığı Sivil Toplumla İlişkiler Genel Müdürlüğü Kayıtlı Resmî STK</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={contact.xUrl || "https://x.com/milligenclikmgd"}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10"
              >
                X (Twitter)
              </a>
              <a
                href={contact.instagramUrl || "https://www.instagram.com/milligenclikmgd/"}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg bg-white/[0.06] hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Kurumsal */}
          <div className="lg:col-span-2">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              Kurumsal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button type="button" onClick={() => setActiveCorporateDoc("tuzuk")} className="hover:text-white transition-colors text-left">
                  Dernek Tüzüğü
                </button>
              </li>
              <li>
                <Link href="/etkinlikler" className="hover:text-white transition-colors">
                  Teşkilat Programı
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => setActiveCorporateDoc("kurumsalKimlik")} className="hover:text-white transition-colors text-left">
                  Kurumsal Kimlik
                </button>
              </li>
              <li>
                <button type="button" onClick={openDonate} className="text-gold-light hover:text-white transition-colors text-left font-semibold">
                  Banka Hesapları (İBAN)
                </button>
              </li>
            </ul>
          </div>

          {/* Kadro & Faaliyetler */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              Kadro &amp; Faaliyetler
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/#yonetim" className="hover:text-white transition-colors">Genel Başkanımız</Link></li>
              <li><Link href="/haberler" className="hover:text-white transition-colors">Haberler &amp; Burs Duyuruları</Link></li>
              <li><Link href="/faaliyetler" className="hover:text-white transition-colors">Teşkilat Faaliyetleri</Link></li>
              <li><Link href="/etkinlikler" className="hover:text-white transition-colors">Program Takvimi</Link></li>
              <li><Link href="/yayinlar" className="hover:text-white transition-colors">E-Kütüphane &amp; Yayınlar</Link></li>
              <li><Link href="/#erbakan" className="hover:text-white transition-colors">Prof. Dr. Necmettin Erbakan</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="lg:col-span-3">
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-[0.18em]">
              İletişim &amp; Genel Merkez
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex gap-2.5">
                <MapPin size={16} className="shrink-0 text-gold-light mt-0.5" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors underline-offset-4 hover:underline"
                >
                  {contact.address}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Phone size={16} className="shrink-0 text-gold-light mt-0.5" />
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-white transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="shrink-0 text-gold-light mt-0.5" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate-200 text-xs font-semibold transition border border-white/10"
                >
                  <span>Yönetim Paneli</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Telif */}
        <div className="border-t border-white/10 py-6 text-xs text-slate-500">
          <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Milli Gençlik Derneği (MGD). Tüm hakları saklıdır.</span>
            <span className="text-slate-400">Önce Ahlak ve Maneviyat</span>
          </div>
        </div>
      </footer>

      <FlipbookModal docKey={activeCorporateDoc} onClose={() => setActiveCorporateDoc(null)} />
    </>
  );
}
