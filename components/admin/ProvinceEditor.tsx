"use client";

import { useMemo, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import { getMergedDistricts } from "@/data/turkey-districts";
import { useProvinces } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { DistrictChair, Province } from "@/types";

function ProvinceForm({ initial }: { initial: Province }) {
  const [draft, setDraft] = useState<Province>(() => ({
    ...initial,
    districts: getMergedDistricts(initial.plate, initial.districts),
  }));
  const [state, setState] = useState<SaveState>(IDLE);
  const [districtSearch, setDistrictSearch] = useState("");
  const [newDistrictName, setNewDistrictName] = useState("");

  const update = (patch: Partial<Province>) => {
    setState(IDLE);
    setDraft((d) => ({ ...d, ...patch }));
  };

  const districts = draft.districts || [];

  const updateDistrict = (id: string, patch: Partial<DistrictChair>) => {
    setState(IDLE);
    setDraft((prev) => ({
      ...prev,
      districts: (prev.districts || []).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addCustomDistrict = () => {
    const name = newDistrictName.trim();
    if (!name) return;
    if (districts.some((d) => d.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr"))) return;
    setDraft((prev) => ({
      ...prev,
      districts: [
        ...(prev.districts || []),
        { id: `dist-${prev.plate}-${Date.now()}`, name, chairName: "", phone: "" },
      ],
    }));
    setNewDistrictName("");
    setState(IDLE);
  };

  const filteredDistricts = useMemo(() => {
    const q = districtSearch.trim().toLocaleLowerCase("tr");
    if (!q) return districts;
    return districts.filter(
      (d) =>
        d.name.toLocaleLowerCase("tr").includes(q) ||
        d.chairName.toLocaleLowerCase("tr").includes(q) ||
        d.phone.includes(q),
    );
  }, [districts, districtSearch]);

  const save = async () => {
    setState({ status: "saving" });
    const res = await saveSection("provinces", draft);
    setState(res.ok ? { status: "saved" } : { status: "error", message: res.error ?? "Hata" });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İl Başkanı" value={draft.chairName} onChange={(v) => update({ chairName: v })} />
        <Field label="Telefon" value={draft.phone} onChange={(v) => update({ phone: v })} />
        <Field label="E-posta" type="email" value={draft.email} onChange={(v) => update({ email: v })} />
        <div className="sm:col-span-2">
          <ImagePickerField
            label="İl Başkanı Fotoğrafı"
            recommendedSize="600 × 600 px (Kare 1:1)"
            value={draft.chairPhoto}
            onChange={(url) => update({ chairPhoto: url })}
          />
        </div>
        <div className="sm:col-span-2">
          <Field label="İl Binası Adresi" multiline value={draft.address} onChange={(v) => update({ address: v })} />
        </div>
      </div>

      {/* İlçe Başkanları Yönetimi */}
      <div className="rounded-2xl border border-blue-200/80 bg-blue-50/30 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-secondary" />
            <div>
              <h3 className="text-sm font-bold text-primary-dark">
                {draft.name} İlçe Başkanları ({districts.length} İlçe)
              </h3>
              <p className="text-xs text-slate-500">
                Haritada &ldquo;{String(draft.plate).padStart(2, "0")} · {draft.name}&rdquo; başlığına tıklandığında burada girdiğiniz ilçe başkanı ve telefon numaraları görünür.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="İlçe ara..."
              className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
          {filteredDistricts.map((dist) => (
            <div
              key={dist.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-xl border border-slate-200/90 bg-white p-2.5"
            >
              <div className="sm:col-span-3 font-bold text-xs text-primary-dark px-1 truncate">
                {dist.name}
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={dist.chairName}
                  onChange={(e) => updateDistrict(dist.id, { chairName: e.target.value })}
                  placeholder="İlçe Başkanı Ad Soyad"
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="tel"
                  value={dist.phone}
                  onChange={(e) => updateDistrict(dist.id, { phone: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60">
          <input
            type="text"
            value={newDistrictName}
            onChange={(e) => setNewDistrictName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomDistrict();
              }
            }}
            placeholder="Ek ilçe / temsilcilik adı..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={addCustomDistrict}
            disabled={!newDistrictName.trim()}
            className="inline-flex items-center gap-1 rounded-lg bg-white border border-primary/30 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition disabled:opacity-50"
          >
            <Plus size={13} /> İlçe Ekle
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={state.status === "saving"} className="btn-primary disabled:opacity-60">
          {state.status === "saving" ? "Kaydediliyor..." : "İl ve İlçe Bilgilerini Kaydet"}
        </button>
        <SaveStatus state={state} />
      </div>
    </div>
  );
}

export default function ProvinceEditor() {
  const { data: list, live } = useProvinces();
  const [plate, setPlate] = useState<number>(6);
  const current = list.find((p) => p.plate === plate) ?? list[0];

  return (
    <div>
      <PageHeader
        title="81 İl & İlçe Bilgileri Düzenle"
        description="İl başkanı, adres, iletişim ve tüm ilçelerin ilçe başkanı bilgilerini güncelleyin."
      />
      <Card>
        <label className="mb-5 block max-w-xs">
          <span className="mb-1 block text-xs font-semibold text-slate-600">İl</span>
          <select
            value={plate}
            onChange={(e) => setPlate(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {list.map((p) => (
              <option key={p.plate} value={p.plate}>
                {String(p.plate).padStart(2, "0")} – {p.name}
              </option>
            ))}
          </select>
        </label>
        <ProvinceForm key={`${current.plate}-${live}`} initial={current} />
      </Card>
    </div>
  );
}
