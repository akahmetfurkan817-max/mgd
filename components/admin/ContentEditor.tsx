"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CalendarCheck,
  GraduationCap,
  Palette,
  Phone,
  Quote,
  Save,
  Sparkles,
  Type,
  Users2,
} from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import type { ContactConfig, HeroConfig, StatsItemConfig, ThemeConfig, VisionConfig } from "@/types";

export default function ContentEditor() {
  const { data: settings } = useSiteSettings();
  const [hero, setHero] = useState<HeroConfig>(settings.hero || DEFAULT_SITE_SETTINGS.hero);
  const [stats, setStats] = useState<StatsItemConfig[]>(settings.stats || DEFAULT_SITE_SETTINGS.stats);
  const [vision, setVision] = useState<VisionConfig>(settings.vision || DEFAULT_SITE_SETTINGS.vision);
  const [contact, setContact] = useState<ContactConfig>(settings.contact || DEFAULT_SITE_SETTINGS.contact || {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Ankara",
    headerNotice: "Milli Gençlik Derneği Genel Merkez Portalı",
  });
  const [theme, setTheme] = useState<ThemeConfig>(settings.theme || DEFAULT_SITE_SETTINGS.theme || {
    primaryColor: "#003366",
    secondaryColor: "#0066CC",
  });
  const [state, setState] = useState<SaveState>(IDLE);

  useEffect(() => {
    if (settings.hero) setHero(settings.hero);
    if (settings.stats) setStats(settings.stats);
    if (settings.vision) setVision(settings.vision);
    if (settings.contact) setContact(settings.contact);
    if (settings.theme) setTheme(settings.theme);
  }, [settings]);

  const updateStat = (index: number, patch: Partial<StatsItemConfig>) => {
    setStats((prev) => prev.map((s, idx) => (idx === index ? { ...s, ...patch } : s)));
  };

  const handleSaveAll = async () => {
    setState({ status: "saving" });
    const payload = {
      hero,
      stats,
      vision,
      contact,
      theme,
    };

    const res = await saveSection("content", payload);
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Ayarlar kaydedilemedi." });
    }
  };

  const STAT_ICONS = [Building2, GraduationCap, Users2, CalendarCheck];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Canlı Metinler & Sayaç Yönetimi"
          description="Sitedeki tüm sayıları (50.000+, 81 il vb.), başlıkları, Erbakan alıntısını ve buton metinlerini tek tek düzenleyin."
        />
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={state.status === "saving"}
          className="btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5 shadow-md shrink-0"
        >
          <Save size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </button>
      </div>

      <SaveStatus state={state} />

      {/* 1. İSTATİSTİK SAYAÇLARI KUTULARI (50.000+, 81, 120+, 250+) */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Users2 size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-primary-dark">
            Canlı Sayaç Bandı Ayarları (4 Kutu)
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = STAT_ICONS[index % STAT_ICONS.length];
            return (
              <div
                key={item.id || index}
                className="rounded-xl border border-slate-200 bg-surface p-4 space-y-3"
              >
                <div className="flex items-center justify-between text-secondary">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kutu #{index + 1}
                  </span>
                  <Icon size={18} />
                </div>

                <Field
                  label="Görünen Sayı / Değer"
                  value={item.value}
                  onChange={(v) => updateStat(index, { value: v })}
                />

                <Field
                  label="Başlık / Etiket"
                  value={item.label}
                  onChange={(v) => updateStat(index, { label: v })}
                />

                <Field
                  label="Alt Açıklama"
                  value={item.desc}
                  onChange={(v) => updateStat(index, { desc: v })}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2. HERO / MANŞET METİNLERİ */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Type size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-primary-dark">
            Hero / Manşet Başlıkları ve Buton Metinleri
          </h2>
        </div>

        <div className="space-y-4">
          <Field
            label="Üst Rozet Metni (Genel Merkez Rozeti)"
            value={hero.badge}
            onChange={(v) => setHero({ ...hero, badge: v })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Büyük Başlık 1. Satır"
              value={hero.titleLine1}
              onChange={(v) => setHero({ ...hero, titleLine1: v })}
            />
            <Field
              label="Büyük Başlık 2. Satır (Vurgulu Renk)"
              value={hero.titleLine2}
              onChange={(v) => setHero({ ...hero, titleLine2: v })}
            />
          </div>

          <Field
            label="Ana Tanıtım Açıklama Metni"
            multiline
            value={hero.description}
            onChange={(v) => setHero({ ...hero, description: v })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            <Field
              label="1. Buton Yazısı (Beyaz Buton)"
              value={hero.volunteerBtnText}
              onChange={(v) => setHero({ ...hero, volunteerBtnText: v })}
            />
            <Field
              label="2. Buton Yazısı (Çerçeveli Buton)"
              value={hero.donateBtnText}
              onChange={(v) => setHero({ ...hero, donateBtnText: v })}
            />
          </div>
        </div>
      </Card>

      {/* 3. VİZYON & ERBAKAN ALINTISI BÖLÜMÜ */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Quote size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-primary-dark">
            Vizyon & Erbakan Alıntı Bandı Ayarları
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Üst Etiket (Rozet)"
              value={vision.tag}
              onChange={(v) => setVision({ ...vision, tag: v })}
            />
            <Field
              label="Bölüm Başlığı (Örn: “Önce Ahlak ve Maneviyat”)"
              value={vision.heading}
              onChange={(v) => setVision({ ...vision, heading: v })}
            />
          </div>

          <Field
            label="Alıntı Cümlesi (Özlü Söz)"
            multiline
            value={vision.quote}
            onChange={(v) => setVision({ ...vision, quote: v })}
          />

          <Field
            label="Sözün Sahibi / İmzası"
            value={vision.author}
            onChange={(v) => setVision({ ...vision, author: v })}
          />
        </div>
      </Card>

      {/* 4. KURUMSAL İLETİŞİM & ÜST BAR (TOP BAR) AYARLARI */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Phone size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-primary-dark">
            Kurumsal İletişim & Üst Bar (Top Bar) Bilgileri
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Resmî Telefon Numarası"
            value={contact.phone}
            onChange={(v) => setContact({ ...contact, phone: v })}
          />
          <Field
            label="Resmî İletişim E-Postası"
            value={contact.email}
            onChange={(v) => setContact({ ...contact, email: v })}
          />
          <Field
            label="Genel Merkez Adresi / Şehir"
            value={contact.address}
            onChange={(v) => setContact({ ...contact, address: v })}
          />
          <Field
            label="Üst Duyuru / Portal Sloganı"
            value={contact.headerNotice || ""}
            onChange={(v) => setContact({ ...contact, headerNotice: v })}
          />
        </div>
      </Card>

      {/* 5. GÖRSEL TEMA & KURUMSAL RENK PALETİ */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Palette size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-primary-dark">
            Görsel Tasarım & Kurumsal Renk Paleti
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Field
              label="Ana Kurumsal Renk (Varsayılan: #003366 - Derin Mavi)"
              value={theme.primaryColor || "#003366"}
              onChange={(v) => setTheme({ ...theme, primaryColor: v })}
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">Renk Önizleme:</span>
              <div
                className="h-6 w-12 rounded border border-slate-300 shadow-xs"
                style={{ backgroundColor: theme.primaryColor || "#003366" }}
              />
            </div>
          </div>

          <div>
            <Field
              label="İkincil Aksan Renk (Varsayılan: #0066CC - Parlak Mavi)"
              value={theme.secondaryColor || "#0066CC"}
              onChange={(v) => setTheme({ ...theme, secondaryColor: v })}
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-500">Renk Önizleme:</span>
              <div
                className="h-6 w-12 rounded border border-slate-300 shadow-xs"
                style={{ backgroundColor: theme.secondaryColor || "#0066CC" }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={state.status === "saving"}
          className="btn-primary"
        >
          <Save size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
}
