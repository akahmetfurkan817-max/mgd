"use client";

import { useState } from "react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useIban } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { IbanInfo } from "@/types";

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
          {state.status === "saving" ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <SaveStatus state={state} />
      </div>
    </div>
  );
}

export default function IbanEditor() {
  const { data, live } = useIban();
  return (
    <div>
      <PageHeader title="IBAN Ayarları" description="Bağış modalında gösterilen resmî banka hesapları." />
      <IbanForm key={String(live)} initial={data} />
    </div>
  );
}
