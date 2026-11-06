"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useNews } from "@/hooks/useSiteData";
import { deleteNews, saveSection } from "@/lib/adminApi";
import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: NewsCategory[] = ["Genel Merkez", "Üniversite", "Basın Açıklaması"];
const empty = (): NewsItem => ({
  id: "",
  title: "",
  summary: "",
  category: "Genel Merkez",
  date: new Date().toISOString().slice(0, 10),
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
    } else setState({ status: "error", message: res.error ?? "Hata" });
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu haber silinsin mi?")) return;
    const res = await deleteNews(id);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
  };

  return (
    <div>
      <PageHeader title="Haber Ekle / Düzenle" description="Haber ve duyuruları yönetin." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-primary">{form.id ? "Haberi Düzenle" : "Yeni Haber"}</h2>
          <div className="space-y-3">
            <Field label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="Özet" multiline value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Kategori</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <Field label="Tarih" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={save} disabled={state.status === "saving"} className="btn-primary disabled:opacity-60">
                <Plus size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Kaydet"}
              </button>
              {form.id && <button type="button" onClick={() => setForm(empty())} className="btn-outline">Vazgeç</button>}
              <SaveStatus state={state} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-primary">Haberler ({items.length})</h2>
          {!live && <p className="mb-3 text-xs text-amber-700">Örnek veri gösteriliyor (Firestore bağlı değil).</p>}
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.category} · {n.date}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" aria-label="Düzenle" onClick={() => setForm(n)} className="rounded p-2 text-secondary hover:bg-surface"><Pencil size={16} /></button>
                  <button type="button" aria-label="Sil" onClick={() => remove(n.id)} className="rounded p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
