"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Giriş yapılamadı.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary-dark p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 sm:p-10 shadow-2xl">
        <div className="mb-7 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            <Lock size={12} /> Yetkili Girişi
          </span>
          <h1 className="mt-1.5 font-serif text-2xl font-bold text-ink">
            Yönetim Paneli
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            İçerik, medya ve teşkilat yönetimi için oturum açın.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Kullanıcı Adı</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              placeholder="admin"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
