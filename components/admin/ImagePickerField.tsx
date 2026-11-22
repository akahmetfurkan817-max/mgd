"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Image as ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";

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
  placeholder = "/images/... veya /uploads/...",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<LibraryItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchUploaded = async () => {
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
  };

  useEffect(() => {
    if (pickerOpen) {
      fetchUploaded();
    }
  }, [pickerOpen]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok && data.url) {
        onChange(data.url);
      } else {
        setErrorMsg(data.error || "Görsel yüklenemedi.");
      }
    } catch {
      setErrorMsg("Yükleme sırasında bağlantı hatası oluştu.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const allLibrary = [...uploadedFiles, ...BUILTIN_PRESETS];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition"
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
        onChange={handleUpload}
      />

      <div className="flex items-center gap-2.5">
        {value ? (
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
            <ImageIcon size={18} />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-primary focus:outline-none"
        />
      </div>

      {errorMsg && <p className="text-xs font-medium text-red-600">{errorMsg}</p>}

      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/70 p-4 backdrop-blur-sm"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-ivory">
              <div>
                <h3 className="text-sm font-bold text-ink">Medya Galerisinden Fotoğraf Seç</h3>
                <p className="text-xs text-slate-500">Yüklediğiniz veya hazır kurumsal görsellerden seçin.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingLib ? (
                <div className="flex items-center justify-center py-12 text-slate-500 gap-2 text-xs">
                  <Loader2 size={18} className="animate-spin" /> Galeri yükleniyor...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allLibrary.map((item) => {
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
