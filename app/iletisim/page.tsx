"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteData";

export default function IletisimPage() {
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const contact = settings.contact || {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Milli Gençlik Cad. Çankaya / Ankara",
    xUrl: "https://x.com/milligenclikmgd",
    instagramUrl: "https://www.instagram.com/milligenclikmgd/",
    youtubeUrl: "https://www.youtube.com/@MilliGenclikDernegi",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Üst Banner */}
        <section className="bg-gradient-to-r from-[#061124] via-primary-dark to-[#122D61] text-white py-14 sm:py-20 border-b border-white/10">
          <div className="container-x">
            <ScrollReveal y={18} duration={650}>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.22em] text-blue-300 mb-2">
                Milli Gençlik Derneği Genel Merkezi
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                İletişim
              </h1>
              <p className="mt-3 text-sm sm:text-base text-blue-100/85 max-w-2xl">
                Genel Merkezimizle doğrudan iletişime geçebilir, görüş ve önerilerinizi iletebilir veya 81 il teşkilatımızın bilgilerine ulaşabilirsiniz.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* İletişim Kartları & Form */}
        <section className="py-12 sm:py-16">
          <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sol: İletişim Bilgileri (5 sütun) */}
              <div className="lg:col-span-5 space-y-5">
                <ScrollReveal y={22} duration={700}>
                  <div className="rounded-3xl bg-white border border-slate-200/90 p-7 shadow-sm space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-extrabold text-ink">
                        Genel Merkez İletişim
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Hafta içi 09:00 – 18:00 saatleri arasında bize ulaşabilirsiniz.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 hover:border-primary/30 transition"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                          <MapPin size={19} />
                        </span>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Adres
                          </span>
                          <p className="text-sm font-bold text-ink mt-0.5 leading-snug">
                            {contact.address}
                          </p>
                        </div>
                      </a>

                      <a
                        href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                        className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 hover:border-primary/30 transition"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-white">
                          <Phone size={19} />
                        </span>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Telefon
                          </span>
                          <p className="text-sm font-bold text-ink mt-0.5">{contact.phone}</p>
                        </div>
                      </a>

                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 hover:border-primary/30 transition"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-dark text-white">
                          <Mail size={19} />
                        </span>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            E-Posta
                          </span>
                          <p className="text-sm font-bold text-ink mt-0.5">{contact.email}</p>
                        </div>
                      </a>

                      <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
                          <Clock size={19} />
                        </span>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Çalışma Saatleri
                          </span>
                          <p className="text-sm font-bold text-ink mt-0.5">
                            Pazartesi – Cumartesi: 09:00 – 18:00
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href="/#teskilat"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 hover:bg-primary hover:text-white px-4 py-3 text-xs font-extrabold text-primary transition"
                      >
                        <Users size={15} /> 81 İl Teşkilat Haritasına Git →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Sağ: Mesaj Gönder Formu (7 sütun) */}
              <div className="lg:col-span-7">
                <ScrollReveal delay={80} y={24} duration={750}>
                  <div className="rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-9 shadow-sm">
                    <h2 className="font-display text-2xl font-extrabold text-ink">
                      Bize Mesaj Gönderin
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      Sorularınız, talepleriniz veya iş birliği önerileriniz için formu doldurabilirsiniz.
                    </p>

                    {sent && (
                      <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm font-bold text-emerald-800">
                        <CheckCircle2 size={18} />
                        <span>Mesajınız başarıyla alındı. En kısa sürede dönüş yapılacaktır.</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Ad Soyad *
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Adınız ve soyadınız"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            E-Posta *
                          </label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="ornek@eposta.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="05XX XXX XX XX"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Konu
                          </label>
                          <input
                            type="text"
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            placeholder="Mesaj konusu"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Mesajınız *
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Mesajınızı buraya yazın..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-ink focus:border-primary focus:bg-white focus:outline-none transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm shadow-lg shadow-primary/20"
                      >
                        <Send size={15} /> Mesajı Gönder
                      </button>
                    </form>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
