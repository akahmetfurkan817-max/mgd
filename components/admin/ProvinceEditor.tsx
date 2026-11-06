"use client";

import { useState } from "react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useProvinces } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { Province } from "@/types";

function ProvinceForm({ initial }: { initial: Province }) {
  const [draft, setDraft] = useState<Province>(initial);
  const [state, setState] = useState<SaveState>(IDLE);
  const update = (patch: Partial<Province>) => {
    setState(IDLE);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const save = async () => {
    setState({ status: "saving" });
    const res = await saveSection("provinces", draft);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İl Başkanı" value={draft.chairName} onChange={(v) => update({ chairName: v })} />
        <Field label="Fotoğraf Yolu (örn. /team/il-06.jpg)" value={draft.chairPhoto} onChange={(v) => update({ chairPhoto: v })} />
        <Field label="Telefon" value={draft.phone} onChange={(v) => update({ phone: v })} />
        <Field label="E-posta" type="email" value={draft.email} onChange={(v) => update({ email: v })} />
        <div className="sm:col-span-2">
          <Field label="İl Binası Adresi" multiline value={draft.address} onChange={(v) => update({ address: v })} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={save} disabled={state.status === "saving"} className="btn-primary disabled:opacity-60">
          {state.status === "saving" ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <SaveStatus state={state} />
      </div>
    </>
  );
}

export default function ProvinceEditor() {
  const { data: list, live } = useProvinces();
  const [plate, setPlate] = useState<number>(1);
  const current = list.find((p) => p.plate === plate) ?? list[0];

  return (
    <div>
      <PageHeader title="81 İl Bilgisi Düzenle" description="İl başkanı, adres ve iletişim bilgilerini güncelleyin." />
      <Card>
        <label className="mb-5 block max-w-xs">
          <span className="mb-1 block text-xs font-semibold text-slate-600">İl</span>
          <select
            value={plate}
            onChange={(e) => setPlate(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {list.map((p) => <option key={p.plate} value={p.plate}>{p.plate} – {p.name}</option>)}
          </select>
        </label>
        {/* key: il değişince veya canlı veri ilk geldiğinde form yeniden başlatılır */}
        <ProvinceForm key={`${current.plate}-${live}`} initial={current} />
      </Card>
    </div>
  );
}
