"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Heart,
  Instagram,
  Plus,
  RefreshCw,
  Repeat2,
  Trash2,
  X,
} from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useSocialPosts } from "@/hooks/useSiteData";
import { deleteItem, saveSection } from "@/lib/adminApi";
import type { SocialPost } from "@/types";

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const EMPTY_FORM: Omit<SocialPost, "id"> = {
  platform: "x",
  authorName: "Milli Gençlik Derneği",
  authorHandle: "@milligenclikmgd",
  authorAvatar: "/images/ahmet-ozvatan.jpg",
  content: "",
  imageUrl: "",
  postUrl: "https://x.com/milligenclikmgd",
  date: "Bugün",
  likes: 120,
  shares: 25,
  comments: 10,
};

export default function SocialEditor() {
  const { data: posts } = useSocialPosts();
  const [filter, setFilter] = useState<"all" | "x" | "instagram">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SocialPost, "id">>(EMPTY_FORM);
  const [state, setState] = useState<SaveState>(IDLE);
  const [syncing, setSyncing] = useState(false);

  const filtered = posts.filter((p) => {
    if (filter === "all") return true;
    return p.platform === filter;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const handleOpenEdit = (post: SocialPost) => {
    setEditingId(post.id);
    setForm({
      platform: post.platform,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      content: post.content,
      imageUrl: post.imageUrl || "",
      postUrl: post.postUrl,
      date: post.date,
      likes: post.likes || 0,
      shares: post.shares || 0,
      comments: post.comments || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) {
      alert("Lütfen gönderi metnini yazınız.");
      return;
    }

    setState({ status: "saving" });
    const payload: SocialPost = {
      ...form,
      id: editingId || `sp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    const res = await saveSection("social", payload);
    if (res.ok) {
      setState({ status: "saved" });
      setModalOpen(false);
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Kaydedilemedi." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu sosyal medya gönderisini silmek istediğinize emin misiniz?")) return;
    setState({ status: "saving" });
    const res = await deleteItem("social", id);
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Silinemedi." });
    }
  };

  const handleSyncAuto = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/social/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "X ve Instagram gönderileri başarıyla senkronize edildi!");
      } else {
        alert(data.error || "Senkronizasyon başarısız oldu. Gönderileri elle ekleyebilirsiniz.");
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Sosyal Medya Akışı Yönetimi (@milligenclikmgd)"
          description="Resmi X (Twitter) ve Instagram paylaşımlarını otomatik senkronize edin veya dilediğiniz gönderiyi elle ekleyin."
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncAuto}
            disabled={syncing}
            className="btn-outline text-xs px-4 py-2.5 flex items-center gap-2 shadow-sm"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Senkronize Ediliyor..." : "Otomatik Senkronize Et"}
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 shadow-md"
          >
            <Plus size={16} /> Yeni Gönderi Ekle (Elle)
          </button>
        </div>
      </div>

      <SaveStatus state={state} />

      {/* Filtre Sekmeleri */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
            filter === "all" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Tümü ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("x")}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
            filter === "x" ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <XIcon className="h-3 w-3" /> X (Twitter) ({posts.filter((p) => p.platform === "x").length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("instagram")}
          className={`rounded-lg px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
            filter === "instagram"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          <Instagram size={13} /> Instagram ({posts.filter((p) => p.platform === "instagram").length})
        </button>
      </div>

      {/* Gönderi Kartları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <Card key={post.id} className="flex flex-col justify-between p-5">
            <div>
              {/* Üst Bar: Platform ve Sil Butonu */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                    post.platform === "x"
                      ? "bg-slate-950 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  }`}
                >
                  {post.platform === "x" ? <XIcon className="h-3 w-3" /> : <Instagram size={12} />}
                  {post.platform === "x" ? "X (Twitter)" : "Instagram"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 text-slate-400 hover:text-secondary rounded-lg hover:bg-slate-50 transition"
                    title="Düzenle"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Görsel Varsa */}
              {post.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-3 border border-slate-200">
                  <Image
                    src={post.imageUrl}
                    alt="Gönderi Görseli"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Metin */}
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 mb-3">
                {post.content}
              </p>
            </div>

            {/* Alt Detaylar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-red-500" /> {post.likes || 0}
              </span>
              <span>{post.date}</span>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-semibold hover:underline flex items-center gap-1"
              >
                Görüntüle <ExternalLink size={10} />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Elle Gönderi Ekleme / Düzenleme Modalı */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingId ? "Sosyal Medya Gönderisini Düzenle" : "Yeni Sosyal Medya Gönderisi Ekle"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sosyal Medya Platformu
                </label>
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      platform: e.target.value as "x" | "instagram",
                      postUrl:
                        e.target.value === "instagram"
                          ? "https://www.instagram.com/milligenclikmgd/"
                          : "https://x.com/milligenclikmgd",
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="x">X (Twitter) - @milligenclikmgd</option>
                  <option value="instagram">Instagram - @milligenclikmgd</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gönderi / Tweet Metni *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Gönderi içeriğini veya tweet metnini buraya yapıştırın..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Görsel URL / Fotoğraf Yolu
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://... veya /images/basinda-biz/..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarih İfadesi</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Bugün, Dün, 2 gün önce..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Beğeni Sayısı</label>
                  <input
                    type="number"
                    value={form.likes}
                    onChange={(e) => setForm({ ...form, likes: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Orijinal Gönderi Bağlantısı (URL)
                </label>
                <input
                  type="url"
                  value={form.postUrl}
                  onChange={(e) => setForm({ ...form, postUrl: e.target.value })}
                  placeholder="https://x.com/milligenclikmgd/status/..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={state.status === "saving"}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-secondary transition shadow"
                >
                  {state.status === "saving" ? "Kaydediliyor..." : "Kaydet ve Yayınla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
