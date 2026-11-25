"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, CloudUpload, Image as ImageIcon, Loader2, Search, Trash2, Upload, X } from "lucide-react";
import { uploadMedia } from "@/lib/uploadMedia";

interface LibraryItem {
  name: string;
  path: string;
  category: string;
}

const BUILTIN_PRESETS: LibraryItem[] = [
  { name: "Yeniden Milli Gençlik", path: "/images/slider/yeniden-milli-genclik.jpg", category: "Manşet" },
  { name: "Üniversite Bursu", path: "/images/slider/burs-universite.jpg", category: "Manşet" },
  { name: "Haydi Milli Gençlik", path: "/images/slider/haydi-milli-genclik.jpg", category: "Manşet" },
  { name: "Gençlik Şöleni", path: "/images/slider/genclik-soleni.jpg", category: "Manşet" },
  { name: "Okuma Halkaları", path: "/images/slider/okuma-halkalari.jpg", category: "Manşet" },
  { name: "Genel Başkan Portre", path: "/images/ahmet-ozvatan.jpg", category: "Portre" },
  { name: "Erbakan Portre", path: "/images/erbakan_portrait.png", category: "Portre" },
  { name: "Teşkilat Buluşması", path: "/images/basinda-biz/teskilat.png", category: "Etkinlik" },
  { name: "İstanbul Fetih", path: "/images/basinda-biz/istanbul-fetih.png", category: "Etkinlik" },
  { name: "Gaziantep Şube", path: "/images/basinda-biz/gaziantep.png", category: "Etkinlik" },
  { name: "Yaz Kampı", path: "/images/basinda-biz/yaz_kamp_1.png", category: "Etkinlik" },
];

export default function ImagePickerField({
  label,
  value,
  onChange,
  placeholder = "/images/... veya /api/media/...",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const modalFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<LibraryItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [libSearch, setLibSearch] = useState("");
  const [libCategory, setLibCategory] = useState<string>("Tümü");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUploaded = useCallback(async () => {
    setLoadingLib(true);
    try {
      const res = await fetch("/api/admin/upload");
      const data = await res.json();
      if (data.ok && Array.isArray(data.files)) {
        setUploadedFiles(
          data.files.map((f: { name: string; path: string }) => ({
            name: f.name,
            path: f.path,
            category: "Yüklenen",
          })),
        );
      }
    } catch {
      // sessiz geç
    } finally {
      setLoadingLib(false);
    }
  }, []);

  useEffect(() => {
    if (pickerOpen) {
      fetchUploaded();
    }
  }, [pickerOpen, fetchUploaded]);

  const processFile = async (file: File, closeModalAfter = false) => {
    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    const data = await uploadMedia(file);
    setUploading(false);

    if (data.ok && data.url) {
      onChange(data.url);
      setSuccessMsg("Görsel yüklendi.");
      setTimeout(() => setSuccessMsg(null), 2500);
      if (pickerOpen) {
        await fetchUploaded();
        if (closeModalAfter) setPickerOpen(false);
      }
    } else {
      setErrorMsg(data.error || "Görsel yüklenemedi.");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, closeModalAfter = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, closeModalAfter);
    if (e.target) e.target.value = "";
  };

  const allLibrary = useMemo(() => [...uploadedFiles, ...BUILTIN_PRESETS], [uploadedFiles]);

  const filteredLibrary = useMemo(() => {
    return allLibrary.filter((item) => {
      if (libCategory !== "Tümü" && item.category !== libCategory) return false;
      if (libSearch.trim()) {
        const q = libSearch.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allLibrary, libCategory, libSearch]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Yükle"}</span>
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-primary hover:text-primary transition"
          >
            <ImageIcon size={12} /> Galeriden Seç
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-100 transition"
              title="Fotoğrafı Kaldır"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e, false)}
      />

      {/* Sürükle-bırak destekli önizleme + URL alanı */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const f = e.dataTransfer.files?.[0];
          if (f) processFile(f, false);
        }}
        className={`flex items-center gap-2.5 rounded-xl border p-2 transition ${
          dragActive
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-slate-200 bg-slate-50/60"
        }`}
      >
        {value ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Değiştirmek için tıklayın veya görsel sürükleyin"
            className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900 group"
          >
            <Image src={value} alt="" fill className="object-cover" unoptimized />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
              <CloudUpload size={16} />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400 hover:border-primary hover:text-primary transition"
          >
            <CloudUpload size={18} />
            <span className="text-[9px] font-semibold mt-0.5">Yükle</span>
          </button>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={(e) => {
              const imgItem = Array.from(e.clipboardData.items).find((it) => it.type.startsWith("image/"));
              if (imgItem) {
                e.preventDefault();
                const file = imgItem.getAsFile();
                if (file) processFile(file, false);
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-primary focus:outline-none"
          />
          <p className="text-[10px] text-slate-500">
            Görseli buraya sürükleyip bırakabilir, yapıştırabilir (Ctrl+V) veya yukarıdan yükleyebilirsiniz.
          </p>
        </div>
      </div>

      {errorMsg && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
          {errorMsg}
        </p>
      )}
      {successMsg && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 flex items-center gap-1.5">
          <Check size={13} /> {successMsg}
        </p>
      )}

      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/70 p-4 backdrop-blur-sm"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 bg-ivory">
              <div>
                <h3 className="text-sm font-bold text-ink">Medya Galerisinden Fotoğraf Seç</h3>
                <p className="text-xs text-slate-500">
                  Mevcut görsellerden seçin veya doğrudan yeni fotoğraf yükleyin.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={modalFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, true)}
                />
                <button
                  type="button"
                  onClick={() => modalFileRef.current?.click()}
                  disabled={uploading}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploading ? "Yükleniyor..." : "Yeni Yükle & Seç"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filtre & Arama */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 px-5 py-3 bg-white">
              <div className="flex flex-wrap gap-1">
                {["Tümü", "Yüklenen", "Manşet", "Portre", "Etkinlik"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibCategory(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                      libCategory === cat
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                    {cat === "Yüklenen" ? ` (${uploadedFiles.length})` : ""}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-56">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={libSearch}
                  onChange={(e) => setLibSearch(e.target.value)}
                  placeholder="Görsel ara..."
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLib ? (
                <div className="flex items-center justify-center py-12 text-slate-500 gap-2 text-xs">
                  <Loader2 size={18} className="animate-spin" /> Galeri yükleniyor...
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Bu filtrede görsel bulunamadı. Yukarıdan yeni görsel yükleyebilirsiniz.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredLibrary.map((item) => {
                    const selected = value.split("?")[0] === item.path.split("?")[0];
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          onChange(item.path);
                          setPickerOpen(false);
                        }}
                        className={`group text-left rounded-xl border p-2 transition ${
                          selected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-slate-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-900">
                          <Image src={item.path} alt={item.name} fill className="object-cover" unoptimized />
                          {selected && (
                            <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                              <Check size={12} />
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 truncate text-[11px] font-bold text-ink">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.category}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
