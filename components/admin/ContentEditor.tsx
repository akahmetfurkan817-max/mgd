"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CalendarCheck,
  FileText,
  GraduationCap,
  Loader2,
  Palette,
  Phone,
  Plus,
  Quote,
  Save,
  Trash2,
  Type,
  Upload,
  Users2,
} from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { uploadMedia } from "@/lib/uploadMedia";
import { DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import type {
  ContactConfig,
  CorporatePdfsConfig,
  ErbakanConfig,
  HeroConfig,
  ManagementCardsConfig,
  StatsItemConfig,
  ThemeConfig,
  VisionConfig,
} from "@/types";

const DEFAULT_ERBAKAN: ErbakanConfig = {
  badge: "Milli Görüş Lideri",
  title: "Prof. Dr. Necmettin Erbakan",
  subtitle: "54. T.C. Başbakanı • Milli Gençlik Davamızın Mimarı ve Rehberi (1926 – 2011)",
  portrait: "/images/erbakan_portrait.png",
  quotes: [
    {
      quote: "Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.",
      context: "Gençlik Şuuru ve Maneviyat Üzerine",
    },
    {
      quote: "Gençlik bir milletin geleceğidir. Gençliğini ihmal edenler, geleceklerini imha ederler.",
      context: "Teşkilatlanma ve Gelecek Vizyonu",
    },
    {
      quote: "Bizim davamızda kimse kendisi için yaşamaz; herkes kardeşi için yaşar.",
      context: "Kardeşlik ve Fedakarlık Ahlakı",
    },
    {
      quote: "İman varsa imkân da vardır; milli görüşçü asla pes etmez.",
      context: "Azim ve Mücadele Ruhu",
    },
  ],
};

export default function ContentEditor() {
  const { data: settings } = useSiteSettings();
  const [hero, setHero] = useState<HeroConfig>(settings.hero || DEFAULT_SITE_SETTINGS.hero);
  const [stats, setStats] = useState<StatsItemConfig[]>(settings.stats || DEFAULT_SITE_SETTINGS.stats);
  const [vision, setVision] = useState<VisionConfig>(settings.vision || DEFAULT_SITE_SETTINGS.vision);
  const [contact, setContact] = useState<ContactConfig>(
    settings.contact ||
      DEFAULT_SITE_SETTINGS.contact || {
        phone: "0 (312) 472 54 54",
        email: "iletisim@milligenclik.org.tr",
        address: "Genel Merkez: Ankara",
        headerNotice: "Milli Gençlik Derneği Genel Merkez Portalı",
        xUrl: "https://x.com/milligenclikmgd",
        instagramUrl: "https://www.instagram.com/milligenclikmgd/",
      },
  );
  const [theme, setTheme] = useState<ThemeConfig>(
    settings.theme || DEFAULT_SITE_SETTINGS.theme || { primaryColor: "#0F2547", secondaryColor: "#1D4ED8" },
  );
  const [erbakan, setErbakan] = useState<ErbakanConfig>({
    ...DEFAULT_ERBAKAN,
    ...(settings.erbakan || {}),
    quotes: settings.erbakan?.quotes?.length ? settings.erbakan.quotes : DEFAULT_ERBAKAN.quotes,
  });
  const [managementCards, setManagementCards] = useState<ManagementCardsConfig>({
    showDormitory: Boolean(settings.managementCards?.showDormitory),
    dormitoryPhoto: settings.managementCards?.dormitoryPhoto || "",
  });
  const [corporatePdfs, setCorporatePdfs] = useState<CorporatePdfsConfig>(settings.corporatePdfs || {});
  const [uploadingPdfKey, setUploadingPdfKey] = useState<keyof CorporatePdfsConfig | null>(null);
  const [state, setState] = useState<SaveState>(IDLE);

  useEffect(() => {
    if (settings.hero) setHero(settings.hero);
    if (settings.stats) setStats(settings.stats);
    if (settings.vision) setVision(settings.vision);
    if (settings.contact) setContact(settings.contact);
    if (settings.theme) setTheme(settings.theme);
    if (settings.managementCards) setManagementCards(settings.managementCards);
    if (settings.corporatePdfs) setCorporatePdfs(settings.corporatePdfs);
    if (settings.erbakan) {
      setErbakan({
        ...DEFAULT_ERBAKAN,
        ...settings.erbakan,
        quotes: settings.erbakan.quotes?.length ? settings.erbakan.quotes : DEFAULT_ERBAKAN.quotes,
      });
    }
  }, [settings]);

  const updateStat = (index: number, patch: Partial<StatsItemConfig>) => {
    setStats((prev) => prev.map((s, idx) => (idx === index ? { ...s, ...patch } : s)));
  };

  const updateQuote = (index: number, field: "quote" | "context", val: string) => {
    setErbakan((prev) => ({
      ...prev,
      quotes: (prev.quotes || []).map((q, idx) => (idx === index ? { ...q, [field]: val } : q)),
    }));
  };

  const addQuote = () => {
    setErbakan((prev) => ({
      ...prev,
      quotes: [...(prev.quotes || []), { quote: "", context: "" }],
    }));
  };

  const removeQuote = (index: number) => {
    setErbakan((prev) => ({
      ...prev,
      quotes: (prev.quotes || []).filter((_, idx) => idx !== index),
    }));
  };

  const handlePdfUpload = async (key: keyof CorporatePdfsConfig, file: File | undefined) => {
    if (!file) return;
    setUploadingPdfKey(key);
    try {
      const data = await uploadMedia(file, { skipOptimize: true });
      if (data.ok && data.url) {
        const nextPdfs = { ...corporatePdfs, [key]: data.url };
        setCorporatePdfs(nextPdfs);
        await saveSection("content", { corporatePdfs: nextPdfs });
        setState({ status: "saved" });
        setTimeout(() => setState(IDLE), 2500);
      } else {
        setState({ status: "error", message: data.error || "PDF yüklenemedi." });
      }
    } catch {
      setState({ status: "error", message: "PDF yükleme sırasında hata oluştu." });
    } finally {
      setUploadingPdfKey(null);
    }
  };

  const handleSaveAll = async () => {
    setState({ status: "saving" });
    const payload = { hero, stats, vision, contact, theme, erbakan, managementCards, corporatePdfs };
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
          title="Canlı Metinler, İletişim & Tema Yönetimi"
          description="Sitedeki tüm başlıkları, sayaçları, iletişim bilgilerini, sosyal medya adreslerini, Erbakan bölümünü ve renk temasını buradan değiştirin."
        />
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={state.status === "saving"}
          className="btn-primary text-xs px-5 py-2.5 shrink-0"
        >
          <Save size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </button>
      </div>

      <SaveStatus state={state} />

      {/* 1. Yönetim Kartı Kontrolleri (Ev ve Yurt Sorumluları) */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-primary-dark">Ana Sayfa Yönetim Kartları — Ev ve Yurt Sorumluları</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              İstediğiniz zaman tek tuşla aktif edip kapatabilir ve dilerseniz kart arka planına fotoğraf ekleyebilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setManagementCards((prev) => ({ ...prev, showDormitory: !prev.showDormitory }))
            }
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              managementCards.showDormitory
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {managementCards.showDormitory ? "Aktif (Görünüyor)" : "Pasif (Gizli) — Aktif Et"}
          </button>
        </div>

        <ImagePickerField
          label="Ev ve Yurt Sorumluları Kart Fotoğrafı (İsteğe Bağlı)"
          recommendedSize="1000 × 650 px (Yatay 3:2)"
          value={managementCards.dormitoryPhoto || ""}
          onChange={(url) => setManagementCards((prev) => ({ ...prev, dormitoryPhoto: url }))}
        />
      </Card>

      {/* 1.5 Kurumsal Belgeler (PDF Yükle — Tüzük, Hakkımızda, Protokoller, Kurumsal Kimlik) */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <FileText size={18} className="text-primary" />
          <div>
            <h2 className="text-base font-bold text-primary-dark">Kurumsal Belgeler (PDF Yükle)</h2>
            <p className="text-xs text-slate-500">
              Buradan PDF yüklediğinizde sitedeki Dernek Tüzüğü, Hakkımızda, Protokoller ve Kurumsal Kimlik otomatik olarak yüklediğiniz PDF ile açılır.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: "tuzuk", label: "Dernek Tüzüğü (PDF)" },
              { key: "hakkimizda", label: "Hakkımızda (PDF)" },
              { key: "protokoller", label: "Protokollerimiz (PDF)" },
              { key: "kurumsalKimlik", label: "Kurumsal Kimlik (PDF)" },
            ] as const
          ).map(({ key, label }) => {
            const url = corporatePdfs[key] || "";
            const isUp = uploadingPdfKey === key;
            return (
              <div key={key} className="rounded-xl border border-slate-200 bg-surface p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink">{label}</span>
                  {url && (
                    <button
                      type="button"
                      onClick={() => setCorporatePdfs((prev) => ({ ...prev, [key]: "" }))}
                      className="text-[11px] font-semibold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Kaldır
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="btn-outline text-xs py-1.5 px-3 cursor-pointer">
                    {isUp ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>{isUp ? "Yükleniyor..." : "PDF Seç"}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        handlePdfUpload(key, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-primary hover:underline truncate"
                    >
                      Yüklü PDF&apos;i Aç →
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">Varsayılan dergi metni aktif</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2. İstatistik Sayaçları */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Users2 size={18} className="text-gold" />
          <h2 className="text-base font-bold text-primary-dark">Canlı Sayaç Bandı (4 Kutu)</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = STAT_ICONS[index % STAT_ICONS.length];
            return (
              <div key={item.id || index} className="rounded-xl border border-slate-200 bg-surface p-4 space-y-3">
                <div className="flex items-center justify-between text-primary">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kutu #{index + 1}
                  </span>
                  <Icon size={17} />
                </div>
                <Field label="Sayı / Değer" value={item.value} onChange={(v) => updateStat(index, { value: v })} />
                <Field label="Başlık" value={item.label} onChange={(v) => updateStat(index, { label: v })} />
                <Field label="Alt Açıklama" value={item.desc} onChange={(v) => updateStat(index, { desc: v })} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 2. Kurumsal Manifesto / Hero */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Type size={18} className="text-gold" />
          <h2 className="text-base font-bold text-primary-dark">Kurumsal Tanıtım / Hero Alanı</h2>
        </div>

        <div className="space-y-4">
          <Field label="Üst Etiket" value={hero.badge} onChange={(v) => setHero({ ...hero, badge: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Başlık 1. Satır" value={hero.titleLine1} onChange={(v) => setHero({ ...hero, titleLine1: v })} />
            <Field label="Başlık 2. Satır" value={hero.titleLine2} onChange={(v) => setHero({ ...hero, titleLine2: v })} />
          </div>
          <Field label="Ana Açıklama" multiline value={hero.description} onChange={(v) => setHero({ ...hero, description: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="1. Buton Yazısı" value={hero.volunteerBtnText} onChange={(v) => setHero({ ...hero, volunteerBtnText: v })} />
            <Field label="2. Buton Yazısı" value={hero.donateBtnText} onChange={(v) => setHero({ ...hero, donateBtnText: v })} />
          </div>
        </div>
      </Card>

      {/* 3. Vizyon & Düstur */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Quote size={18} className="text-gold" />
          <h2 className="text-base font-bold text-primary-dark">Temel Düstur &amp; Vizyon Bandı</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Üst Etiket" value={vision.tag} onChange={(v) => setVision({ ...vision, tag: v })} />
            <Field label="Başlık" value={vision.heading} onChange={(v) => setVision({ ...vision, heading: v })} />
          </div>
          <Field label="Alıntı Metni" multiline value={vision.quote} onChange={(v) => setVision({ ...vision, quote: v })} />
          <Field label="Sözün Sahibi" value={vision.author} onChange={(v) => setVision({ ...vision, author: v })} />
        </div>
      </Card>

      {/* 4. Prof. Dr. Necmettin Erbakan Bölümü */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <Quote size={18} className="text-gold" />
            <h2 className="text-base font-bold text-primary-dark">Prof. Dr. Necmettin Erbakan Özel Bölümü</h2>
          </div>
          <button type="button" onClick={addQuote} className="btn-outline text-xs py-1.5 px-3">
            <Plus size={14} /> Alıntı Ekle
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Üst Etiket"
              value={erbakan.badge || ""}
              onChange={(v) => setErbakan({ ...erbakan, badge: v })}
            />
            <Field
              label="Başlık"
              value={erbakan.title || ""}
              onChange={(v) => setErbakan({ ...erbakan, title: v })}
            />
          </div>
          <Field
            label="Alt Başlık"
            value={erbakan.subtitle || ""}
            onChange={(v) => setErbakan({ ...erbakan, subtitle: v })}
          />
          <ImagePickerField
            label="Portre Fotoğrafı"
            recommendedSize="800 × 1000 px (Dikey Portre 4:5)"
            value={erbakan.portrait || ""}
            onChange={(url) => setErbakan({ ...erbakan, portrait: url })}
          />

          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-700 block">Dönen Özlü Sözler</span>
            {(erbakan.quotes || []).map((q, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-surface p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Alıntı #{idx + 1}</span>
                  {(erbakan.quotes || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuote(idx)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                      title="Alıntıyı Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <Field label="Söz" multiline value={q.quote} onChange={(v) => updateQuote(idx, "quote", v)} />
                <Field label="Bağlam / Konu" value={q.context} onChange={(v) => updateQuote(idx, "context", v)} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 5. İletişim ve Sosyal Medya */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Phone size={18} className="text-gold" />
          <h2 className="text-base font-bold text-primary-dark">İletişim &amp; Sosyal Medya Bilgileri</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Telefon" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
          <Field label="E-Posta" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
          <Field label="Genel Merkez Adresi" value={contact.address} onChange={(v) => setContact({ ...contact, address: v })} />
          <Field label="Üst Duyuru / Slogan" value={contact.headerNotice || ""} onChange={(v) => setContact({ ...contact, headerNotice: v })} />
          <Field
            label="YouTube Kanal URL (Sağ Üst & Footer)"
            value={contact.youtubeUrl || ""}
            placeholder="https://www.youtube.com/@kanaliniz"
            onChange={(v) => setContact({ ...contact, youtubeUrl: v })}
          />
          <Field
            label="X (Twitter) Profil URL"
            value={contact.xUrl || ""}
            placeholder="https://x.com/..."
            onChange={(v) => setContact({ ...contact, xUrl: v })}
          />
          <Field
            label="Instagram Profil URL"
            value={contact.instagramUrl || ""}
            placeholder="https://www.instagram.com/..."
            onChange={(v) => setContact({ ...contact, instagramUrl: v })}
          />
          <Field
            label="Online Kart ile Bağış Linki (Opsiyonel — /bagis sayfasında görünür)"
            value={contact.donateUrl || ""}
            placeholder="https://..."
            onChange={(v) => setContact({ ...contact, donateUrl: v })}
          />
        </div>
      </Card>

      {/* 6. Renk Teması */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Palette size={18} className="text-gold" />
          <h2 className="text-base font-bold text-primary-dark">Kurumsal Renk Paleti (Canlı)</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Field
                label="Ana Kurumsal Renk (Varsayılan: #0F2547)"
                value={theme.primaryColor || "#0F2547"}
                onChange={(v) => setTheme({ ...theme, primaryColor: v })}
              />
            </div>
            <input
              type="color"
              value={theme.primaryColor || "#0F2547"}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Field
                label="İkincil Aksan Renk (Varsayılan: #1D4ED8)"
                value={theme.secondaryColor || "#1D4ED8"}
                onChange={(v) => setTheme({ ...theme, secondaryColor: v })}
              />
            </div>
            <input
              type="color"
              value={theme.secondaryColor || "#1D4ED8"}
              onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
              className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
            />
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
