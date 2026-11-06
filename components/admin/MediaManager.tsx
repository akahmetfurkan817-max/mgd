"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Check,
  Copy,
  ExternalLink,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
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
  // Manşet Afişleri
  {
    id: "m-s1",
    name: "Yeniden Milli Gençlik Afişi",
    category: "slider",
    path: "/images/slider/yeniden-milli-genclik.jpg",
    desc: "1920x800 Yüksek Çözünürlüklü Manşet Afişi",
  },
  {
    id: "m-s2",
    name: "Üniversite & Lisans Burs Başvurusu",
    category: "slider",
    path: "/images/slider/burs-universite.jpg",
    desc: "Burs Duyurusu Manşet Görseli",
  },
  {
    id: "m-s3",
    name: "Haydi Milli Gençlik Seferberlik",
    category: "slider",
    path: "/images/slider/haydi-milli-genclik.jpg",
    desc: "Gençlik Buluşması Manşet Afişi",
  },
  {
    id: "m-s4",
    name: "Büyük Gençlik Şöleni",
    category: "slider",
    path: "/images/slider/genclik-soleni.jpg",
    desc: "Kongre & Şölen Manşet Afişi",
  },
  {
    id: "m-s5",
    name: "Milli Maarif Okuma Halkaları",
    category: "slider",
    path: "/images/slider/okuma-halkalari.jpg",
    desc: "Eğitim ve Kültür Manşet Afişi",
  },
  {
    id: "m-s6",
    name: "Erbakan Vizyonu Geniş Afiş",
    category: "slider",
    path: "/images/erbakan_banner.png",
    desc: "Prof. Dr. Necmettin Erbakan Manşet Afişi",
  },

  // Logolar & Kurumsal
  {
    id: "m-l1",
    name: "MGD Resmî Amblem & Yazı",
    category: "logo",
    path: "/images/logo.png",
    desc: "Koyu Zemin Uyumlu Orijinal MGD Logosu",
  },
  {
    id: "m-l2",
    name: "MGD Beyaz / Açık Logo",
    category: "logo",
    path: "/images/logo-light.png",
    desc: "Şeffaf Arka Plan Beyaz Kurumsal Logo",
  },
  {
    id: "m-l3",
    name: "MGD Kare Yuvarlak İkon / Avatar",
    category: "logo",
    path: "/images/logo_crop.png",
    desc: "Sosyal Medya, Profil ve Favicon İkonu",
  },
  {
    id: "m-l4",
    name: "MGD Hilal & Başak Sembolü",
    category: "logo",
    path: "/images/logo-symbol.png",
    desc: "Arka Plan Filigran ve Mühür Sembolü",
  },

  // Portreler & Liderler
  {
    id: "m-p1",
    name: "Prof. Dr. Necmettin Erbakan Portresi",
    category: "portrait",
    path: "/images/erbakan_portrait.png",
    desc: "Öncü Şahsiyetler & Hero Portre Görseli",
  },
  {
    id: "m-p2",
    name: "Genel Başkan Ahmet Özvatan",
    category: "portrait",
    path: "/images/ahmet-ozvatan.jpg",
    desc: "MGD Genel Başkanı Resmî Portresi",
  },

  // Etkinlikler & Basında Biz
  {
    id: "m-e1",
    name: "Teşkilat & Saha Çalışması",
    category: "event",
    path: "/images/basinda-biz/teskilat.png",
    desc: "81 İl Teşkilat Toplantısı",
  },
  {
    id: "m-e2",
    name: "Gaziantep Şube Açılışı",
    category: "event",
    path: "/images/basinda-biz/gaziantep.png",
    desc: "İl Binası Açılış Merasimi",
  },
  {
    id: "m-e3",
    name: "İstanbul Fetih Programı",
    category: "event",
    path: "/images/basinda-biz/istanbul-fetih.png",
    desc: "Gençlik Buluşması",
  },
  {
    id: "m-e4",
    name: "Çocuklarla Oyun ve Yaz Atölyeleri",
    category: "event",
    path: "/images/basinda-biz/yaz_etkinlikleri_cartoon.png",
    desc: "Yaz Etkinlikleri Görseli",
  },
  {
    id: "m-e5",
    name: "Yaz Gençlik Kampı 1",
    category: "event",
    path: "/images/basinda-biz/yaz_kamp_1.png",
    desc: "Doğa ve Liderlik Kampı",
  },
  {
    id: "m-e6",
    name: "Yaz Gençlik Kampı 2",
    category: "event",
    path: "/images/basinda-biz/yaz_kamp_2.png",
    desc: "Seminer ve Atölye Çalışmaları",
  },
  {
    id: "m-e7",
    name: "Tekirdağ Teşkilat Buluşması",
    category: "event",
    path: "/images/basinda-biz/tekirdag.png",
    desc: "Trakya Bölge Toplantısı",
  },
  {
    id: "m-e8",
    name: "Karabük Gençlik Zirvesi",
    category: "event",
    path: "/images/basinda-biz/karabuk.png",
    desc: "Üniversite Temsilcilikleri Buluşması",
  },
];

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("mgd_custom_media");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return [...parsed, ...DEFAULT_MEDIA_ITEMS];
          }
        }
      } catch {}
    }
    return DEFAULT_MEDIA_ITEMS;
  });

  const [category, setCategory] = useState<"all" | "slider" | "logo" | "event" | "portrait" | "uploaded">("all");
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [replacingPath, setReplacingPath] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) => {
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
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2500);
    }
  };

  // Yeni fotoğraf yükleme
  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.ok && data.url) {
        const newItem: MediaItem = {
          id: `upload-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "uploaded",
          path: data.url,
          desc: "Yönetim Panelinden Yüklenen Fotoğraf",
        };

        const next = [newItem, ...items];
        setItems(next);
        if (typeof window !== "undefined") {
          try {
            const custom = next.filter((it) => it.category === "uploaded");
            localStorage.setItem("mgd_custom_media", JSON.stringify(custom));
          } catch {}
        }
        alert("Fotoğraf başarıyla yüklendi! Şimdi galeride görebilir ve dosya yolunu kopyalayabilirsiniz.");
      } else {
        alert(data.error || "Yükleme başarısız oldu.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Fotoğraf yüklenemedi.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  // Mevcut bir fotoğrafı değiştirme / üzerine yazma
  const handleReplaceExisting = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingPath) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetPath", replacingPath.split("?")[0]);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.ok && data.url) {
        // Cache-busting URL ile güncelle
        const next = items.map((it) =>
          it.path.split("?")[0] === replacingPath.split("?")[0]
            ? { ...it, path: data.url }
            : it
        );
        setItems(next);
        alert("Fotoğraf başarıyla değiştirildi! Yeni görsel sitenizde aktif hale geldi.");
      } else {
        alert(data.error || "Görsel değiştirilemedi.");
      }
    } catch (err) {
      console.error("Replace error:", err);
      alert("Fotoğraf değiştirme işlemi başarısız oldu.");
    } finally {
      setUploading(false);
      setReplacingPath(null);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Gizli Dosya Seçiciler */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2.5">
            <ImageIcon className="text-secondary" /> Medya & Fotoğraf Galerisi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sitedeki tüm fotoğrafları inceleyin, bilgisayarınızdan yeni fotoğraflar yükleyin veya var olan herhangi bir fotoğrafın yerine yenisini koyun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm transition active:scale-95"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin text-secondary" /> Yükleniyor…
              </>
            ) : (
              <>
                <Upload size={16} /> Bilgisayardan Fotoğraf Yükle
              </>
            )}
          </button>

          <Link
            href="/admin/slides"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition"
          >
            <Layers size={16} className="text-primary" /> Manşet Slaytları
          </Link>
        </div>
      </div>

      {/* Hızlı Bilgisayardan Yükleme & Fotoğraf Değiştirme Kutusu */}
      <div className="p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shrink-0 shadow-xs">
            <Camera size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Fotoğrafları Nasıl Değiştirebilirsiniz?
            </h3>
            <p className="text-slate-600 mt-0.5 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Aşağıdaki herhangi bir fotoğraf kartının üzerindeki <strong>&ldquo;Fotoğrafı Değiştir&rdquo;</strong> butonuna basarak doğrudan bilgisayarınızdan yeni bir fotoğraf seçebilirsiniz. Yeni fotoğraf anında o görselin yerine geçer ve sitede yayına girer.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
        >
          <Plus size={14} /> Yeni Fotoğraf Ekle
        </button>
      </div>

      {/* Arama ve Filtre Sekmeleri */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Kategori Butonları */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: "all", label: "Tüm Fotoğraflar" },
            { id: "uploaded", label: "Yüklediklerim" },
            { id: "slider", label: "Manşet Afişleri" },
            { id: "logo", label: "Logolar & Mühür" },
            { id: "portrait", label: "Portreler" },
            { id: "event", label: "Etkinlik & Basın" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                category === cat.id
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Arama Input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Fotoğraf ara..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:border-secondary focus:outline-none"
          />
        </div>
      </div>

      {/* Görsel Kartları Izgarası */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-3 hover:border-slate-300 hover:shadow-md transition group flex flex-col justify-between">
            <div>
              {/* Görsel Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-200">
                <Image
                  src={item.path}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Hover Üzeri Butonlar */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingPath(item.path);
                      replaceInputRef.current?.click();
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-secondary text-primary-dark text-xs font-bold flex items-center justify-center gap-1.5 shadow active:scale-95 transition"
                  >
                    <Camera size={13} /> Fotoğrafı Değiştir
                  </button>

                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="flex-1 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-1 shadow hover:bg-slate-100 transition"
                    >
                      <Eye size={13} /> Önizle
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.path)}
                      className="py-1.5 px-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow hover:bg-blue-700 transition"
                      title="Yolu Kopyala"
                    >
                      {copiedPath === item.path ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Görsel Adı ve Açıklama */}
              <div className="mt-2.5">
                <h3 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">
                  {item.name}
                </h3>
                {item.desc && (
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                )}
              </div>
            </div>

            {/* Alt İşlemler: Değiştir Butonu & Dosya Yolu */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
              <span className="font-mono text-[10px] text-slate-500 truncate select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 max-w-[130px]">
                {item.path.split("?")[0]}
              </span>

              <button
                type="button"
                onClick={() => {
                  setReplacingPath(item.path);
                  replaceInputRef.current?.click();
                }}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition flex items-center gap-1"
                title="Bu görselin yerine bilgisayardan yeni fotoğraf yükle"
              >
                <Camera size={11} /> Değiştir
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* ==================== BÜYÜK BOYUT ÖNİZLEME MODAL ==================== */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{previewItem.name}</h3>
                <p className="font-mono text-xs text-slate-500">{previewItem.path}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative w-full h-[380px] sm:h-[480px] bg-slate-950 flex items-center justify-center p-4">
              <Image
                src={previewItem.path}
                alt={previewItem.name}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => copyToClipboard(previewItem.path)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Copy size={14} /> Dosya Yolunu Kopyala
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = previewItem.path;
                    setPreviewItem(null);
                    setReplacingPath(target);
                    replaceInputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Camera size={14} /> Bu Fotoğrafı Değiştir
                </button>

                <Link
                  href="/admin/slides"
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Sparkles size={14} className="text-secondary" /> Slaytlarda Kullan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
