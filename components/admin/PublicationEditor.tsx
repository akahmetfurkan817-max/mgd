"use client";

import { useState } from "react";
import { BookOpen, Calendar, Download, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { usePublications } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { Publication, PublicationCategory } from "@/types";

const CATEGORIES: PublicationCategory[] = ["Bülten", "Faaliyet Raporu", "Dergi", "Kitapçık"];

const empty = (): Publication => ({
  id: "",
  title: "",
  category: "Bülten",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  coverImage: "",
  pdfUrl: "",
});

export default function PublicationEditor() {
  const { data: publications } = usePublications();
  const [form, setForm] = useState<Publication>(empty());
  const [state, setState] = useState<SaveState>(IDLE);

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
                  {CATEGORIES.map((c) => (
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

            <Field
              label="PDF Belge Bağlantısı (URL)"
              value={form.pdfUrl || ""}
              onChange={(v) => setForm({ ...form, pdfUrl: v })}
            />

            <ImagePickerField
              label="Kapak Fotoğrafı"
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
