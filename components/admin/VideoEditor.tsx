"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, Film, Pencil, Play, Plus, Trash2, Youtube } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useVideos } from "@/hooks/useSiteData";
import { deleteItem, saveSection } from "@/lib/adminApi";
import type { VideoItem } from "@/types";

const CATEGORIES: VideoItem["category"][] = [
  "MGD TV",
  "Erbakan Hoca Videoları",
  "Fatih Erbakan Videoları",
  "Genel Başkan Konuşması",
  "Teşkilat & Kongre",
  "Belgesel & Arşiv",
  "Gençlik Buluşması",
];

const empty = (): VideoItem => ({
  id: "",
  title: "",
  category: "Genel Başkan Konuşması",
  duration: "12:30",
  date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
  thumbnail: "/images/basinda-biz/teskilat.png",
  youtubeId: "",
  views: "1.000",
  description: "",
  downloadUrl: "",
  showDownload: false,
});

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (match && match[1]) return match[1];
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

  const handleEdit = (v: VideoItem) => {
    setForm(v);
    setYoutubeInput(v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

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
        description="Video içeriklerini, YouTube bağlantılarını ve kapak fotoğraflarını yönetin."
      />

      <SaveStatus state={state} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Card className="sticky top-6">
            <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
              <Film size={18} />
              {form.id ? "Videoyu Düzenle" : "Yeni Video Ekle"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <Field
                label="Video Başlığı *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />

              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-600">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as VideoItem["category"] })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
                  label="YouTube Video Linki veya ID"
                  value={youtubeInput || form.youtubeId || ""}
                  onChange={handleYoutubeChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Link yapıştırdığınızda kapak fotoğrafı otomatik alınır; dilerseniz aşağıdan değiştirebilirsiniz.
                </p>
              </div>

              <ImagePickerField
                label="Kapak Fotoğrafı (Thumbnail)"
                recommendedSize="1280 × 720 px (Yatay 16:9)"
                value={form.thumbnail}
                onChange={(url) => setForm({ ...form, thumbnail: url })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Süre" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
                <Field label="Yayın Tarihi" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              </div>

              <Field
                label="Açıklama"
                multiline
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
              />

              {/* Videoyu İndir (Google Drive) Ayarı */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Download size={15} className="text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950">Videoyu İndir Butonu</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, showDownload: !prev.showDownload }))}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                      form.showDownload
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {form.showDownload ? "Aktif (Görünür)" : "Pasif (Gizli)"}
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                    Google Drive / İndirme Bağlantısı
                  </label>
                  <input
                    type="text"
                    value={form.downloadUrl || ""}
                    onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/... veya klasör linki"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="mt-1 text-[10.5px] text-slate-500">
                    Aktif edildiğinde ve link girildiğinde videonun altında &ldquo;Videoyu İndir&rdquo; butonu görünür.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={state.status === "saving"}
                  className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                >
                  <Plus size={15} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Videoyu Kaydet"}
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

        <div className="lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary">Mevcut Videolar ({videos.length})</h2>
              {!live && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Örnek Veri
                </span>
              )}
            </div>

            <div className="space-y-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="group flex flex-col sm:flex-row gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-primary/40 transition"
                >
                  <div className="relative aspect-video w-full sm:w-44 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                    <Image src={vid.thumbnail} alt={vid.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/90 text-primary-dark flex items-center justify-center shadow">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{vid.category}</span>
                        <span className="text-[11px] text-slate-400">{vid.date}</span>
                        {vid.showDownload && vid.downloadUrl && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <Download size={10} /> İndir Aktif
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-ink line-clamp-2 mb-1">{vid.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{vid.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      {vid.youtubeId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                        >
                          <Youtube size={14} /> YouTube <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(vid)}
                          className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-50"
                          title="Düzenle"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(vid.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50"
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
