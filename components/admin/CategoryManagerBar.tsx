"use client";

import { useState } from "react";
import { Plus, Tag, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { SiteCategoriesConfig } from "@/types";

type ListKey = "news" | "videos" | "archive" | "publications" | "commissions";

interface CategoryManagerBarProps {
  listKey: ListKey;
  title?: string;
  placeholder?: string;
  onChanged?: (next: string[]) => void;
}

export default function CategoryManagerBar({
  listKey,
  title = "Kategorileri Yönet",
  placeholder = "Yeni kategori adı...",
  onChanged,
}: CategoryManagerBarProps) {
  const { data: settings } = useSiteSettings();
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentList: string[] = settings.categories?.[listKey] || [];

  const persist = async (nextList: string[]) => {
    setSaving(true);
    setError(null);
    const nextCategories: SiteCategoriesConfig = {
      ...settings.categories,
      [listKey]: nextList,
    };
    const res = await saveSection("content", { categories: nextCategories });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Kategoriler kaydedilemedi.");
      return false;
    }
    onChanged?.(nextList);
    return true;
  };

  const handleAdd = async () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (currentList.some((c) => c.toLocaleLowerCase("tr") === trimmed.toLocaleLowerCase("tr"))) {
      setError("Bu kategori zaten mevcut.");
      return;
    }
    const ok = await persist([...currentList, trimmed]);
    if (ok) setNewCat("");
  };

  const handleRemove = async (cat: string) => {
    if (currentList.length <= 1) {
      setError("En az bir kategori kalmalıdır.");
      return;
    }
    await persist(currentList.filter((c) => c !== cat));
  };

  return (
    <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-dark">
          <Tag size={14} className="text-secondary" />
          {title} ({currentList.length})
        </span>
        {saving && <span className="text-[11px] font-semibold text-secondary">Kaydediliyor...</span>}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {currentList.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xs"
          >
            <span>{cat}</span>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleRemove(cat)}
              aria-label={`${cat} kategorisini kaldır`}
              className="rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newCat}
          onChange={(e) => {
            setNewCat(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          disabled={saving || !newCat.trim()}
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-secondary transition disabled:opacity-50"
        >
          <Plus size={13} /> Ekle
        </button>
      </div>

      {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
