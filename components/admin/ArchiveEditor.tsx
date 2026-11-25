"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FolderArchive, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useArchiveItems } from "@/hooks/useSiteData";
import { deleteItem, saveSection } from "@/lib/adminApi";
import { uploadMedia } from "@/lib/uploadMedia";
import type { ArchiveCategory, ArchiveItem } from "@/types";

const CATEGORIES: ArchiveCategory[] = [
  "Konsept",
  "Raporlar",
  "Broşürler",
  "Yayınlar",
  "Kurumsal Medya",
];

const empty = (): ArchiveItem => ({
  id: "",
  title: "",
  category: "Konsept",
  date: new Date().toISOString().slice(0, 10),
  coverImage: "/images/mgd/haydi-milli-genclik.jpg",
  fileUrl: "",
  downloadUrl: "",
  description: "",
});

export default function ArchiveEditor() {
  const { data: items, live } = useArchiveItems();
  const [form, setForm] = useState<ArchiveItem>(empty());
  const [state, setState] = useState<SaveState>(IDLE);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadMedia(file);
      if (data.ok && data.url) {
        setForm((prev) => ({
          ...prev,
          fileUrl: data.url!,
          downloadUrl: prev.downloadUrl || data.url!,
        }));
      } else {
        setState({ status: "error", message: data.error || "Dosya yüklenemedi." });
      }
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.fileUrl.trim()) return;
    setState({ status: "saving" });
    const res = await saveSection("archive", form);
    if (res.ok) {
      setForm(empty());
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error ?? "Kaydedilemedi." });
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu arşiv dosyası kalıcı olarak silinsin mi?")) return;
    const res = await deleteItem("archive", id);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Silinemedi." });
    setTimeout(() => setState(IDLE), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dosya Arşivi Yönetimi"
        description="Konsept, rapor, broşür, yayın ve kurumsal medya dosyalarını ekleyin; Görüntüle ve İndir bağlantılarını yönetin."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Card className="sticky top-6">
            <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
              <FolderArchive size={18} />
              {form.id ? "Arşiv Dosyasını Düzenle" : "Yeni Arşiv Dosyası Ekle"}
            </h2>

            <form onSubmit={save} className="space-y-4">
              <Field
                label="Dosya Başlığı *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="Örn: Erbakan Haftası - 2026"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">Kategori</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ArchiveCategory })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Tarih"
                  type="date"
                  value={form.date}
                  onChange={(v) => setForm({ ...form, date: v })}
                />
              </div>

              <ImagePickerField
                label="Kapak Görseli"
                recommendedSize="1200 × 675 px (Yatay 16:9)"
                value={form.coverImage || ""}
                onChange={(url) => setForm({ ...form, coverImage: url })}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-700">Google Drive / Dosya Linki *</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                  >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Yükle"}</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf,image/*,.zip"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <input
                  type="text"
                  required
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value, downloadUrl: e.target.value })}
                  placeholder="https://drive.google.com/drive/folders/... veya dosya linki"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Karttaki &ldquo;Görüntüle ve İndir&rdquo; butonu doğrudan bu bağlantıya yönlenir.
                </p>
              </div>

              <Field
                label="Kısa Açıklama"
                multiline
                value={form.description || ""}
                onChange={(v) => setForm({ ...form, description: v })}
              />

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={state.status === "saving"}
                  className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                >
                  <Plus size={15} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Arşive Ekle"}
                </button>
                {form.id && (
                  <button type="button" onClick={() => setForm(empty())} className="btn-outline text-xs">
                    Vazgeç
                  </button>
                )}
                <SaveStatus state={state} />
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary">Arşiv Dosyaları ({items.length})</h2>
              {!live && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Örnek Veri
                </span>
              )}
            </div>

            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.coverImage && (
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                        <Image src={item.coverImage} alt="" fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{item.title}</p>
                      <p className="text-xs text-slate-500">
                        {item.category} · {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setForm(item)}
                      className="rounded-lg p-2 text-primary hover:bg-surface"
                      title="Düzenle"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Sil"
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
    </div>
  );
}
