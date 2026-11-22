"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useNews } from "@/hooks/useSiteData";
import { deleteNews, saveSection } from "@/lib/adminApi";
import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: NewsCategory[] = [
  "Genel Merkez",
  "Üniversite",
  "Basın Açıklaması",
  "Duyurular & Burs",
  "Programlar",
  "Teşkilattan Haberler",
];

const empty = (): NewsItem => ({
  id: "",
  title: "",
  summary: "",
  category: "Genel Merkez",
  date: new Date().toISOString().slice(0, 10),
  image: "/images/basinda-biz/teskilat.png",
});

export default function NewsEditor() {
  const { data: items, live } = useNews();
  const [form, setForm] = useState<NewsItem>(empty());
  const [state, setState] = useState<SaveState>(IDLE);

  const save = async () => {
    if (!form.title.trim()) return;
    setState({ status: "saving" });
    const res = await saveSection("news", form);
    if (res.ok) {
      setForm(empty());
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error ?? "Hata" });
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu haber kalıcı olarak silinsin mi?")) return;
    const res = await deleteNews(id);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
    setTimeout(() => setState(IDLE), 2500);
  };

  return (
    <div>
      <PageHeader
        title="Haberler & Duyurular"
        description="Haber, burs duyurusu ve basın açıklamalarını ekleyin, kapak fotoğraflarını değiştirin veya silin."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold text-primary">{form.id ? "Haberi Düzenle" : "Yeni Haber Ekle"}</h2>
          <div className="space-y-4">
            <Field label="Başlık *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="Özet *" multiline value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />

            <ImagePickerField
              label="Kapak Fotoğrafı"
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">Kategori</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <Field label="Tarih" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={save}
                disabled={state.status === "saving"}
                className="btn-primary text-xs disabled:opacity-60"
              >
                <Plus size={15} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Yayınla"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(empty())} className="btn-outline text-xs">
                  Vazgeç
                </button>
              )}
              <SaveStatus state={state} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-bold text-primary">Yayınlanan Haberler ({items.length})</h2>
          {!live && <p className="mb-3 text-xs text-amber-700">Örnek veri gösteriliyor (Firestore bağlı değil).</p>}
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {n.image && (
                    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
                      <Image src={n.image} alt="" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{n.title}</p>
                    <p className="text-xs text-slate-500">
                      {n.category} · {n.date}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label="Düzenle"
                    onClick={() => setForm(n)}
                    className="rounded-lg p-2 text-primary hover:bg-surface"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Sil"
                    onClick={() => remove(n.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
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
