"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useNews } from "@/hooks/useSiteData";
import { deleteNews, saveSection } from "@/lib/adminApi";
import type { NewsCategory, NewsItem } from "@/types";

const CATEGORIES: NewsCategory[] = ["Genel Merkez", "Üniversite", "Basın Açıklaması"];
const PRESET_NEWS_IMAGES = [
  { label: "Antalya İl", url: "/images/basinda-biz/antalya-il.png" },
  { label: "İstanbul Fetih", url: "/images/basinda-biz/istanbul-fetih.png" },
  { label: "Yaz Etkinlikleri", url: "/images/basinda-biz/yaz-etkinlikleri.png" },
  { label: "Gaziantep", url: "/images/basinda-biz/gaziantep.png" },
  { label: "Teşkilat", url: "/images/basinda-biz/teskilat.png" },
];

const empty = (): NewsItem => ({
  id: "",
  title: "",
  summary: "",
  category: "Genel Merkez",
  date: new Date().toISOString().slice(0, 10),
  image: "/images/basinda-biz/antalya-il.png",
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
    } else setState({ status: "error", message: res.error ?? "Hata" });
  };

  const remove = async (id: string) => {
    if (!window.confirm("Bu haber silinsin mi?")) return;
    const res = await deleteNews(id);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
    setTimeout(() => setState(IDLE), 2500);
  };

  return (
    <div>
      <PageHeader title="Haber Ekle / Düzenle" description="Haber, basın açıklamaları ve duyuruların kapak fotoğraflarını yönetin." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-primary">{form.id ? "Haberi Düzenle" : "Yeni Haber"}</h2>
          <div className="space-y-3">
            <Field label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="Özet" multiline value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} />
            
            {/* Kapak Fotoğrafı */}
            <div>
              <Field
                label="Kapak Fotoğrafı (URL)"
                value={form.image || ""}
                onChange={(v) => setForm({ ...form, image: v })}
                placeholder="/images/... veya https://..."
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 w-full">Örnek Görsellerden Seç:</span>
                {PRESET_NEWS_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setForm({ ...form, image: preset.url })}
                    className={`text-[11px] px-2 py-0.5 rounded border transition ${
                      form.image === preset.url
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

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
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" onClick={save} disabled={state.status === "saving"} className="btn-primary disabled:opacity-60">
                <Plus size={16} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Kaydet"}
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
