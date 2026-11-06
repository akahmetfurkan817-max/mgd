"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { Card, PageHeader, SaveStatus, type SaveState, IDLE } from "@/components/admin/ui";
import { useSiteSettings } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import { DEFAULT_SECTIONS } from "@/data/site-settings";
import type { SectionBlock } from "@/types";

export default function LayoutBuilder() {
  const { data: settings } = useSiteSettings();
  const [sections, setSections] = useState<SectionBlock[]>(settings.sections || DEFAULT_SECTIONS);
  const [state, setState] = useState<SaveState>(IDLE);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Firestore'dan gelen veriyi yerel state'e al
  useEffect(() => {
    if (settings.sections && settings.sections.length > 0) {
      setSections(settings.sections);
    }
  }, [settings.sections]);

  const move = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setSections(updated);
  };

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Drag & Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...sections];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSections(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const saveLayout = async () => {
    setState({ status: "saving" });
    const res = await saveSection("layout", { sections });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Düzen kaydedilemedi." });
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Bölüm sıralaması ve görünürlüğü varsayılan haline döndürülsün mü?")) {
      setSections(DEFAULT_SECTIONS);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Sayfa Düzeni & Blok Yönetimi (WordPress Mantığı)"
          description="Ana sayfadaki tüm bölümleri elle sürükleyerek veya oklarla taşıyın, dilediğiniz bloğu gizleyin."
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            className="btn-outline text-xs px-3 py-2 flex items-center gap-1.5"
            title="Varsayılan sıraya döndür"
          >
            <RotateCcw size={14} /> Varsayılana Dön
          </button>
          <button
            type="button"
            onClick={saveLayout}
            disabled={state.status === "saving"}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 shadow-md"
          >
            <Save size={15} /> {state.status === "saving" ? "Kaydediliyor..." : "Sıralamayı Kaydet"}
          </button>
        </div>
      </div>

      <SaveStatus state={state} />

      <Card>
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Ana Sayfa Blok Sırası ({sections.length} Bölüm)
          </p>
          <span className="text-xs text-secondary flex items-center gap-1 font-medium">
            <Sparkles size={14} /> Sürükleyip bırakarak yeniden sıralayabilirsiniz
          </span>
        </div>

        <div className="space-y-3">
          {sections.map((sec, index) => (
            <div
              key={sec.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                draggedIndex === index
                  ? "border-secondary bg-blue-50/60 shadow-lg scale-[1.01]"
                  : sec.enabled
                  ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  : "border-slate-200 bg-slate-50/80 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1"
                  title="Sürüklemek için basılı tutun"
                >
                  <GripVertical size={20} />
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                    {sec.label}
                    {!sec.enabled && (
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Gizli
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">{sec.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Görünürlük Değiştir */}
                <button
                  type="button"
                  onClick={() => toggleVisibility(sec.id)}
                  className={`rounded-lg p-2 transition ${
                    sec.enabled
                      ? "text-secondary hover:bg-blue-50"
                      : "text-slate-400 hover:bg-slate-200"
                  }`}
                  title={sec.enabled ? "Bu bloğu gizle" : "Bu bloğu göster"}
                >
                  {sec.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>

                {/* Yukarı Taşı */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, "up")}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Yukarı Taşı"
                >
                  <ArrowUp size={18} />
                </button>

                {/* Aşağı Taşı */}
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => move(index, "down")}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Aşağı Taşı"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={saveLayout}
            disabled={state.status === "saving"}
            className="btn-primary"
          >
            <Save size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Sayfa Sırasını Kaydet"}
          </button>
        </div>
      </Card>
    </div>
  );
}
