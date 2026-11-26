"use client";

import { useState } from "react";
import { Calendar, Check, Copy, Download, Mail, Search, Trash2 } from "lucide-react";
import { Card, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useNewsletterSubscribers } from "@/hooks/useSiteData";

function formatTrDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function NewsletterManager() {
  const { data: subscribers, live } = useNewsletterSubscribers();
  const [query, setQuery] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const [state, setState] = useState<SaveState>(IDLE);

  const filtered = subscribers.filter((sub) => {
    const q = query.trim().toLowerCase();
    return !q || sub.email.toLowerCase().includes(q);
  });

  const handleCopyAll = async () => {
    if (filtered.length === 0) return;
    const text = filtered.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleExportCsv = () => {
    if (filtered.length === 0) return;
    const rows = [["E-posta", "Kayıt Tarihi"], ...filtered.map((s) => [s.email, formatTrDate(s.createdAt)])];
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mgd-ebulten-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu aboneyi listeden silmek istediğinize emin misiniz?")) return;
    setState({ status: "saving" });
    const res = await fetch(`/api/admin/newsletter?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2000);
    } else {
      setState({ status: "error", message: "Silme işlemi başarısız." });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="E-Bülten Aboneleri"
        description="Site altındaki Abone Ol formundan kayıt olan tüm e-posta adreslerini görüntüleyin, tek tıkla kopyalayın veya Excel (CSV) olarak indirin."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E-posta adresi ara..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SaveStatus state={state} />
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={filtered.length === 0}
            className="btn-outline text-xs py-2 px-3.5 disabled:opacity-50"
          >
            {copiedAll ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedAll ? "Tümü Kopyalandı" : `Tümünü Kopyala (${filtered.length})`}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="btn-primary text-xs py-2 px-3.5 disabled:opacity-50"
          >
            <Download size={14} />
            <span>Excel / CSV İndir</span>
          </button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-primary-dark flex items-center gap-2">
            <Mail size={16} className="text-secondary" />
            Kayıtlı Aboneler ({filtered.length})
          </h2>
          {!live && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Firebase bekleniyor
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center text-slate-500">
            <Mail size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Henüz kayıtlı e-bülten abonesi bulunmuyor.</p>
            <p className="text-xs text-slate-400 mt-1">
              Sitenin en altındaki &ldquo;Abone Ol&rdquo; kutusuna girilen e-postalar anında burada listelenir.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((sub) => (
              <li key={sub.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <a
                    href={`mailto:${sub.email}`}
                    className="block truncate text-sm font-bold text-ink hover:text-primary hover:underline"
                  >
                    {sub.email}
                  </a>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={12} />
                    <span>{formatTrDate(sub.createdAt)}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(sub.id)}
                  title="Aboneyi Sil"
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
