"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Card } from "@/components/admin/ui";

interface MediaItem {
  id: string;
  name: string;
  category: "slider" | "logo" | "event" | "portrait";
  path: string;
  desc?: string;
}

const MEDIA_ITEMS: MediaItem[] = [
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
  const [category, setCategory] = useState<"all" | "slider" | "logo" | "event" | "portrait">("all");
  const [search, setSearch] = useState("");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [testPath, setTestPath] = useState("");

  const filtered = MEDIA_ITEMS.filter((item) => {
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

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark flex items-center gap-2.5">
            <ImageIcon className="text-secondary" /> Medya & Fotoğraf Galerisi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sitede kullanılan tüm fotoğrafları, afişleri ve logoları inceleyin, dosya yollarını tek tıkla kopyalayın ve manşetlerde kullanın.
          </p>
        </div>

        <Link
          href="/admin/slides"
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-lg shadow-sm transition active:scale-95 shrink-0"
        >
          <Layers size={16} /> Manşet Slaytlarına Git
        </Link>
      </div>

      {/* Bilgilendirme Kutusu */}
      <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FolderOpen className="text-blue-700 shrink-0" size={20} />
          <div>
            <p className="font-bold text-slate-900">Fotoğrafları Nereden Yükleyebilirsiniz?</p>
            <p className="text-slate-600 mt-0.5 text-xs">
              Yeni görselleri projenizin <code className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">public/images/</code> klasörüne atarak veya internetteki herhangi bir resim bağlantısını (URL) doğrudan slayt ve haber formlarına yapıştırabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre Sekmeleri */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Kategori Butonları */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[
            { id: "all", label: "Tüm Görseller" },
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="p-2 rounded-full bg-white text-slate-900 shadow hover:bg-slate-100 transition"
                    title="Büyük Boyut İncele"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.path)}
                    className="p-2 rounded-full bg-secondary text-primary-dark shadow hover:bg-amber-300 transition"
                    title="Dosya Yolunu Kopyala"
                  >
                    {copiedPath === item.path ? <Check size={15} /> : <Copy size={15} />}
                  </button>
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

            {/* Alt Dosya Yolu & Kopyala Butonu */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
              <span className="font-mono text-[10px] text-slate-500 truncate select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                {item.path}
              </span>

              <button
                type="button"
                onClick={() => copyToClipboard(item.path)}
                className={`p-1.5 rounded text-xs font-semibold shrink-0 transition flex items-center gap-1 ${
                  copiedPath === item.path
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-slate-600 hover:text-primary hover:bg-slate-100"
                }`}
                title="Yolu Kopyala"
              >
                {copiedPath === item.path ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-[10px]">Kopyalandı!</span>
                  </>
                ) : (
                  <Copy size={13} />
                )}
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

              <Link
                href="/admin/slides"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Sparkles size={14} className="text-secondary" /> Slaytlarda Kullan
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
