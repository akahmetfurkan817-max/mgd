"use client";

import { useState } from "react";
import { HeartHandshake, Plus, Trash2 } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useIban, useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { DonationPurposeItem, IbanInfo } from "@/types";

function IbanForm({ initial }: { initial: IbanInfo[] }) {
  const [list, setList] = useState<IbanInfo[]>(initial);
  const [state, setState] = useState<SaveState>(IDLE);

  const patch = (i: number, p: Partial<IbanInfo>) => {
    setState(IDLE);
    setList((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  };

  const save = async () => {
    setState({ status: "saving" });
    const res = await saveSection("iban", { list });
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
  };

  return (
    <div className="space-y-6">
      {list.map((acc, i) => (
        <Card key={i}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Banka" value={acc.bank} onChange={(v) => patch(i, { bank: v })} />
            <Field label="Hesap Sahibi" value={acc.accountHolder} onChange={(v) => patch(i, { accountHolder: v })} />
            <Field label="IBAN" value={acc.iban} onChange={(v) => patch(i, { iban: v })} />
            <Field label="Not" value={acc.note ?? ""} onChange={(v) => patch(i, { note: v })} />
          </div>
        </Card>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={state.status === "saving"} className="btn-primary disabled:opacity-60">
          {state.status === "saving" ? "Kaydediliyor..." : "IBAN Bilgilerini Kaydet"}
        </button>
        <SaveStatus state={state} />
      </div>
    </div>
  );
}

function DonationCategoriesEditor() {
  const { data: settings } = useSiteSettings();
  const purposes = settings.categories?.donationPurposes || [];
  const [draft, setDraft] = useState<DonationPurposeItem>({ id: "", title: "", desc: "", note: "" });
  const [state, setState] = useState<SaveState>(IDLE);

  const persist = async (next: DonationPurposeItem[]) => {
    setState({ status: "saving" });
    const res = await saveSection("content", {
      categories: {
        ...settings.categories,
        donationPurposes: next,
      },
    });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2000);
      return true;
    }
    setState({ status: "error", message: res.error || "Kaydedilemedi." });
    return false;
  };

  const addPurpose = async () => {
    if (!draft.title.trim()) return;
    const item: DonationPurposeItem = {
      id: `don-${Date.now()}`,
      title: draft.title.trim(),
      desc: draft.desc.trim() || `${draft.title.trim()} çalışmalarına destek olun.`,
      note: draft.note.trim() || `${draft.title.trim()} Bağışı`,
    };
    const ok = await persist([...purposes, item]);
    if (ok) setDraft({ id: "", title: "", desc: "", note: "" });
  };

  const removePurpose = async (id: string) => {
    if (purposes.length <= 1) return;
    await persist(purposes.filter((p) => p.id !== id));
  };

  return (
    <Card className="mt-8">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <HeartHandshake size={18} className="text-secondary" />
          <div>
            <h2 className="text-base font-bold text-primary-dark">Bağış Kategorileri / Alanları ({purposes.length})</h2>
            <p className="text-xs text-slate-500">Bağış sayfasındaki 1. adım seçeneklerini ekleyin veya kaldırın.</p>
          </div>
        </div>
        <SaveStatus state={state} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-5">
        {purposes.map((p) => (
          <div key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">{p.title}</p>
              <p className="text-xs text-slate-600 mt-0.5">{p.desc}</p>
              <p className="text-[11px] font-semibold text-primary mt-1">Açıklama: {p.note}</p>
            </div>
            <button
              type="button"
              onClick={() => removePurpose(p.id)}
              disabled={purposes.length <= 1 || state.status === "saving"}
              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40 shrink-0"
              title="Kaldır"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-3">
        <p className="text-xs font-bold text-primary-dark">Yeni Bağış Kategorisi Ekle</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Kategori Başlığı *"
            value={draft.title}
            onChange={(v) => setDraft({ ...draft, title: v })}
            placeholder="Örn: Kurban / Ramazan"
          />
          <Field
            label="Havale Açıklama Notu"
            value={draft.note}
            onChange={(v) => setDraft({ ...draft, note: v })}
            placeholder="Örn: Ramazan Bağışı"
          />
          <Field
            label="Kısa Açıklama"
            value={draft.desc}
            onChange={(v) => setDraft({ ...draft, desc: v })}
            placeholder="Bağış alanı hakkında kısa bilgi"
          />
        </div>
        <button
          type="button"
          onClick={addPurpose}
          disabled={!draft.title.trim() || state.status === "saving"}
          className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
        >
          <Plus size={14} /> Bağış Kategorisi Ekle
        </button>
      </div>
    </Card>
  );
}

export default function IbanEditor() {
  const { data, live } = useIban();
  return (
    <div>
      <PageHeader title="IBAN & Bağış Ayarları" description="Resmî banka hesapları ve bağış sayfasındaki bağış kategorileri." />
      <IbanForm key={String(live)} initial={data} />
      <DonationCategoriesEditor />
    </div>
  );
}
