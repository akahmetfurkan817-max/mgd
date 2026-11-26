"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Mail,
  Phone,
  ShieldCheck,
  Tent,
  Users,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useIban, useSiteSettings } from "@/hooks/useSiteData";

const PURPOSE_ICONS = [GraduationCap, BookOpen, Tent, Users, HeartHandshake];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export default function BagisPage() {
  const { data: ibanList } = useIban();
  const { data: settings } = useSiteSettings();
  const donationPurposes = settings.categories?.donationPurposes || [];
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedPurpose =
    donationPurposes.find((p) => p.id === selectedId) ||
    donationPurposes[0] || { id: "genel", title: "Genel Bağış", desc: "", note: "Genel Bağış" };
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const contact = settings.contact;

  const handleCopy = async (key: string, value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      {/* Üst Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07152D] via-[#0F2B63] to-[#13387C] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="container-x relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition mb-6"
          >
            <ArrowLeft size={14} /> Ana Sayfaya Dön
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-light">
                <HeartHandshake size={14} /> Resmî Bağış &amp; Burs Portalı
              </div>
              <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Şuurlu Bir Neslin İnşasına{" "}
                <span className="text-gold-light">Destek Olun</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Milli Gençlik Derneği resmî banka hesapları üzerinden havale veya EFT ile güvenli ve şeffaf bir şekilde bağış yapabilirsiniz. Aşağıdan bağış alanınızı seçip IBAN ve açıklama bilgisini tek tıkla kopyalayabilirsiniz.
              </p>
            </div>

            {contact?.donateUrl && (
              <a
                href={contact.donateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-primary-dark shadow-lg hover:bg-gold-light transition shrink-0"
              >
                <HeartHandshake size={18} /> Online Kart ile Bağış Yap <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 sm:py-16">
        <div className="container-x space-y-12">
          {/* 1. Adım: Bağış Alanı Seçimi */}
          <div>
            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                1. Adım — Bağış Alanı Seçin
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-primary-dark">
                Hangi Çalışmaya Destek Olmak İstersiniz?
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {donationPurposes.map((p, idx) => {
                const Icon = PURPOSE_ICONS[idx % PURPOSE_ICONS.length];
                const active = selectedPurpose.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`text-left rounded-2xl border p-5 transition-all ${
                      active
                        ? "border-primary bg-primary text-white shadow-lg ring-2 ring-primary/25"
                        : "border-slate-200 bg-white text-ink hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
                        active ? "bg-white/15 text-gold-light" : "bg-primary/5 text-primary"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-base">{p.title}</h3>
                    <p
                      className={`mt-1.5 text-xs leading-relaxed ${
                        active ? "text-blue-100" : "text-slate-600"
                      }`}
                    >
                      {p.desc}
                    </p>
                    <div
                      className={`mt-3 inline-flex items-center gap-1 text-[11px] font-bold ${
                        active ? "text-gold-light" : "text-primary"
                      }`}
                    >
                      {active ? "✓ Seçili Açıklama" : "Seç"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Adım: Resmî Banka Hesapları (IBAN) */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                  2. Adım — Havale / EFT Hesap Bilgileri
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold text-primary-dark">
                  Resmî Banka Hesaplarımız (IBAN)
                </h2>
              </div>

              <button
                type="button"
                onClick={() => handleCopy("purpose-note", selectedPurpose.note)}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition self-start sm:self-auto"
              >
                {copiedKey === "purpose-note" ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  Açıklama: &ldquo;{selectedPurpose.note}&rdquo;{" "}
                  {copiedKey === "purpose-note" ? "(Kopyalandı)" : "— Kopyala"}
                </span>
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {ibanList.map((acc) => {
                const cleanIban = acc.iban.replace(/\s/g, "");
                const ibanCopied = copiedKey === `iban-${acc.iban}`;
                const holderCopied = copiedKey === `holder-${acc.iban}`;

                return (
                  <div
                    key={acc.iban}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Landmark size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-primary-dark">{acc.bank}</h3>
                            <p className="text-xs text-slate-500">TL Hesabı (Havale / EFT / FAST)</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Hesap Adı (Alıcı)
                          </span>
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-ink">{acc.accountHolder}</p>
                            <button
                              type="button"
                              onClick={() => handleCopy(`holder-${acc.iban}`, acc.accountHolder)}
                              className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-primary hover:text-primary transition inline-flex items-center gap-1"
                            >
                              {holderCopied ? <Check size={12} /> : <Copy size={12} />}
                              {holderCopied ? "Kopyalandı" : "Kopyala"}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl bg-ivory border border-slate-200/80 p-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            IBAN Numarası
                          </span>
                          <p className="mt-1 break-all font-mono text-base sm:text-lg font-extrabold tracking-wide text-primary-dark select-all">
                            {acc.iban}
                          </p>
                        </div>

                        {acc.note && (
                          <p className="text-xs text-slate-500 leading-relaxed">{acc.note}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(`iban-${acc.iban}`, cleanIban)}
                        className="btn-primary flex-1 justify-center py-2.5 text-xs sm:text-sm"
                      >
                        {ibanCopied ? (
                          <>
                            <Check size={16} /> IBAN Kopyalandı
                          </>
                        ) : (
                          <>
                            <Copy size={16} /> IBAN&apos;ı Tek Tıkla Kopyala
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Güven & İletişim Bilgilendirmesi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-base text-primary-dark">
                  Şeffaf Bağış &amp; Makbuz Bilgilendirmesi
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tüm bağışlarınız Milli Gençlik Derneği resmî kayıtlarına işlenmektedir. Dekont bildirimi, burs sponsorluğu veya kurumsal destek talepleriniz için Genel Merkezimizle doğrudan iletişime geçebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="btn-outline text-xs py-2.5 px-4"
                >
                  <Phone size={14} /> {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="btn-outline text-xs py-2.5 px-4">
                  <Mail size={14} /> {contact.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
