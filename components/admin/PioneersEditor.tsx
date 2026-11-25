"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Award,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Film,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  Youtube,
} from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { uploadMedia } from "@/lib/uploadMedia";
import type {
  OncuSahsiyet,
  SahsiyetBook,
  SahsiyetPhoto,
  SahsiyetVideo,
} from "@/data/oncu-sahsiyetler";

type SubTab = "videos" | "photos" | "books" | "profile";

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  );
  if (match && match[1]) return match[1];
  return trimmed;
}

const emptyVideo = (): SahsiyetVideo => ({
  id: "",
  title: "",
  youtubeId: "",
  duration: "15:00",
  date: "",
  category: "Belgesel & Arşiv",
  description: "",
  thumbnail: "",
  downloadUrl: "",
  showDownload: false,
});

const emptyPhoto = (): SahsiyetPhoto => ({
  id: "",
  url: "",
  caption: "",
  year: "",
});

const emptyBook = (defaultAuthor = ""): SahsiyetBook => ({
  id: "",
  title: "",
  author: defaultAuthor,
  year: "",
  coverImage: "/images/mgd/0001.jpg",
  description: "",
  totalPages: 0,
  pdfUrl: "",
});

export default function PioneersEditor() {
  const { data: remotePioneers, live } = useOncuSahsiyetler();
  const [pioneers, setPioneers] = useState<OncuSahsiyet[]>(remotePioneers);
  const [selectedId, setSelectedId] = useState<string>(remotePioneers[0]?.id || "erbakan");
  const [activeTab, setActiveTab] = useState<SubTab>("videos");
  const [state, setState] = useState<SaveState>(IDLE);

  // Sync when Firestore updates arrive
  useEffect(() => {
    setPioneers(remotePioneers);
    if (!remotePioneers.some((p) => p.id === selectedId) && remotePioneers[0]) {
      setSelectedId(remotePioneers[0].id);
    }
  }, [remotePioneers, selectedId]);

  const current = pioneers.find((p) => p.id === selectedId) || pioneers[0];

  // Video form state
  const [videoForm, setVideoForm] = useState<SahsiyetVideo>(emptyVideo());
  const [youtubeInput, setYoutubeInput] = useState("");

  // Photo form state
  const [photoForm, setPhotoForm] = useState<SahsiyetPhoto>(emptyPhoto());

  // Book form state
  const [bookForm, setBookForm] = useState<SahsiyetBook>(emptyBook(current?.name || ""));
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Reset sub-forms when switching pioneer
  useEffect(() => {
    setVideoForm(emptyVideo());
    setYoutubeInput("");
    setPhotoForm(emptyPhoto());
    setBookForm(emptyBook(current?.name || ""));
    setPdfError(null);
  }, [selectedId, current?.name]);

  const persistList = async (nextList: OncuSahsiyet[]) => {
    setPioneers(nextList);
    setState({ status: "saving" });
    const res = await saveSection("pioneers", { list: nextList });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
      return true;
    }
    setState({ status: "error", message: res.error || "Kaydedilemedi." });
    return false;
  };

  const updateCurrentAndSave = async (updater: (p: OncuSahsiyet) => OncuSahsiyet) => {
    if (!current) return false;
    const nextList = pioneers.map((p) => (p.id === current.id ? updater(p) : p));
    return persistList(nextList);
  };

  /* ---- VIDEO HANDLERS ---- */
  const handleYoutubeChange = (val: string) => {
    setYoutubeInput(val);
    const yId = extractYoutubeId(val);
    if (yId && yId.length === 11) {
      setVideoForm((prev) => ({
        ...prev,
        youtubeId: yId,
        thumbnail: prev.thumbnail || `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
      }));
    } else {
      setVideoForm((prev) => ({ ...prev, youtubeId: val }));
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) return;
    const yId = extractYoutubeId(youtubeInput || videoForm.youtubeId);
    const item: SahsiyetVideo = {
      ...videoForm,
      id: videoForm.id || `v-${current.id}-${Date.now()}`,
      youtubeId: yId,
      thumbnail:
        videoForm.thumbnail?.trim() ||
        (yId && yId.length === 11 ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : ""),
    };

    const ok = await updateCurrentAndSave((p) => {
      const exists = p.videos.some((v) => v.id === item.id);
      return {
        ...p,
        videos: exists ? p.videos.map((v) => (v.id === item.id ? item : v)) : [item, ...p.videos],
      };
    });

    if (ok) {
      setVideoForm(emptyVideo());
      setYoutubeInput("");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    await updateCurrentAndSave((p) => ({
      ...p,
      videos: p.videos.filter((v) => v.id !== videoId),
    }));
    if (videoForm.id === videoId) {
      setVideoForm(emptyVideo());
      setYoutubeInput("");
    }
  };

  /* ---- PHOTO HANDLERS ---- */
  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.url.trim()) return;
    const item: SahsiyetPhoto = {
      ...photoForm,
      id: photoForm.id || `p-${current.id}-${Date.now()}`,
      caption: photoForm.caption.trim() || current.name,
    };

    const ok = await updateCurrentAndSave((p) => {
      const exists = p.photos.some((ph) => ph.id === item.id);
      return {
        ...p,
        photos: exists ? p.photos.map((ph) => (ph.id === item.id ? item : ph)) : [item, ...p.photos],
      };
    });

    if (ok) {
      setPhotoForm(emptyPhoto());
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm("Bu fotoğrafı galeriden silmek istediğinize emin misiniz?")) return;
    await updateCurrentAndSave((p) => ({
      ...p,
      photos: p.photos.filter((ph) => ph.id !== photoId),
    }));
    if (photoForm.id === photoId) {
      setPhotoForm(emptyPhoto());
    }
  };

  /* ---- BOOK HANDLERS ---- */
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setPdfError(null);
    try {
      const data = await uploadMedia(file, { skipOptimize: true });
      if (data.ok && data.url) {
        setBookForm((prev) => ({ ...prev, pdfUrl: data.url! }));
      } else {
        setPdfError(data.error || "PDF yüklenemedi.");
      }
    } catch {
      setPdfError("PDF yüklenirken bağlantı hatası oluştu.");
    } finally {
      setUploadingPdf(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim()) return;
    const item: SahsiyetBook = {
      ...bookForm,
      id: bookForm.id || `b-${current.id}-${Date.now()}`,
      author: bookForm.author.trim() || current.name,
      totalPages: Math.max(0, Number(bookForm.totalPages) || 0),
    };

    const ok = await updateCurrentAndSave((p) => {
      const exists = p.books.some((b) => b.id === item.id);
      return {
        ...p,
        books: exists ? p.books.map((b) => (b.id === item.id ? item : b)) : [item, ...p.books],
      };
    });

    if (ok) {
      setBookForm(emptyBook(current.name));
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm("Bu kitabı / eseri silmek istediğinize emin misiniz?")) return;
    await updateCurrentAndSave((p) => ({
      ...p,
      books: p.books.filter((b) => b.id !== bookId),
    }));
    if (bookForm.id === bookId) {
      setBookForm(emptyBook(current.name));
    }
  };

  /* ---- PROFILE / PIONEER HANDLERS ---- */
  const updateLocalCurrent = (updater: (p: OncuSahsiyet) => OncuSahsiyet) => {
    if (!current) return;
    setPioneers((prev) => prev.map((p) => (p.id === current.id ? updater(p) : p)));
  };

  const handleAddPioneer = async () => {
    const newId = `sahsiyet-${Date.now()}`;
    const newPioneer: OncuSahsiyet = {
      id: newId,
      name: "Yeni Öncü Şahsiyet",
      title: "Unvan / Görev",
      period: "1900 - 2000",
      portrait: "/images/erbakan_portrait.png",
      badge: "Öncü Şahsiyet",
      motto: "",
      bioSections: [{ heading: "Hayatı", content: "" }],
      quotes: [],
      videos: [],
      photos: [],
      books: [],
    };
    const nextList = [...pioneers, newPioneer];
    setSelectedId(newId);
    setActiveTab("profile");
    await persistList(nextList);
  };

  const handleDeletePioneer = async () => {
    if (pioneers.length <= 1) {
      window.alert("En az bir öncü şahsiyet kalmalıdır.");
      return;
    }
    if (!window.confirm(`"${current.name}" kaydını ve tüm video/fotoğraf/kitaplarını silmek istediğinize emin misiniz?`)) {
      return;
    }
    const nextList = pioneers.filter((p) => p.id !== current.id);
    setSelectedId(nextList[0].id);
    await persistList(nextList);
  };

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeader
          title="Öncü Şahsiyetler Yönetimi"
          description="Öncü şahsiyetlerin video arşivini, fotoğraf galerisini, kitap/PDF eserlerini ve biyografi bilgilerini buradan yönetin."
        />
        <div className="flex items-center gap-2 shrink-0">
          <SaveStatus state={state} />
          <button
            type="button"
            onClick={handleAddPioneer}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
          >
            <Plus size={15} /> Yeni Şahsiyet Ekle
          </button>
        </div>
      </div>

      {/* Şahsiyet Seçim Sekmeleri */}
      <div className="flex flex-wrap items-center gap-2.5">
        {pioneers.map((p) => {
          const active = p.id === current.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-primary/40"
              }`}
            >
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/20">
                <Image src={p.portrait} alt={p.name} fill className="object-cover object-top" unoptimized />
              </div>
              <span>{p.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-blue-100" : "bg-slate-100 text-slate-500"
                }`}
              >
                {p.videos.length}V • {p.photos.length}F • {p.books.length}K
              </span>
            </button>
          );
        })}

        {!live && (
          <span className="ml-auto text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Örnek Veri (İlk kayıtta Firestore’a yazılır)
          </span>
        )}
      </div>

      {/* Alt Sekmeler: Videolar, Fotoğraflar, Kitaplar, Profil */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "videos"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Film size={15} /> Video Galerisi ({current.videos.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("photos")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "photos"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ImageIcon size={15} /> Fotoğraf Galerisi ({current.photos.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("books")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "books"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <BookOpen size={15} /> Kitap & PDF Eserler ({current.books.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "profile"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <User size={15} /> Profil, Biyografi & Sözler
        </button>
      </div>

      {/* ================= TAB 1: VIDEO GALERİSİ ================= */}
      {activeTab === "videos" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Card className="sticky top-6">
              <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
                <Film size={18} />
                {videoForm.id ? "Videoyu Düzenle" : `${current.name} — Yeni Video Ekle`}
              </h2>

              <form onSubmit={handleSaveVideo} className="space-y-4">
                <Field
                  label="Video Başlığı *"
                  value={videoForm.title}
                  onChange={(v) => setVideoForm({ ...videoForm, title: v })}
                  placeholder="Örn: Tarihi Gençlik Hitabı"
                />

                <div>
                  <Field
                    label="YouTube Video Linki veya ID *"
                    value={youtubeInput || videoForm.youtubeId}
                    onChange={handleYoutubeChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    YouTube linkini yapıştırdığınızda video ID ve kapak görseli otomatik alınır.
                  </p>
                </div>

                <ImagePickerField
                  label="Özel Kapak Fotoğrafı (Opsiyonel)"
                  recommendedSize="1280 × 720 px (Yatay 16:9)"
                  value={videoForm.thumbnail || ""}
                  onChange={(url) => setVideoForm({ ...videoForm, thumbnail: url })}
                />

                <div className="grid grid-cols-3 gap-2.5">
                  <Field
                    label="Kategori"
                    value={videoForm.category}
                    onChange={(v) => setVideoForm({ ...videoForm, category: v })}
                    placeholder="Gençliğe Hitap"
                  />
                  <Field
                    label="Süre"
                    value={videoForm.duration}
                    onChange={(v) => setVideoForm({ ...videoForm, duration: v })}
                    placeholder="18:40"
                  />
                  <Field
                    label="Tarih / Yer"
                    value={videoForm.date}
                    onChange={(v) => setVideoForm({ ...videoForm, date: v })}
                    placeholder="1996 / İstanbul"
                  />
                </div>

                <Field
                  label="Açıklama"
                  multiline
                  value={videoForm.description}
                  onChange={(v) => setVideoForm({ ...videoForm, description: v })}
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
                      onClick={() =>
                        setVideoForm((prev) => ({ ...prev, showDownload: !prev.showDownload }))
                      }
                      className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${
                        videoForm.showDownload
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {videoForm.showDownload ? "Aktif (Görünür)" : "Pasif (Gizli)"}
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                      Google Drive / İndirme Bağlantısı
                    </label>
                    <input
                      type="text"
                      value={videoForm.downloadUrl || ""}
                      onChange={(e) => setVideoForm({ ...videoForm, downloadUrl: e.target.value })}
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
                    <Plus size={15} />{" "}
                    {state.status === "saving"
                      ? "Kaydediliyor..."
                      : videoForm.id
                        ? "Videoyu Güncelle"
                        : "Videoyu Ekle"}
                  </button>
                  {videoForm.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoForm(emptyVideo());
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
              <h2 className="text-base font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                Mevcut Videolar ({current.videos.length})
              </h2>

              {current.videos.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Henüz video eklenmemiş. Sol taraftaki formdan ekleyebilirsiniz.
                </p>
              ) : (
                <div className="space-y-3">
                  {current.videos.map((vid) => {
                    const thumb =
                      vid.thumbnail ||
                      (vid.youtubeId
                        ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`
                        : current.portrait);
                    return (
                      <div
                        key={vid.id}
                        className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-primary/40 transition"
                      >
                        <div className="relative aspect-video w-full sm:w-40 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                          <Image src={thumb} alt={vid.title} fill className="object-cover" unoptimized />
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                              <Play size={14} fill="currentColor" className="ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-blue-50 px-2 py-0.5 rounded">
                                {vid.category}
                              </span>
                              <span className="text-[11px] text-slate-400">{vid.date}</span>
                            </div>
                            <h3 className="text-sm font-bold text-ink line-clamp-2">{vid.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{vid.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            {vid.youtubeId ? (
                              <a
                                href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                              >
                                <Youtube size={14} /> {vid.youtubeId} <ExternalLink size={11} />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400">YouTube ID yok</span>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setVideoForm(vid);
                                  setYoutubeInput(
                                    vid.youtubeId ? `https://www.youtube.com/watch?v=${vid.youtubeId}` : "",
                                  );
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-50"
                                title="Düzenle"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(vid.id)}
                                className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                                title="Sil"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FOTOĞRAF GALERİSİ ================= */}
      {activeTab === "photos" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Card className="sticky top-6">
              <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
                <ImageIcon size={18} />
                {photoForm.id ? "Fotoğrafı Düzenle" : `${current.name} — Yeni Fotoğraf Ekle`}
              </h2>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                <ImagePickerField
                  label="Fotoğraf *"
                  recommendedSize="1200 × 900 px (Yatay 4:3)"
                  value={photoForm.url}
                  onChange={(url) => setPhotoForm({ ...photoForm, url })}
                />

                <Field
                  label="Fotoğraf Açıklaması / Başlık *"
                  value={photoForm.caption}
                  onChange={(v) => setPhotoForm({ ...photoForm, caption: v })}
                  placeholder="Örn: İstanbul'un Fethi Kutlamaları"
                />

                <Field
                  label="Yıl (Opsiyonel)"
                  value={photoForm.year || ""}
                  onChange={(v) => setPhotoForm({ ...photoForm, year: v })}
                  placeholder="Örn: 1996"
                />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={state.status === "saving" || !photoForm.url.trim()}
                    className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                  >
                    <Plus size={15} />{" "}
                    {state.status === "saving"
                      ? "Kaydediliyor..."
                      : photoForm.id
                        ? "Fotoğrafı Güncelle"
                        : "Fotoğrafı Ekle"}
                  </button>
                  {photoForm.id && (
                    <button
                      type="button"
                      onClick={() => setPhotoForm(emptyPhoto())}
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
              <h2 className="text-base font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                Fotoğraf Galerisi ({current.photos.length})
              </h2>

              {current.photos.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Henüz fotoğraf eklenmemiş. Sol taraftaki formdan yükleyebilirsiniz.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {current.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-primary/40 transition flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] w-full bg-slate-900">
                        <Image src={photo.url} alt={photo.caption} fill className="object-cover" unoptimized />
                      </div>
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ink line-clamp-2">{photo.caption}</p>
                          {photo.year && (
                            <span className="text-[10px] font-mono text-slate-400">{photo.year}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoForm(photo);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-50"
                            title="Düzenle"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 3: KİTAPLAR & PDF ESERLER ================= */}
      {activeTab === "books" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Card className="sticky top-6">
              <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
                <BookOpen size={18} />
                {bookForm.id ? "Eseri Düzenle" : `${current.name} — Yeni Kitap / Eser Ekle`}
              </h2>

              <form onSubmit={handleSaveBook} className="space-y-4">
                <Field
                  label="Kitap / Eser Adı *"
                  value={bookForm.title}
                  onChange={(v) => setBookForm({ ...bookForm, title: v })}
                  placeholder="Örn: DAVAM"
                />

                <Field
                  label="Yazar"
                  value={bookForm.author}
                  onChange={(v) => setBookForm({ ...bookForm, author: v })}
                  placeholder={current.name}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Yayın Yılı"
                    value={bookForm.year}
                    onChange={(v) => setBookForm({ ...bookForm, year: v })}
                    placeholder="2013"
                  />
                  <Field
                    label="Sayfa Sayısı"
                    type="number"
                    value={String(bookForm.totalPages || "")}
                    onChange={(v) => setBookForm({ ...bookForm, totalPages: Number(v) || 0 })}
                    placeholder="288"
                  />
                </div>

                <ImagePickerField
                  label="Kitap Kapak Görseli"
                  recommendedSize="600 × 850 px (Dikey Kapak 3:4)"
                  value={bookForm.coverImage}
                  onChange={(url) => setBookForm({ ...bookForm, coverImage: url })}
                />

                {/* PDF Yükleme veya Link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-700">PDF Dosyası veya Linki</label>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploadingPdf}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                    >
                      {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      <span>{uploadingPdf ? "Yükleniyor..." : "Bilgisayardan PDF Yükle"}</span>
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
                    value={bookForm.pdfUrl}
                    onChange={(e) => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
                    placeholder="https://... veya yüklenen PDF yolu"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-primary focus:outline-none"
                  />
                  {pdfError && <p className="text-xs font-medium text-red-600">{pdfError}</p>}
                </div>

                <Field
                  label="Kitap Açıklaması"
                  multiline
                  value={bookForm.description}
                  onChange={(v) => setBookForm({ ...bookForm, description: v })}
                />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={state.status === "saving"}
                    className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                  >
                    <Plus size={15} />{" "}
                    {state.status === "saving"
                      ? "Kaydediliyor..."
                      : bookForm.id
                        ? "Eseri Güncelle"
                        : "Eseri Ekle"}
                  </button>
                  {bookForm.id && (
                    <button
                      type="button"
                      onClick={() => setBookForm(emptyBook(current.name))}
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
              <h2 className="text-base font-bold text-primary mb-4 pb-3 border-b border-slate-100">
                Kitaplar & PDF Eserler ({current.books.length})
              </h2>

              {current.books.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Henüz kitap veya PDF eser eklenmemiş.
                </p>
              ) : (
                <div className="space-y-3">
                  {current.books.map((book) => (
                    <div
                      key={book.id}
                      className="flex gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-primary/40 transition"
                    >
                      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-900 border border-slate-200">
                        <Image src={book.coverImage} alt={book.title} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <span>{book.year}</span>
                            {book.totalPages > 0 && <span>• {book.totalPages} Sayfa</span>}
                          </div>
                          <h3 className="text-sm font-bold text-ink">{book.title}</h3>
                          <p className="text-xs font-medium text-secondary">{book.author}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{book.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                          {book.pdfUrl && book.pdfUrl !== "#" ? (
                            <a
                              href={book.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                            >
                              <FileText size={13} /> PDF Bağlantısını Aç <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400">PDF eklenmedi</span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setBookForm(book);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="p-1.5 text-slate-500 hover:text-primary rounded-lg hover:bg-slate-50"
                              title="Düzenle"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBook(book.id)}
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
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PROFİL, BİYOGRAFİ & SÖZLER ================= */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary flex items-center gap-2">
                <Award size={18} /> Temel Profil Bilgileri
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => persistList(pioneers)}
                  disabled={state.status === "saving"}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
                >
                  <Save size={14} /> {state.status === "saving" ? "Kaydediliyor..." : "Profili Kaydet"}
                </button>
                {pioneers.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeletePioneer}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} /> Şahsiyeti Sil
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Ad Soyad *"
                value={current.name}
                onChange={(v) => updateLocalCurrent((p) => ({ ...p, name: v }))}
              />
              <Field
                label="Dönem / Yıllar"
                value={current.period}
                onChange={(v) => updateLocalCurrent((p) => ({ ...p, period: v }))}
                placeholder="1926 - 2011"
              />
              <Field
                label="Unvan / Alt Başlık"
                value={current.title}
                onChange={(v) => updateLocalCurrent((p) => ({ ...p, title: v }))}
              />
              <Field
                label="Rozet Metni"
                value={current.badge}
                onChange={(v) => updateLocalCurrent((p) => ({ ...p, badge: v }))}
              />
            </div>

            <div className="mt-4 space-y-4">
              <ImagePickerField
                label="Portre Fotoğrafı (Opsiyonel — Boş Bırakılabilir)"
                recommendedSize="800 × 1000 px (Dikey Portre 4:5)"
                value={current.portrait}
                onChange={(url) => updateLocalCurrent((p) => ({ ...p, portrait: url }))}
              />
              <ImagePickerField
                label="Özel Arka Plan Fotoğrafı (Opsiyonel — Boş Bırakılabilir)"
                recommendedSize="1920 × 900 px (Yatay Geniş)"
                value={current.backgroundImage || ""}
                onChange={(url) => updateLocalCurrent((p) => ({ ...p, backgroundImage: url }))}
              />
              <Field
                label="Şiar / Öne Çıkan Söz"
                multiline
                value={current.motto}
                onChange={(v) => updateLocalCurrent((p) => ({ ...p, motto: v }))}
              />
            </div>
          </Card>

          {/* Biyografi Bölümleri */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary">
                Biyografi Bölümleri ({current.bioSections.length})
              </h2>
              <button
                type="button"
                onClick={() =>
                  updateLocalCurrent((p) => ({
                    ...p,
                    bioSections: [...p.bioSections, { heading: "Yeni Bölüm", content: "" }],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
              >
                <Plus size={14} /> Bölüm Ekle
              </button>
            </div>

            <div className="space-y-4">
              {current.bioSections.map((sec, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">Bölüm #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateLocalCurrent((p) => ({
                          ...p,
                          bioSections: p.bioSections.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Kaldır
                    </button>
                  </div>
                  <Field
                    label="Başlık"
                    value={sec.heading}
                    onChange={(v) =>
                      updateLocalCurrent((p) => ({
                        ...p,
                        bioSections: p.bioSections.map((b, i) => (i === idx ? { ...b, heading: v } : b)),
                      }))
                    }
                  />
                  <Field
                    label="İçerik"
                    multiline
                    value={sec.content}
                    onChange={(v) =>
                      updateLocalCurrent((p) => ({
                        ...p,
                        bioSections: p.bioSections.map((b, i) => (i === idx ? { ...b, content: v } : b)),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Veciz Sözler */}
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary">
                Unutulmaz Veciz Sözler ({current.quotes.length})
              </h2>
              <button
                type="button"
                onClick={() =>
                  updateLocalCurrent((p) => ({
                    ...p,
                    quotes: [...p.quotes, ""],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
              >
                <Plus size={14} /> Söz Ekle
              </button>
            </div>

            <div className="space-y-2.5">
              {current.quotes.map((q, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) =>
                      updateLocalCurrent((p) => ({
                        ...p,
                        quotes: p.quotes.map((item, i) => (i === idx ? e.target.value : item)),
                      }))
                    }
                    placeholder="Veciz söz..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateLocalCurrent((p) => ({
                        ...p,
                        quotes: p.quotes.filter((_, i) => i !== idx),
                      }))
                    }
                    className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 shrink-0"
                    title="Sil"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <SaveStatus state={state} />
              <button
                type="button"
                onClick={() => persistList(pioneers)}
                disabled={state.status === "saving"}
                className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
              >
                <Save size={15} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Profil Değişikliklerini Kaydet"}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
