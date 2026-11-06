"use client";

import { useState } from "react";
import { DatabaseZap } from "lucide-react";
import { seedDatabase } from "@/lib/adminApi";

export default function SeedButton() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!window.confirm("Örnek veriler Firestore'a yazılacak; aynı kimlikli kayıtların üzerine yazılır. Devam?")) return;
    setBusy(true);
    const res = await seedDatabase();
    setBusy(false);
    setMsg(res.ok ? "Örnek veriler yüklendi." : (res.error ?? "Hata"));
  };

  return (
    <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-5">
      <h2 className="font-semibold text-primary-dark">Veritabanı başlangıç verisi</h2>
      <p className="mt-1 text-sm text-slate-600">
        Firestore boşsa örnek haber, il, yönetim ve IBAN kayıtlarını tek seferde yükler.
      </p>
      <button type="button" onClick={run} disabled={busy} className="btn-outline mt-3 disabled:opacity-60">
        <DatabaseZap size={16} /> {busy ? "Yükleniyor..." : "Örnek Verileri Yükle"}
      </button>
      {msg && <p className="mt-2 text-sm text-slate-700">{msg}</p>}
    </div>
  );
}
