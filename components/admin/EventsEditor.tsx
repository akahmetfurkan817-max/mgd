"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Pencil, Plus, RefreshCw, Trash2, User } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import { useEvents } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { EVENTS } from "@/data/events";
import type { EventItem } from "@/types";

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const CATEGORIES: EventItem["category"][] = [
  "İl Kongresi",
  "Üniversite Buluşması",
  "Gençlik Şöleni",
  "İl Divanı",
  "Basın Toplantısı",
];

function isoToTrDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const year = Number(m[1]);
  const monthIdx = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (monthIdx < 0 || monthIdx > 11) return iso;
  return `${day} ${TR_MONTHS[monthIdx]} ${year}`;
}

function trDateToIso(tr: string): string {
  const parts = tr.trim().split(/\s+/);
  if (parts.length < 3) return new Date().toISOString().slice(0, 10);
  const day = String(parseInt(parts[0], 10) || 1).padStart(2, "0");
  const mIdx = TR_MONTHS.indexOf(parts[1]);
  const year = parseInt(parts[2], 10) || new Date().getFullYear();
  if (mIdx < 0) return new Date().toISOString().slice(0, 10);
  return `${year}-${String(mIdx + 1).padStart(2, "0")}-${day}`;
}

const emptyEvent = (): EventItem => ({
  id: "",
  title: "",
  date: isoToTrDate(new Date().toISOString().slice(0, 10)),
  time: "14:00",
  city: "Ankara",
  venue: "",
  category: "İl Kongresi",
  speaker: "Ahmet Özvatan (Genel Başkan)",
  description: "",
  status: "Yaklaşan",
});

export default function EventsEditor() {
  const { data: liveEvents, live } = useEvents();
  const [items, setItems] = useState<EventItem[]>(liveEvents);
  const [form, setForm] = useState<EventItem>(emptyEvent);
  const [isoDate, setIsoDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [state, setState] = useState<SaveState>(IDLE);

  useEffect(() => {
    if (live) {
      setItems(liveEvents);
    }
  }, [live, liveEvents]);

  const persist = async (next: EventItem[]) => {
    setItems(next);
    setState({ status: "saving" });
    const res = await saveSection("events", { list: next });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Kaydedilemedi." });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setState({ status: "error", message: "Program başlığı zorunludur." });
      return;
    }
    const clean: EventItem = {
      ...form,
      id: form.id || `evt-${Date.now()}`,
      title: form.title.trim(),
      date: isoToTrDate(isoDate),
      time: (form.time || "").trim(),
      city: form.city.trim() || "Ankara",
      venue: form.venue.trim() || "Genel Merkez",
      speaker: form.speaker.trim() || "MGD Genel Merkez",
      description: form.description.trim(),
    };

    const exists = items.some((x) => x.id === clean.id);
    const next = exists ? items.map((x) => (x.id === clean.id ? clean : x)) : [clean, ...items];
    await persist(next);
    setForm(emptyEvent());
    setIsoDate(new Date().toISOString().slice(0, 10));
  };

  const handleEdit = (evt: EventItem) => {
    setForm(evt);
    setIsoDate(trDateToIso(evt.date));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu program takvimden kalıcı olarak silinsin mi?")) return;
    const next = items.filter((x) => x.id !== id);
    if (form.id === id) {
      setForm(emptyEvent());
      setIsoDate(new Date().toISOString().slice(0, 10));
    }
    await persist(next);
  };

  const handleReset = async () => {
    if (!window.confirm("Takvim varsayılan örnek programlara sıfırlansın mı?")) return;
    await persist(EVENTS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="Program Takvimi Yönetimi"
          description="Ana sayfada ve Program Takvimi sayfasında görünen tüm etkinlikleri ekleyin, düzenleyin veya silin."
        />
        <button type="button" onClick={handleReset} className="btn-outline text-xs py-2 self-start">
          <RefreshCw size={14} /> Varsayılana Dön
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Sol: Form */}
        <div className="lg:col-span-5">
          <Card className="sticky top-6">
            <h2 className="mb-4 text-base font-bold text-primary flex items-center gap-2">
              <Calendar size={18} />
              {form.id ? "Programı Düzenle" : "Yeni Program Ekle"}
            </h2>

            <form onSubmit={handleSave} className="space-y-3.5">
              <Field
                label="Program Başlığı *"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="Örn: Ankara İl Gençlik Şöleni"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">Tarih *</span>
                  <input
                    type="date"
                    value={isoDate}
                    onChange={(e) => {
                      setIsoDate(e.target.value);
                      setForm({ ...form, date: isoToTrDate(e.target.value) });
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </label>
                <Field
                  label="Saat"
                  value={form.time || ""}
                  onChange={(v) => setForm({ ...form, time: v })}
                  placeholder="14:00"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Şehir *"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                  placeholder="Ankara"
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">Kategori</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as EventItem["category"] })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <Field
                label="Mekân / Salon"
                value={form.venue}
                onChange={(v) => setForm({ ...form, venue: v })}
                placeholder="Örn: Atatürk Spor Salonu"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Konuşmacı / Heyet"
                  value={form.speaker}
                  onChange={(v) => setForm({ ...form, speaker: v })}
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">Durum</span>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as EventItem["status"] })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="Yaklaşan">Yaklaşan</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                </label>
              </div>

              <Field
                label="Açıklama"
                multiline
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                placeholder="Program detaylarını yazın..."
              />

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={state.status === "saving"}
                  className="btn-primary text-xs px-5 py-2.5 disabled:opacity-60"
                >
                  <Plus size={15} /> {state.status === "saving" ? "Kaydediliyor..." : form.id ? "Güncelle" : "Takvime Ekle"}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyEvent());
                      setIsoDate(new Date().toISOString().slice(0, 10));
                    }}
                    className="btn-outline text-xs"
                  >
                    Vazgeç
                  </button>
                )}
                <SaveStatus state={state} />
              </div>
            </form>
          </Card>
        </div>

        {/* Sağ: Liste */}
        <div className="lg:col-span-7">
          <Card>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-primary">Kayıtlı Programlar ({items.length})</h2>
            </div>

            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                Takvimde henüz program bulunmuyor. Soldaki formdan yeni program ekleyebilirsiniz.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((evt) => (
                  <li key={evt.id} className="flex items-start justify-between gap-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                          {evt.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            evt.status === "Yaklaşan"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-ink">{evt.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} className="text-primary" /> {evt.date}
                        </span>
                        {evt.time && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} className="text-primary" /> {evt.time}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} className="text-primary" /> {evt.city} — {evt.venue}
                        </span>
                        {evt.speaker && (
                          <span className="inline-flex items-center gap-1">
                            <User size={12} className="text-primary" /> {evt.speaker}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(evt)}
                        className="rounded-lg p-2 text-primary hover:bg-surface"
                        title="Düzenle"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
