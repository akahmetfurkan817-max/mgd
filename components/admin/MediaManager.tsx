"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Check,
  Copy,
  Eye,
  Image as ImageIcon,
  Layers,
  Loader2,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Card } from "@/components/admin/ui";

interface MediaItem {
  id: string;
  name: string;
  category: "slider" | "logo" | "event" | "portrait" | "uploaded";
  path: string;
  desc?: string;
}

const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  { id: "m-s1", name: "Yeniden Milli Gençlik Afişi", category: "slider", path: "/images/slider/yeniden-milli-genclik.jpg", desc: "Manşet Afişi" },
  { id: "m-s2", name: "Üniversite & Lisans Burs Başvurusu", category: "slider", path: "/images/slider/burs-universite.jpg", desc: "Burs Duyurusu Görseli" },
  { id: "m-s3", name: "Haydi Milli Gençlik Seferberlik", category: "slider", path: "/images/slider/haydi-milli-genclik.jpg", desc: "Gençlik Buluşması Afişi" },
  { id: "m-s4", name: "Büyük Gençlik Şöleni", category: "slider", path: "/images/slider/genclik-soleni.jpg", desc: "Kongre & Şölen Afişi" },
  { id: "m-s5", name: "Milli Maarif Okuma Halkaları", category: "slider", path: "/images/slider/okuma-halkalari.jpg", desc: "Eğitim ve Kültür Afişi" },
  { id: "m-s6", name: "Erbakan Vizyonu Geniş Afiş", category: "slider", path: "/images/erbakan_banner.png", desc: "Prof. Dr. Necmettin Erbakan Afişi" },
  { id: "m-l1", name: "MGD Resmî Amblem & Yazı", category: "logo", path: "/images/logo.png", desc: "Koyu Zemin Kurumsal Logo" },
  { id: "m-l2", name: "MGD Beyaz / Açık Logo", category: "logo", path: "/images/logo-light.png", desc: "Şeffaf Beyaz Kurumsal Logo" },
  { id: "m-l3", name: "MGD Kare İkon / Avatar", category: "logo", path: "/images/logo_crop.png", desc: "Profil & Favicon İkonu" },
  { id: "m-l4", name: "MGD Sembol", category: "logo", path: "/images/logo-symbol.png", desc: "Filigran & Mühür Sembolü" },
  { id: "m-p1", name: "Prof. Dr. Necmettin Erbakan Portresi", category: "portrait", path: "/images/erbakan_portrait.png", desc: "Kurucu Lider Portresi" },
  { id: "m-p2", name: "Genel Başkan Ahmet Özvatan", category: "portrait", path: "/images/ahmet-ozvatan.jpg", desc: "Genel Başkan Portresi" },
  { id: "m-e1", name: "Teşkilat & Saha Çalışması", category: "event", path: "/images/basinda-biz/teskilat.png", desc: "81 İl Teşkilat Toplantısı" },
  { id: "m-e2", name: "Gaziantep Şube Açılışı", category: "event", path: "/images/basinda-biz/gaziantep.png", desc: "İl Binası Açılış Merasimi" },
  { id: "m-e3", name: "İstanbul Fetih Programı", category: "event", path: "/images/basinda-biz/istanbul-fetih.png", desc: "Gençlik Buluşması" },
  { id: "m-e4", name: "Çocuklarla Oyun ve Yaz Atölyeleri", category: "event", path: "/images/basinda-biz/yaz_etkinlikleri_cartoon.png", desc: "Yaz Etkinlikleri" },
  { id: "m-e5", name: "Yaz Gençlik Kampı 1", category: "event", path: "/images/basinda-biz/yaz_kamp_1.png", desc: "Doğa ve Liderlik Kampı" },
  { id: "m-e6", name: "Yaz Gençlik Kampı 2", category: "event", path: "/images/basinda-biz/yaz_kamp_2.png", desc: "Seminer ve Atölye" },
  { id: "m-e7", name: "Tekirdağ Teşkilat Buluşması", category: "event", path: "/images/basinda-biz/tekirdag.png", desc: "Trakya Bölge Toplantısı" },
  { id: "m-e8", name: "Karabük Gençlik Zirvesi", category: "event", path: "/images/basinda-biz/karabuk.png", desc: "Üniversite Buluşması" },
];

export default function MediaManager() {
  const [uploadedItems, setUploadedItems] = useState<MediaItem[]>([]);
  const [defaultItems, setDefaultItems] = useState<MediaItem[]>(DEFAULT_MEDIA_ITEMS);
  const [loadingList, setLoadingList] = useState(true);
  const [category, setCategory] = useState<"all" | "slider" | "logo" | "event" | "portrait" | "uploaded">("all");
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [replacingPath, setReplacingPath] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const notify = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUploaded = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (data.ok && Array.isArray(data.files)) {
        setUploadedItems(data.files);
      }
    } catch {
      notify("err", "Yüklenen görseller okunamadı.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadUploaded();
  }, [loadUploaded]);

  const allItems = [...uploadedItems, ...defaultItems];

  const filtered = allItems.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        (item.desc && item.desc.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const copyToClipboard = (path: string) => {
    const clean = path.split("?")[0];
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(clean);
      setCopiedPath(path);
      notify("ok", `Dosya yolu kopyalandı: ${clean}`);
      setTimeout(() => setCopiedPath(null), 2000);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let lastError = "";

    try {
      for (const file of list) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.ok && data.url) {
          successCount++;
        } else {
          lastError = data.error || "Yükleme başarısız.";
        }
      }

      await loadUploaded();

      if (successCount > 0) {
        notify("ok", `${successCount} fotoğraf başarıyla yüklendi.`);
      } else if (lastError) {
        notify("err", lastError);
      }
    } catch {
      notify("err", "Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleReplaceExisting = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingPath) return;

    setUploading(true);
    try {
      const cleanTarget = replacingPath.split("?")[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetPath", cleanTarget);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.ok && data.url) {
        if (cleanTarget.startsWith("/uploads/")) {
          setUploadedItems((prev) =>
            prev.map((it) => (it.path.split("?")[0] === cleanTarget ? { ...it, path: data.url } : it)),
          );
        } else {
          setDefaultItems((prev) =>
            prev.map((it) => (it.path.split("?")[0] === cleanTarget ? { ...it, path: data.url } : it)),
          );
        }
        notify("ok", "Fotoğraf başarıyla değiştirildi ve yayına alındı.");
      } else {
        notify("err", data.error || "Görsel değiştirilemedi.");
      }
    } catch {
      notify("err", "Fotoğraf değiştirme başarısız oldu.");
    } finally {
      setUploading(false);
      setReplacingPath(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleDeleteUploaded = async (item: MediaItem) => {
    if (item.category !== "uploaded") return;
    if (!window.confirm(`"${item.name}" fotoğrafını kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    const clean = item.path.split("?")[0];
    setDeletingPath(clean);
    try {
      const res = await fetch(`/api/admin/upload?path=${encodeURIComponent(clean)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setUploadedItems((prev) => prev.filter((x) => x.path.split("?")[0] !== clean));
        if (previewItem?.path.split("?")[0] === clean) setPreviewItem(null);
        notify("ok", "Fotoğraf başarıyla silindi.");
      } else {
        notify("err", data.error || "Fotoğraf silinemedi.");
      }
    } catch {
      notify("err", "Silme işlemi sırasında hata oluştu.");
    } finally {
      setDeletingPath(null);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadNew}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceExisting}
      />

      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2.5">
            <ImageIcon className="text-gold" /> Medya &amp; Fotoğraf Galerisi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Yeni fotoğraf yükleyin, yüklediklerinizi kalıcı olarak silin veya mevcut kurumsal görsellerin yerine yenisini koyun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-xs sm:text-sm"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Yükleniyor…
              </>
            ) : (
              <>
                <Upload size={16} /> Fotoğraf Yükle
              </>
            )}
          </button>

          <Link href="/admin/slides" className="btn-outline text-xs sm:text-sm">
            <Layers size={15} /> Slaytlar
          </Link>
        </div>
      </div>

      {/* Bildirim */}
      {toast && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span>{toast.text}</span>
          <button type="button" onClick={() => setToast(null)} className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sürükle-Bırak Yükleme Alanı */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) {
            uploadFiles(e.dataTransfer.files);
          }
        }}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-slate-300 bg-white hover:border-primary/50"
        }`}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ivory text-primary border border-slate-200">
          <Upload size={20} />
        </div>
        <p className="mt-3 text-sm font-bold text-ink">
          Fotoğrafları buraya sürükleyip bırakın veya bilgisayarınızdan seçin
        </p>
        <p className="mt-1 text-xs text-slate-500">
          JPG, PNG, WEBP, SVG — Birden fazla görsel seçebilirsiniz (Maks. 15 MB)
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-4 btn-outline text-xs py-2"
        >
          Dosya Seç
        </button>
      </div>

      {/* Filtre & Arama */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-slate-200 rounded-xl">
          {[
            { id: "all", label: `Tümü (${allItems.length})` },
            { id: "uploaded", label: `Yüklediklerim (${uploadedItems.length})` },
            { id: "slider", label: "Manşetler" },
            { id: "logo", label: "Logolar" },
            { id: "portrait", label: "Portreler" },
            { id: "event", label: "Etkinlikler" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as typeof category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                category === cat.id
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-ink hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Fotoğraf ara..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Görsel Kartları */}
      {loadingList && category === "uploaded" ? (
        <div className="py-12 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" /> Yüklenen fotoğraflar okunuyor...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-12 text-center text-sm text-slate-500">
          Bu kategoride fotoğraf bulunamadı. Yukarıdan yeni fotoğraf yükleyebilirsiniz.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const isUploaded = item.category === "uploaded";
            const cleanPath = item.path.split("?")[0];
            const isDeleting = deletingPath === cleanPath;

            return (
              <Card key={item.id} className="p-3 hover:border-slate-300 hover:shadow-md transition group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200">
                    <Image
                      src={item.path}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {isUploaded && (
                      <span className="absolute top-2 left-2 rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        Yüklenen
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingPath(item.path);
                          replaceInputRef.current?.click();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-white text-ink text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gold hover:text-white transition"
                      >
                        <Camera size={13} /> Fotoğrafı Değiştir
                      </button>

                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="flex-1 py-1.5 rounded-lg bg-white/90 text-ink text-xs font-bold flex items-center justify-center gap-1 hover:bg-white transition"
                        >
                          <Eye size={13} /> Önizle
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.path)}
                          className="py-1.5 px-2.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center hover:bg-primary-dark transition"
                          title="Yolu Kopyala"
                        >
                          {copiedPath === item.path ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <h3 className="font-bold text-ink text-xs leading-snug line-clamp-1">{item.name}</h3>
                    {item.desc && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <span className="font-mono text-[10px] text-slate-500 truncate select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 flex-1">
                    {cleanPath}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingPath(item.path);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition"
                      title="Fotoğrafı Değiştir"
                    >
                      <Camera size={14} />
                    </button>

                    {isUploaded && (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDeleteUploaded(item)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        title="Fotoğrafı Kalıcı Olarak Sil"
                      >
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Önizleme Modalı */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-ivory">
              <div>
                <h3 className="font-bold text-ink text-sm">{previewItem.name}</h3>
                <p className="font-mono text-xs text-slate-500">{previewItem.path.split("?")[0]}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-200/60 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full h-[360px] sm:h-[460px] bg-slate-950">
              <Image src={previewItem.path} alt={previewItem.name} fill className="object-contain" unoptimized />
            </div>

            <div className="p-4 bg-ivory flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(previewItem.path)}
                className="btn-outline text-xs py-2"
              >
                <Copy size={14} /> Yolu Kopyala
              </button>

              <div className="flex items-center gap-2">
                {previewItem.category === "uploaded" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUploaded(previewItem)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} /> Fotoğrafı Sil
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const target = previewItem.path;
                    setPreviewItem(null);
                    setReplacingPath(target);
                    replaceInputRef.current?.click();
                  }}
                  className="btn-primary text-xs py-2"
                >
                  <Camera size={14} /> Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
