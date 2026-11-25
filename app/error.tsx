"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Sayfa hatası:", error);
  }, [error]);

  const handleRetry = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("mgd_"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="font-display text-xl font-extrabold text-primary-dark">
          Sayfa yüklenirken geçici bir sorun oluştu
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Önbellek temizlenip sayfa yeniden yüklendiğinde sorun otomatik olarak düzelecektir.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="btn-primary inline-flex items-center gap-2 text-xs px-5 py-2.5"
          >
            <RefreshCw size={14} /> Yeniden Dene
          </button>
          <Link
            href="/"
            className="btn-outline inline-flex items-center gap-2 text-xs px-5 py-2.5"
          >
            <Home size={14} /> Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
