"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck,
  FileText,
  HeartHandshake,
  Landmark,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useDonate } from "@/components/donate/DonateProvider";
import CorporateModal from "@/components/modals/CorporateModal";

export default function Footer() {
  const { openDonate } = useDonate();
  const [activeCorporateDoc, setActiveCorporateDoc] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      alert("Lütfen geçerli bir e-posta adresi yazınız.");
      return;
    }
    setSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <>
      <footer id="iletisim" className="bg-[#060e20] text-slate-300 border-t border-blue-950">
        {/* Top Newsletter Bar */}
        <div className="border-b border-white/10 bg-[#0A192F]/80 py-8">
          <div className="container-x flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                E-Bülten Aboneliği
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Faaliyetlerimizden ve Raporlarımızdan Haberdar Olun
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Haftalık bültenler ve genel başkan basın açıklamaları e-posta adresinize gelsin.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="w-full md:w-auto flex items-center gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="E-posta adresiniz..."
                className="w-full md:w-72 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-md"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-300" /> Kaydedildi
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

        {/* Main Footer Links Columns */}
        <div className="container-x grid gap-10 py-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: About & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light />
            <p className="text-xs leading-relaxed text-blue-100/80 max-w-sm">
              Milli Gençlik Derneği; &ldquo;Önce Ahlak ve Maneviyat&rdquo; şiarıyla 81 ilde, yüzlerce üniversite kampüsünde ve ilçede gençliğin ilim, irfan, teknoloji ve aksiyon merkezi olarak faaliyet göstermektedir.
            </p>

            <div className="flex items-center gap-2 text-xs text-blue-200 bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck size={18} className="text-secondary shrink-0" />
              <span>T.C. İçişleri Bakanlığı Sivil Toplumla İlişkiler Genel Müdürlüğü Kayıtlı Resmî STK</span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Resmî Sosyal Medya</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://x.com/milligenclikmgd"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs font-semibold text-white transition border border-white/10"
                >
                  X (Twitter)
                </a>
                <a
                  href="https://www.instagram.com/milligenclikmgd/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600 hover:to-pink-600 text-xs font-semibold text-white transition border border-white/10"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Kurumsal */}
          <div>
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Kurumsal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("tuzuk")}
                  className="hover:text-blue-300 transition text-left"
                >
                  Dernek Tüzüğü
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("program")}
                  className="hover:text-blue-300 transition text-left"
                >
                  Teşkilat Programı
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("gelirGider")}
                  className="hover:text-blue-300 transition text-left"
                >
                  Gelir - Gider & Mali Şeffaflık
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCorporateDoc("kurumsalKimlik")}
                  className="hover:text-blue-300 transition text-left"
                >
                  Kurumsal Kimlik & Logo
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openDonate}
                  className="hover:text-blue-300 transition text-left font-semibold text-secondary"
                >
                  Banka Hesap Numaraları (İBAN)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kadro & Faaliyetler */}
          <div>
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              Kadro & Faaliyetler
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/#yonetim" className="hover:text-blue-300 transition">Genel Başkanımız</a></li>
              <li><a href="/#baskanlik-divani" className="hover:text-blue-300 transition">Başkanlık Divanı</a></li>
              <li><a href="/#teskilat" className="hover:text-blue-300 transition">81 İl Teşkilat Haritası</a></li>
              <li><a href="/#program-takvimi" className="hover:text-blue-300 transition">Program Takvimi</a></li>
              <li><a href="/#ilkeler" className="hover:text-blue-300 transition">Milli Görüş İlkeleri</a></li>
              <li><a href="/#erbakan" className="hover:text-blue-300 transition">Prof. Dr. Necmettin Erbakan</a></li>
            </ul>
          </div>

          {/* Col 4: İletişim & Genel Merkez */}
          <div>
            <h4 className="mb-4 font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-2">
              İletişim & Genel Merkez
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex gap-2">
                <MapPin size={16} className="shrink-0 text-secondary mt-0.5" />
                <span>Genel Merkez: Milli Gençlik Cad. Çankaya / Ankara</span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="shrink-0 text-secondary" />
                <span>0 (312) 472 54 54</span>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="shrink-0 text-secondary" />
                <span>iletisim@milligenclik.org.tr</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 text-blue-200 text-xs font-semibold transition border border-blue-800/40"
                >
                  <span>Yönetim Paneli Girişi →</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-blue-200/50">
          <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Milli Gençlik Derneği (MGD). Tüm hakları saklıdır.</span>
            <span>Yeniden Büyük Türkiye • Yeni Bir Dünya Düzeni</span>
          </div>
        </div>
      </footer>

      <CorporateModal
        docKey={activeCorporateDoc}
        onClose={() => setActiveCorporateDoc(null)}
      />
    </>
  );
}
