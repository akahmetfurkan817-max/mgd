"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BookOpen, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import CategoryManagerBar from "@/components/admin/CategoryManagerBar";
import { usePublications, useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { uploadMedia } from "@/lib/uploadMedia";
import type { Publication, PublicationCategory } from "@/types";

const empty = (defaultCat = "Bülten"): Publication => ({
  id: "",
  title: "",
  category: defaultCat,
  date: new Date().toISOString().slice(0, 10),
  description: "",
  coverImage: "",
  pdfUrl: "",
});

export default function PublicationEditor() {
  const { data: publications } = usePublications();
  const { data: settings } = useSiteSettings();
  const categories = settings.categories?.publications || ["Bülten"];
  const [form, setForm] = useState<Publication>(() => empty(categories[0]));
  const [state, setState] = useState<SaveState>(IDLE);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const data = await uploadMedia(file, { skipOptimize: true });
      if (data.ok && data.url) {
        setForm((prev) => ({ ...prev, pdfUrl: data.url! }));
      } else {
        setState({ status: "error", message: data.error || "PDF yüklenemedi." });
      }
    } finally {
      setUploadingPdf(false);
      if (e.target) e.target.value = "";
    }
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setState({ status: "saving" });

    const payload = {
      ...form,
      id: form.id || `pub-${Date.now()}`,
    };

    const res = await saveSection("publications", payload);
    if (res.ok) {
      setForm(empty());
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2000);
    } else {
      setState({ status: "error", message: res.error || "Hata" });
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu yayını silmek istediğinize emin misiniz?")) return;
    setState({ status: "saving" });

    const res = await fetch(`/api/admin/publications?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2000);
    } else {
      setState({ status: "error", message: "Silme işlemi başarısız." });
    }
  };

  return (
    <div>
      <PageHeader
        title="Yayınlar & E-Kütüphane Yönetimi"
        description="Teşkilat bültenleri, faaliyet raporları ve dergileri ekleyin veya düzenleyin."
      />

      <div className="mb-6">
        <CategoryManagerBar listKey="publications" title="Yayın Kategorileri" placeholder="Yeni yayın kategorisi..." />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form Kartı */}
        <Card>
          <h2 className="mb-4 font-bold text-primary-dark">
            {form.id ? "Yayını Düzenle" : "Yeni Yayın Ekle"}
          </h2>
          <div className="space-y-3">
            <Field
              label="Yayın Başlığı"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">Kategori</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as PublicationCategory })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Yayın Tarihi"
                type="date"
                value={form.date}
                onChange={(v) => setForm({ ...form, date: v })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-600">PDF Belge Bağlantısı (URL)</label>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploadingPdf}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition disabled:opacity-50"
                >
                  {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span>{uploadingPdf ? "Yükleniyor..." : "PDF Yükle"}</span>
                </button>
              </div>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
              <input
                type="text"
                value={form.pdfUrl || ""}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder="https://... veya yukarıdan PDF yükleyin"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
              />
            </div>

            <ImagePickerField
              label="Kapak Fotoğrafı"
              recommendedSize="600 × 850 px (Dikey Kapak 3:4)"
              value={form.coverImage || ""}
              onChange={(url) => setForm({ ...form, coverImage: url })}
            />

            <Field
              label="Açıklama / İçerik Özeti"
              multiline
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={save}
                disabled={state.status === "saving"}
                className="btn-primary disabled:opacity-60"
              >
                <Plus size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Kaydet"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm(empty())}
                  className="btn-outline"
                >
                  Vazgeç
                </button>
              )}
              <SaveStatus state={state} />
            </div>
          </div>
        </Card>

        {/* Liste Kartı */}
        <Card>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="font-bold text-primary-dark">
              Mevcut Yayınlar ({publications.length})
            </h2>
            <BookOpen size={18} className="text-secondary" />
          </div>

          <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
            {publications.map((pub) => (
              <li key={pub.id} className="flex items-start justify-between gap-3 py-3.5">
                {pub.coverImage ? (
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                    <Image src={pub.coverImage} alt={pub.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-primary-dark text-gold-light">
                    <BookOpen size={18} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                      {pub.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(pub.date).toLocaleDateString("tr-TR", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 font-bold text-sm text-ink truncate">{pub.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {pub.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1 pt-1">
                  <button
                    type="button"
                    aria-label="Düzenle"
                    onClick={() => setForm(pub)}
                    className="rounded p-1.5 text-secondary hover:bg-surface"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Sil"
                    onClick={() => remove(pub.id)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
