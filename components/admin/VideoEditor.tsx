"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Film, Pencil, Play, Plus, Trash2, Youtube } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useVideos } from "@/hooks/useSiteData";
import { deleteItem, saveSection } from "@/lib/adminApi";
import type { VideoItem } from "@/types";

const CATEGORIES: VideoItem["category"][] = [
  "Genel Başkan Konuşması",
  "Teşkilat & Kongre",
  "Belgesel & Arşiv",
  "Gençlik Buluşması",
];

const PRESET_THUMBNAILS = [
  { label: "Antalya İl", url: "/images/basinda-biz/antalya-il.png" },
  { label: "İstanbul Fetih", url: "/images/basinda-biz/istanbul-fetih.png" },
  { label: "Yayla Şöleni", url: "/images/basinda-biz/antalya-yayla.png" },
  { label: "Yaz Etkinlikleri", url: "/images/basinda-biz/yaz-etkinlikleri.png" },
  { label: "Gaziantep", url: "/images/basinda-biz/gaziantep.png" },
  { label: "Teşkilat", url: "/images/basinda-biz/teskilat.png" },
];

const empty = (): VideoItem => ({
  id: "",
  title: "",
  category: "Genel Başkan Konuşması",
  duration: "12:30",
  date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
  thumbnail: "/images/basinda-biz/antalya-il.png",
  youtubeId: "dQw4w9WgXcQ",
  views: "15.000",
  description: "",
});

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export default function VideoEditor() {
  const { data: videos, live } = useVideos();
  const [form, setForm] = useState<VideoItem>(empty());
  const [youtubeInput, setYoutubeInput] = useState("");
  const [state, setState] = useState<SaveState>(IDLE);

  const handleYoutubeChange = (val: string) => {
    setYoutubeInput(val);
    const yId = extractYoutubeId(val);
    if (yId && yId.length === 11) {
      setForm((prev) => ({
        ...prev,
        youtubeId: yId,
        thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
      }));
    } else {
      setForm((prev) => ({ ...prev, youtubeId: val }));
    }
  };

  const handleSelectPreset = (url: string) => {
    setForm((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleEdit = (v: VideoItem) => {
    setForm(v);
    setYoutubeInput(v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Lütfen video başlığını giriniz.");
      return;
    }

    setState({ status: "saving" });
    const payload: VideoItem = {
      ...form,
      id: form.id || `vid-${Date.now()}`,
    };

    const res = await saveSection("videos", payload);
    if (res.ok) {
      setState({ status: "saved" });
      setForm(empty());
      setYoutubeInput("");
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Hata oluştu." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    setState({ status: "saving" });
    const res = await deleteItem("videos", id);
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Silinemedi." });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Galerisi Yönetimi"
        description="Ana sayfa ve Videolar sayfasındaki video içeriklerini, YouTube bağlantılarını ve kapak fotoğraflarını yönetin."
      />

      <SaveStatus state={state} />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form Kartı */}
        <div className="lg:col-span-5">
          <Card className="sticky top-6">
            <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
              <Film size={18} />
              {form.id ? "Videoyu Düzenle" : "Yeni Video Ekle"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <Field
                label="Video Başlığı"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="Örn: Genel Başkanımız Ahmet Özvatan..."
              />

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as VideoItem["category"] })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Field
                  label="YouTube Video Linki veya Video ID"
                  value={youtubeInput || form.youtubeId || ""}
                  onChange={handleYoutubeChange}
                  placeholder="https://www.youtube.com/watch?v=... veya Video ID"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  YouTube linki yapıştırdığınızda video kapak fotoğrafı otomatik olarak çekilir.
                </p>
              </div>

              {/* Kapak Fotoğrafı */}
              <div>
                <Field
                  label="Kapak Fotoğrafı (Thumbnail URL)"
                  value={form.thumbnail}
                  onChange={(v) => setForm({ ...form, thumbnail: v })}
                  placeholder="/images/... veya https://..."
                />

                {/* Hızlı Seçim Butonları */}
                <div className="mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Hazır Galeriden Seç:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_THUMBNAILS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition ${
                          form.thumbnail === preset.url
                            ? "bg-primary text-white border-primary"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Görsel Önizleme */}
                {form.thumbnail && (
                  <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                    <Image
                      src={form.thumbnail}
                      alt="Kapak Önizleme"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Video Süresi"
                  value={form.duration}
                  onChange={(v) => setForm({ ...form, duration: v })}
                  placeholder="Örn: 14:20"
                />
                <Field
                  label="Yayın Tarihi"
                  value={form.date}
                  onChange={(v) => setForm({ ...form, date: v })}
                  placeholder="Örn: 1 Kasım 2026"
                />
              </div>

              <Field
                label="Açıklama"
                multiline
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                placeholder="Video hakkında kısa açıklama..."
              />

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={state.status === "saving"}
                  className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2 disabled:opacity-60"
                >
                  <Plus size={16} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Videoyu Kaydet"}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(empty());
                      setYoutubeInput("");
                    }}
                    className="btn-outline text-xs px-4 py-2.5"
                  >
                    Vazgeç
                  </button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Videolar Listesi */}
        <div className="lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                Mevcut Videolar ({videos.length})
              </h2>
              {!live && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Örnek Veri Aktif
                </span>
              )}
            </div>

            <div className="space-y-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="group relative flex flex-col sm:flex-row gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-primary/40 hover:shadow-md transition"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                    <Image
                      src={vid.thumbnail}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Detay */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {vid.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{vid.date}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {vid.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      {vid.youtubeId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                        >
                          <Youtube size={14} /> YouTube&apos;da İzle <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(vid)}
                          className="p-1.5 text-slate-500 hover:text-secondary rounded-lg hover:bg-slate-50 transition"
                          title="Düzenle"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(vid.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Sil"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
