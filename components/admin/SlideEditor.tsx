"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Card } from "@/components/admin/ui";
import { useSlides } from "@/hooks/useSiteData";
import { HOME_SLIDES, type HomeSlideItem } from "@/data/slides";

const PRESET_BADGES = [
  { label: "BURS DUYURUSU", color: "bg-emerald-600" },
  { label: "MİLLİ GENÇLİK HAREKETİ", color: "bg-blue-600" },
  { label: "GENÇLİK BULUŞMASI", color: "bg-emerald-700" },
  { label: "GENÇLİK ŞÖLENİ", color: "bg-red-600" },
  { label: "EĞİTİM & İRFAN", color: "bg-indigo-600" },
  { label: "ÖNEMLİ DUYURU", color: "bg-amber-600" },
];

const PRESET_IMAGES = [
  { name: "Yeniden Milli Gençlik", path: "/images/slider/yeniden-milli-genclik.jpg" },
  { name: "Üniversite & Lisans Bursu", path: "/images/slider/burs-universite.jpg" },
  { name: "Haydi Milli Gençlik", path: "/images/slider/haydi-milli-genclik.jpg" },
  { name: "Gençlik Şöleni", path: "/images/slider/genclik-soleni.jpg" },
  { name: "Okuma Halkaları & İrfan", path: "/images/slider/okuma-halkalari.jpg" },
  { name: "Necmettin Erbakan Afişi", path: "/images/erbakan_banner.png" },
  { name: "Teşkilat Buluşması", path: "/images/basinda-biz/teskilat.png" },
];

const EMPTY_FORM: HomeSlideItem = {
  id: "",
  badge: "BURS DUYURUSU",
  badgeColor: "bg-emerald-600",
  title: "",
  subtitle: "",
  image: "/images/slider/burs-universite.jpg",
  linkUrl: "/haberler#burs-basvuru",
  buttonText: "Burs Başvuru Formuna Git →",
  date: "Aktif Başvuru",
};

export default function SlideEditor() {
  const { data: currentSlides } = useSlides();
  const [slides, setSlides] = useState<HomeSlideItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("mgd_slides");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return HOME_SLIDES;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<HomeSlideItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<HomeSlideItem>(EMPTY_FORM);
  const [savedToast, setSavedToast] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [modalUploading, setModalUploading] = useState(false);

  // Dosya seçici ref'leri
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [activeReplaceIndex, setActiveReplaceIndex] = useState<number | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const saveSlides = (newSlides: HomeSlideItem[]) => {
    setSlides(newSlides);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mgd_slides", JSON.stringify(newSlides));
        window.dispatchEvent(new Event("mgd_slides_updated"));
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3000);
      } catch (e) {
        console.error("Slayt kaydedilemedi:", e);
      }
    }
  };

  // Bilgisayardan fotoğraf yükleme işlemi
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, isModal: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isModal) {
      setModalUploading(true);
    } else if (activeReplaceIndex !== null) {
      setUploadingIndex(activeReplaceIndex);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.ok && data.url) {
        if (isModal) {
          setForm((prev) => ({ ...prev, image: data.url }));
        } else if (activeReplaceIndex !== null) {
          const next = slides.map((s, idx) =>
            idx === activeReplaceIndex ? { ...s, image: data.url } : s
          );
          saveSlides(next);
        }
      } else {
        alert(data.error || "Görsel yüklenirken bir sorun oluştu.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Fotoğraf yükleme başarısız oldu.");
    } finally {
      setModalUploading(false);
      setUploadingIndex(null);
      setActiveReplaceIndex(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setForm({
      ...EMPTY_FORM,
      id: `slide-${Date.now()}`,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setForm({ ...slides[index] });
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    if (slides.length <= 1) {
      alert("En az bir adet manşet slaytı bulunmalıdır.");
      return;
    }
    if (confirm(`"${slides[index].title}" başlıklı slaytı silmek istediğinize emin misiniz?`)) {
      const next = slides.filter((_, i) => i !== index);
      saveSlides(next);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...slides];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    saveSlides(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const next = [...slides];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    saveSlides(next);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Lütfen bir slayt başlığı girin.");
      return;
    }
    if (!form.image.trim()) {
      alert("Lütfen bir görsel seçin veya dosya yolu girin.");
      return;
    }

    let next: HomeSlideItem[];
    if (editingIndex !== null) {
      next = slides.map((s, idx) => (idx === editingIndex ? { ...form } : s));
    } else {
      next = [{ ...form, id: form.id || `slide-${Date.now()}` }, ...slides];
    }

    saveSlides(next);
    setModalOpen(false);
  };

  const handleResetToDefault = () => {
    if (confirm("Tüm slaytları varsayılan orijinal listeye sıfırlamak istiyor musunuz?")) {
      saveSlides(HOME_SLIDES);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gizli Dosya Girişleri */}
      <input
        ref={cardFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUploadFile(e, false)}
      />
      <input
        ref={modalFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUploadFile(e, true)}
      />

      {/* Üst Başlık & Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2.5">
            <Layers className="text-secondary" /> Manşet Slaytları & Afişler
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ana sayfa manşetinde (Hero altında) dönen afişleri ve burs duyurularını buradan yönetin. İstediğiniz slaytın fotoğrafını doğrudan bilgisayarınızdan değiştirebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition"
            title="Varsayılan slaytlara dön"
          >
            <RefreshCw size={14} /> Varsayılana Dön
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus size={16} /> Yeni Slayt Ekle
          </button>
        </div>
      </div>

      {/* Kaydedildi Bildirimi */}
      {savedToast && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-fadeIn">
          <Check size={18} className="text-emerald-600 shrink-0" />
          <span>Slaytlar başarıyla güncellendi! Ana sayfadaki manşet anında yenilendi.</span>
        </div>
      )}

      {/* Slaytlar Listesi */}
      <div className="space-y-4">
        {slides.map((item, index) => (
          <Card key={item.id || index} className="p-4 sm:p-5 hover:border-slate-300 transition">
            <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
              {/* Sıralama & Sıra Numarası */}
              <div className="flex lg:flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Yukarı Taşı"
                >
                  <ArrowUp size={16} />
                </button>
                <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <button
                  type="button"
                  disabled={index === slides.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Aşağı Taşı"
                >
                  <ArrowDown size={16} />
                </button>
              </div>

              {/* Görsel Önizleme Thumbnail ve Fotoğrafı Değiştir Butonu */}
              <div className="relative w-full sm:w-52 h-32 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 group">
                <Image
                  src={item.image || "/images/slider/burs-universite.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {uploadingIndex === index && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs gap-1 z-20">
                    <Loader2 size={20} className="animate-spin text-secondary" />
                    <span>Yükleniyor…</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplaceIndex(index);
                      cardFileInputRef.current?.click();
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-secondary text-primary-dark text-xs font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 transition"
                  >
                    <Camera size={13} /> Fotoğrafı Değiştir
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSlide(item)}
                    className="w-full py-1.5 px-2 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-1 shadow transition"
                  >
                    <Eye size={13} /> Önizle
                  </button>
                </div>
              </div>

              {/* Slayt Bilgileri */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold text-white uppercase tracking-wider ${
                      item.badgeColor || "bg-blue-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                  {item.date && (
                    <span className="text-xs text-slate-500 font-medium">• {item.date}</span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="font-semibold text-primary flex items-center gap-1">
                    Buton: {item.buttonText}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1 truncate max-w-xs">
                    Link: {item.linkUrl}
                  </span>
                </div>
              </div>

              {/* İşlem Butonları */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReplaceIndex(index);
                    cardFileInputRef.current?.click();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 font-semibold text-xs transition"
                  title="Bu slaytın fotoğrafını değiştir"
                >
                  <Camera size={14} className="text-amber-700" /> Fotoğrafı Değiştir
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(index)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition"
                >
                  <Pencil size={14} /> Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                  title="Slaytı Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ==================== DÜZENLE / EKLE MODAL ==================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="text-secondary" size={20} />
                {editingIndex !== null ? "Slaytı Düzenle" : "Yeni Manşet Slaytı Ekle"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Slayt Başlığı */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slayt Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Örn: 2026-2027 Lisans & Yükseköğretim Burs Başvuruları Açıldı"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-secondary focus:outline-none"
                />
              </div>

              {/* Alt Başlık / Açıklama */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Açıklama / Metin *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Genel Merkezimiz tarafından yürütülen eğitim desteği ve burs başvuruları başlamıştır..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-secondary focus:outline-none"
                />
              </div>

              {/* Rozet ve Rengi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rozet Başlığı (Üst Etiket)
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="Örn: BURS DUYURUSU"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-secondary focus:outline-none font-bold uppercase"
                  />
                  {/* Hızlı Rozet Seçenekleri */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PRESET_BADGES.map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => setForm({ ...form, badge: b.label, badgeColor: b.color })}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${b.color} opacity-85 hover:opacity-100 transition`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rozet Rengi
                  </label>
                  <select
                    value={form.badgeColor || "bg-emerald-600"}
                    onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-secondary focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="bg-emerald-600">Yeşil (Burs / Başarı)</option>
                    <option value="bg-blue-600">Kurumsal Mavi (Hareket / Teşkilat)</option>
                    <option value="bg-red-600">Kırmızı (Şölen / Zirve)</option>
                    <option value="bg-indigo-600">İndigo Mor (Eğitim / Maarif)</option>
                    <option value="bg-amber-600">Turuncu / Amber (Duyuru)</option>
                    <option value="bg-slate-800">Koyu Füme</option>
                  </select>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tarih / Etiket Notu
                    </label>
                    <input
                      type="text"
                      value={form.date || ""}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="Örn: 18 Kasım 2026 veya Aktif Başvuru"
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:border-secondary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Görsel Yolu & Dosya Yükleme */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Afiş / Görsel Dosya Yolu *
                  </label>
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    disabled={modalUploading}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition"
                  >
                    {modalUploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Yükleniyor…
                      </>
                    ) : (
                      <>
                        <Upload size={13} /> Bilgisayardan Fotoğraf Yükle
                      </>
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/slider/burs-universite.jpg veya /uploads/..."
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-800 focus:border-secondary focus:outline-none"
                  />
                  {form.image && (
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <Image src={form.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Hızlı Fotoğraf Seçici */}
                <div className="mt-2.5">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">
                    Veya Hazır Slayt Fotoğraflarından Seç:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setForm({ ...form, image: img.path })}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition ${
                          form.image === img.path
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                    <Link
                      href="/admin/media"
                      target="_blank"
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 transition flex items-center gap-1"
                    >
                      Tüm Fotoğraf Galerisi <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Buton Metni ve Hedef Bağlantı */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buton Metni *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="Örn: Başvuru Formuna Git →"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hedef URL / Sayfa Linki *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.linkUrl}
                    onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                    placeholder="Örn: /haberler#burs-basvuru veya /kurumsal"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Butonları */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow transition active:scale-95"
                >
                  {editingIndex !== null ? "Değişiklikleri Kaydet" : "Slaytı Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAM BOYUT ÖNİZLEME MODAL ==================== */}
      {previewSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl text-white">
            <div className="absolute top-4 right-4 z-40">
              <button
                type="button"
                onClick={() => setPreviewSlide(null)}
                className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slayt Önizleme Gövdesi */}
            <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center p-6 sm:p-12 overflow-hidden">
              <Image
                src={previewSlide.image || "/images/slider/burs-universite.jpg"}
                alt={previewSlide.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

              <div className="relative z-10 max-w-xl">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-bold text-white uppercase tracking-wider mb-3 ${
                    previewSlide.badgeColor || "bg-emerald-600"
                  }`}
                >
                  {previewSlide.badge}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                  {previewSlide.title}
                </h2>

                <p className="mt-3 text-sm text-slate-200 line-clamp-3 leading-relaxed">
                  {previewSlide.subtitle}
                </p>

                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-primary-dark font-extrabold text-sm shadow-lg">
                    {previewSlide.buttonText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
