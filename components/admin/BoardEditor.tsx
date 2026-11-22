"use client";

import { useState } from "react";
import { Plus, Save, Trash2, UserPlus, Users } from "lucide-react";
import { Card, Field, IDLE, PageHeader, SaveStatus, type SaveState } from "@/components/admin/ui";
import ImagePickerField from "@/components/admin/ImagePickerField";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import { useLeaders, usePresident } from "@/hooks/useSiteData";
import { deleteItem, saveSection } from "@/lib/adminApi";
import type { Leader, President } from "@/types";

const emptyLeader = (): Leader => ({
  id: "",
  name: "",
  title: "",
  photo: "",
  bio: "",
  group: "divan",
});

function BoardManager({
  initialPresident,
  initialLeaders,
}: {
  initialPresident: President;
  initialLeaders: Leader[];
}) {
  const [president, setPresident] = useState<President>(initialPresident);
  const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
  const [state, setState] = useState<SaveState>(IDLE);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newLeader, setNewLeader] = useState<Leader>(emptyLeader());

  const patch = (id: string, p: Partial<Leader>) => {
    setState(IDLE);
    setLeaders((prev) => prev.map((l) => (l.id === id ? { ...l, ...p } : l)));
  };

  const handleAddNewLeader = async () => {
    if (!newLeader.name.trim() || !newLeader.title.trim()) return;

    const created: Leader = {
      ...newLeader,
      id: `lead-${Date.now()}`,
    };

    const updatedList = [created, ...leaders];
    setLeaders(updatedList);
    setIsAddOpen(false);
    setNewLeader(emptyLeader());

    setState({ status: "saving" });
    const res = await saveSection("board", { leader: created });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Eklenirken hata oluştu." });
    }
  };

  const handleDeleteLeader = async (id: string, name: string) => {
    if (!window.confirm(`${name} isimli yöneticiyi kadrodan çıkarmak istediğinize emin misiniz?`)) return;

    const updatedList = leaders.filter((l) => l.id !== id);
    setLeaders(updatedList);

    setState({ status: "saving" });
    const res = await deleteItem("board", id);
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Silme başarısız." });
    }
  };

  const handleSaveAll = async () => {
    setState({ status: "saving" });
    const res = await saveSection("board", { president, leaders });
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2500);
    } else {
      setState({ status: "error", message: res.error || "Hata oluştu." });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-dark">
            Başkanlık Divanı ({leaders.length} Üye)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Genel Başkan ve Başkanlık Divanı üyelerini, fotoğraflarını, görevlerini ve özgeçmişlerini yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            <UserPlus size={15} /> Yeni Yönetici Ekle
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={state.status === "saving"}
            className="btn-outline text-xs px-4 py-2"
          >
            <Save size={15} /> {state.status === "saving" ? "Kaydediliyor..." : "Tümünü Kaydet"}
          </button>
        </div>
      </div>

      <SaveStatus state={state} />

      {/* GENEL BAŞKAN */}
      <Card>
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
          <Avatar name={president.name} src={president.photo} size={52} rounded="lg" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
              Genel Başkanlık Makamı
            </span>
            <h3 className="text-base font-bold text-ink">{president.name}</h3>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Genel Başkan Adı Soyadı"
            value={president.name}
            onChange={(v) => setPresident({ ...president, name: v })}
          />
          <Field
            label="Unvan / Görev"
            value={president.title}
            onChange={(v) => setPresident({ ...president, title: v })}
          />
          <div className="sm:col-span-2">
            <ImagePickerField
              label="Genel Başkan Fotoğrafı"
              value={president.photo}
              onChange={(url) => setPresident({ ...president, photo: url })}
            />
          </div>
          <Field
            label="Resmî E-Posta"
            value={president.email || ""}
            onChange={(v) => setPresident({ ...president, email: v })}
          />
          <Field
            label="X (Twitter) URL"
            value={president.xUrl || ""}
            onChange={(v) => setPresident({ ...president, xUrl: v })}
          />
          <div className="sm:col-span-2">
            <Field
              label="Instagram URL"
              value={president.instagramUrl || ""}
              onChange={(v) => setPresident({ ...president, instagramUrl: v })}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Genel Başkanın Mesajı"
              multiline
              value={president.message}
              onChange={(v) => setPresident({ ...president, message: v })}
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Özgeçmiş & Biyografi (Her paragrafı yeni satıra yazabilirsiniz)"
              multiline
              value={president.bio}
              onChange={(v) => setPresident({ ...president, bio: v })}
            />
          </div>
        </div>
      </Card>

      {/* BAŞKANLIK DİVANI ÜYELERİ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
          <h3 className="font-bold text-primary-dark text-lg flex items-center gap-2">
            <Users size={18} className="text-gold" /> Başkanlık Divanı Üyeleri ({leaders.length})
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {leaders.map((l) => (
            <div
              key={l.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={l.name} src={l.photo} size={44} rounded="lg" />
                  <div>
                    <h4 className="font-bold text-sm text-ink">{l.name || "İsimsiz"}</h4>
                    <span className="text-[11px] font-semibold text-gold">{l.title || "Başkanlık Divanı"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteLeader(l.id, l.name)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Kişiyi Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <Field label="Ad Soyad" value={l.name} onChange={(v) => patch(l.id, { name: v })} />
              <Field label="Görev / Unvan" value={l.title} onChange={(v) => patch(l.id, { title: v })} />
              <ImagePickerField
                label="Yönetici Fotoğrafı"
                value={l.photo}
                onChange={(url) => patch(l.id, { photo: url })}
              />
              <Field
                label="Özgeçmiş / Biyografi"
                multiline
                value={l.bio}
                onChange={(v) => patch(l.id, { bio: v })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={state.status === "saving"}
          className="btn-primary"
        >
          <Save size={16} /> {state.status === "saving" ? "Kaydediliyor..." : "Tüm Yönetim Kurulunu Kaydet"}
        </button>
      </div>

      {/* YENİ YÖNETİCİ EKLEME MODALI */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Yeni Başkanlık Divanı Üyesi Ekle">
        <div className="space-y-4 pt-2">
          <Field
            label="Ad Soyad *"
            value={newLeader.name}
            onChange={(v) => setNewLeader({ ...newLeader, name: v })}
          />
          <Field
            label="Görev / Unvan *"
            value={newLeader.title}
            onChange={(v) => setNewLeader({ ...newLeader, title: v })}
          />
          <ImagePickerField
            label="Fotoğraf"
            value={newLeader.photo}
            onChange={(url) => setNewLeader({ ...newLeader, photo: url })}
          />
          <Field
            label="Özgeçmiş & Biyografi"
            multiline
            value={newLeader.bio}
            onChange={(v) => setNewLeader({ ...newLeader, bio: v })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddOpen(false)} className="btn-outline text-xs">
              Vazgeç
            </button>
            <button type="button" onClick={handleAddNewLeader} className="btn-primary text-xs">
              <Plus size={15} /> Divana Ekle
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function BoardEditor() {
  const pres = usePresident();
  const lead = useLeaders();

  return (
    <div>
      <PageHeader
        title="Başkanlık Divanı Yönetimi"
        description="Genel Başkan mesajını, fotoğrafını, biyografisini ve Başkanlık Divanı üyelerini yönetin."
      />
      <BoardManager
        key={`${pres.live}-${lead.live}`}
        initialPresident={pres.data}
        initialLeaders={lead.data}
      />
    </div>
  );
}
