"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  Eye,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Card } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useSiteSettings, useSlides } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { uploadMedia } from "@/lib/uploadMedia";
import { HOME_SLIDES, type HomeSlideItem } from "@/data/slides";

const PRESET_BADGES = [
  { label: "BURS DUYURUSU", color: "bg-emerald-700" },
  { label: "MİLLİ GENÇLİK HAREKETİ", color: "bg-primary" },
  { label: "GENÇLİK BULUŞMASI", color: "bg-slate-800" },
  { label: "GENÇLİK ŞÖLENİ", color: "bg-red-700" },
  { label: "EĞİTİM & İRFAN", color: "bg-indigo-700" },
  { label: "ÖNEMLİ DUYURU", color: "bg-amber-700" },
];

const EMPTY_FORM: HomeSlideItem = {
  id: "",
  badge: "MİLLİ GENÇLİK HAREKETİ",
  badgeColor: "bg-primary",
  title: "",
  subtitle: "",
  image: "/images/slider/burs-universite.jpg",
  linkUrl: "/haberler",
  buttonText: "Detayları İncele",
  date: "Yeni Duyuru",
};

export default function SlideEditor() {
  const { data: liveSlides, live } = useSlides();
  const { data: siteSettings } = useSiteSettings();
  const [slides, setSlides] = useState<HomeSlideItem[]>(liveSlides);
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(Boolean(siteSettings.sliderZoomEnabled));
  const [savingZoom, setSavingZoom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<HomeSlideItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<HomeSlideItem>(EMPTY_FORM);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceIndex, setActiveReplaceIndex] = useState<number | null>(null);

  useEffect(() => {
    setZoomEnabled(Boolean(siteSettings.sliderZoomEnabled));
  }, [siteSettings.sliderZoomEnabled]);

  useEffect(() => {
    if (live && liveSlides.length > 0) {
      setSlides(liveSlides);
    }
  }, [live, liveSlides]);

  const notify = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleZoom = async () => {
    const next = !zoomEnabled;
    setZoomEnabled(next);
    setSavingZoom(true);
    try {
      const res = await saveSection("content", { sliderZoomEnabled: next });
      if (res.ok) {
        notify("ok", next ? "Slider yakınlaştırma efekti açıldı." : "Slider yakınlaştırma efekti kapatıldı.");
      } else {
        notify("err", res.error || "Ayar kaydedilemedi.");
      }
    } finally {
      setSavingZoom(false);
    }
  };

  const persistSlides = async (newSlides: HomeSlideItem[]) => {
    setSlides(newSlides);
    setSaving(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("mgd_slides", JSON.stringify(newSlides));
        window.dispatchEvent(new Event("mgd_slides_updated"));
      }
      const res = await saveSection("slides", { list: newSlides });
      if (res.ok) {
        notify("ok", "Slaytlar kaydedildi ve ana sayfada anında yayına alındı.");
      } else {
        notify("err", res.error || "Slaytlar sunucuya kaydedilemedi.");
      }
    } catch {
      notify("err", "Kaydetme sırasında beklenmedik bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const replaceSlideImageFile = async (targetIdx: number, file: File) => {
    setUploadingIndex(targetIdx);
    try {
      const data = await uploadMedia(file);
      if (data.ok && data.url) {
        const next = slides.map((s, idx) => (idx === targetIdx ? { ...s, image: data.url! } : s));
        await persistSlides(next);
      } else {
        notify("err", data.error || "Görsel yüklenemedi.");
      }
    } catch {
      notify("err", "Fotoğraf yükleme başarısız oldu.");
    } finally {
      setUploadingIndex(null);
      setActiveReplaceIndex(null);
    }
  };

  const handleQuickReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeReplaceIndex === null) return;
    await replaceSlideImageFile(activeReplaceIndex, file);
    if (e.target) e.target.value = "";
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setForm({ ...EMPTY_FORM, id: `slide-${Date.now()}` });
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...slides[index] });
    setModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    if (slides.length <= 1) {
      notify("err", "En az bir adet manşet slaytı bulunmalıdır.");
      return;
    }
    const label = slides[index].title || `#${index + 1}`;
    if (!window.confirm(`"${label}" slaytını silmek istediğinize emin misiniz?`)) return;
    const next = slides.filter((_, i) => i !== index);
    await persistSlides(next);
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const tmp = next[target];
    next[target] = next[index];
    next[index] = tmp;
    await persistSlides(next);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image.trim()) {
      notify("err", "Slayt görseli zorunludur.");
      return;
    }
    const next =
      editingIndex !== null
        ? slides.map((s, idx) => (idx === editingIndex ? { ...form } : s))
        : [{ ...form, id: form.id || `slide-${Date.now()}` }, ...slides];

    setModalOpen(false);
    await persistSlides(next);
  };

  const handleResetToDefault = async () => {
    if (!window.confirm("Tüm slaytları varsayılan orijinal listeye sıfırlamak istiyor musunuz?")) return;
    await persistSlides(HOME_SLIDES);
  };

  return (
    <div className="space-y-6">
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQuickReplaceImage}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2.5">
              <Layers className="text-gold" /> Manşet Slaytları &amp; Afişler
            </h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {slides.length} Slayt
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
              Önerilen: 1920 × 800 px
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Ana sayfada kaydırılabilir manşet slaytlarını ekleyin, sıralayın veya fotoğrafı doğrudan kartın üzerine sürükleyip değiştirin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleZoom}
            disabled={savingZoom}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
              zoomEnabled
                ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${zoomEnabled ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            <span>Yakınlaştırma: {zoomEnabled ? "Açık" : "Kapalı"}</span>
          </button>
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={saving}
            className="btn-outline text-xs py-2"
          >
            <RefreshCw size={14} /> Varsayılana Dön
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={saving}
            className="btn-primary text-xs sm:text-sm py-2"
          >
            <Plus size={16} /> Yeni Slayt Ekle
          </button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span className="flex items-center gap-2">
            {toast.type === "ok" ? <Check size={16} /> : <AlertCircle size={16} />} {toast.text}
          </span>
          <button type="button" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((item, index) => (
          <Card
            key={item.id || index}
            className={`p-4 sm:p-5 transition ${
              dragIndex === index
                ? "border-primary ring-2 ring-primary/25 bg-primary/[0.02]"
                : "hover:border-slate-300"
            }`}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragIndex(index);
              }}
              onDragLeave={() => setDragIndex(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragIndex(null);
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith("image/")) {
                  replaceSlideImageFile(index, f);
                }
              }}
              className="flex flex-col lg:flex-row gap-5 items-start lg:items-center"
            >
              {/* Sıralama */}
              <div className="flex lg:flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0 || saving}
                  onClick={() => handleMove(index, -1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30"
                  title="Yukarı Taşı"
                >
                  <ArrowUp size={16} />
                </button>
                <span className="w-7 h-7 rounded-full bg-ivory border border-slate-200 text-ink font-mono font-bold text-xs flex items-center justify-center">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  disabled={index === slides.length - 1 || saving}
                  onClick={() => handleMove(index, 1)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30"
                  title="Aşağı Taşı"
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="relative w-full sm:w-56 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                <Image
                  src={item.image || "/images/slider/burs-universite.jpg"}
                  alt={item.title || "Slayt"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs gap-1.5 z-20">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Optimize edilip yükleniyor…</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplaceIndex(index);
                      cardFileInputRef.current?.click();
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-white text-ink text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gold hover:text-white transition"
                  >
                    <Camera size={13} /> Fotoğrafı Değiştir
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSlide(item)}
                    className="w-full py-1.5 px-2 rounded-lg bg-white/90 text-ink text-xs font-bold flex items-center justify-center gap-1 hover:bg-white transition"
                  >
                    <Eye size={13} /> Önizle
                  </button>
                </div>
              </div>

              {/* Detaylar */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                    {item.badge || "GÖRSEL AFİŞ"}
                  </span>
                  {item.date && <span className="text-xs text-slate-400">• {item.date}</span>}
                </div>
                <h3 className="font-bold text-ink text-base leading-snug line-clamp-1">
                  {item.title || "(Başlıksız — Sadece Afiş Görseli)"}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.subtitle}</p>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {item.buttonText && <span className="font-semibold text-primary">Buton: {item.buttonText}</span>}
                  {item.linkUrl && (
                    <>
                      {item.buttonText && <span>•</span>}
                      <span className="font-mono text-[11px] truncate max-w-xs">{item.linkUrl}</span>
                    </>
                  )}
                </div>
              </div>

              {/* İşlemler */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReplaceIndex(index);
                    cardFileInputRef.current?.click();
                  }}
                  disabled={uploadingIndex === index}
                  className="btn-outline text-xs px-3 py-1.5"
                >
                  <Camera size={13} /> Fotoğraf
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(index)}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <Pencil size={13} /> Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                  title="Slaytı Sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Düzenle / Ekle Modalı (Canlı Önizlemeli) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-ivory">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Layers className="text-gold" size={18} />
                {editingIndex !== null ? "Slaytı Düzenle" : "Yeni Manşet Slaytı Ekle"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-200/60"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Canlı Mini Önizleme */}
              <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-primary-dark">
                {form.image && (
                  <Image src={form.image} alt={form.title || "Önizleme"} fill className="object-cover" unoptimized />
                )}
                {(form.title || form.subtitle || form.buttonText) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06101F]/90 via-[#081529]/65 to-transparent" />
                    <div className="relative z-10 flex h-full flex-col justify-center p-5 max-w-md text-white">
                      {form.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light">
                          {form.badge}
                        </span>
                      )}
                      {form.title && (
                        <h3 className="mt-1 font-serif text-lg font-bold leading-snug line-clamp-2">{form.title}</h3>
                      )}
                      {form.subtitle && (
                        <p className="mt-1 text-[11px] text-slate-200 line-clamp-2">{form.subtitle}</p>
                      )}
                      {form.buttonText && (
                        <span className="mt-2.5 inline-flex w-fit items-center rounded-md bg-white px-3 py-1 text-[10px] font-bold text-primary-dark">
                          {form.buttonText}
                        </span>
                      )}
                    </div>
                  </>
                )}
                <span className="absolute top-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Canlı Önizleme
                </span>
              </div>

              <ImagePickerField
                label="Slayt Arka Plan Fotoğrafı *"
                recommendedSize="1920 × 800 px (Yatay Geniş)"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Slayt Başlığı (Opsiyonel)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Boş bırakılırsa sadece görsel gösterilir"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Açıklama / Alt Metin (Opsiyonel)</label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="İsteğe bağlı açıklama metni"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Üst Etiket</label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold uppercase focus:border-primary focus:outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {PRESET_BADGES.map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => setForm({ ...form, badge: b.label, badgeColor: b.color })}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 hover:bg-primary hover:text-white text-slate-700 transition"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tarih / Not</label>
                  <input
                    type="text"
                    value={form.date || ""}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Örn: 25 Kasım 2026 veya Aktif Başvuru"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Buton Metni (Opsiyonel)</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="Boş bırakılırsa buton gizlenir"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hedef Bağlantı (Opsiyonel)</label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    placeholder="/kurumsal veya /haberler"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline text-xs">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-xs">
                  {editingIndex !== null ? "Değişiklikleri Kaydet" : "Slaytı Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Önizleme Modalı */}
      {previewSlide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewSlide(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-primary-dark rounded-2xl overflow-hidden border border-white/15 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewSlide(null)}
              className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90"
            >
              <X size={20} />
            </button>
            <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center p-6 sm:p-12 overflow-hidden">
              <Image src={previewSlide.image} alt={previewSlide.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06101F]/95 via-[#081529]/75 to-transparent" />
              <div className="relative z-10 max-w-xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">
                  {previewSlide.badge}
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {previewSlide.title}
                </h2>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed">{previewSlide.subtitle}</p>
                {previewSlide.buttonText && (
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-primary-dark font-bold text-xs">
                      {previewSlide.buttonText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
