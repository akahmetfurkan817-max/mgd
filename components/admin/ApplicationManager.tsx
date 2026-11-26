"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { Card, PageHeader, SaveStatus, type SaveState, IDLE } from "@/components/admin/ui";
import CategoryManagerBar from "@/components/admin/CategoryManagerBar";
import { useApplications } from "@/hooks/useSiteData";
import { saveSection } from "@/lib/adminApi";
import type { ApplicationStatus, VolunteerApplication } from "@/types";

const STATUS_BADGES: Record<ApplicationStatus, { label: string; bg: string }> = {
  BEKLIYOR: { label: "Bekliyor", bg: "bg-amber-100 text-amber-800 border-amber-300" },
  ILETISIME_GECILDI: { label: "İletişime Geçildi", bg: "bg-blue-100 text-blue-800 border-blue-300" },
  ONAYLANDI: { label: "Onaylandı", bg: "bg-green-100 text-green-800 border-green-300" },
  REDDEDILDI: { label: "Reddedildi", bg: "bg-slate-100 text-slate-700 border-slate-300" },
};

export default function ApplicationManager() {
  const { data: applications } = useApplications();
  const [filter, setFilter] = useState<string>("TÜMÜ");
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SaveState>(IDLE);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === "TÜMÜ" || app.status === filter;
    const q = query.toLocaleLowerCase("tr");
    const matchesQuery =
      !q ||
      app.fullName.toLocaleLowerCase("tr").includes(q) ||
      app.city.toLocaleLowerCase("tr").includes(q) ||
      app.commission.toLocaleLowerCase("tr").includes(q);
    return matchesFilter && matchesQuery;
  });

  const handleStatusChange = async (app: VolunteerApplication, newStatus: ApplicationStatus) => {
    setUpdatingId(app.id);
    setState({ status: "saving" });

    const updated = { ...app, status: newStatus };
    const res = await saveSection("applications", updated);

    setUpdatingId(null);
    if (res.ok) {
      setState({ status: "saved" });
      setTimeout(() => setState(IDLE), 2000);
    } else {
      setState({ status: "error", message: res.error || "Güncelleme başarısız." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu başvuru kaydını silmek istediğinize emin misiniz?")) return;
    setState({ status: "saving" });

    const res = await fetch(`/api/admin/applications?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

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
        title="Üyelik / Gönüllü Başvuruları"
        description="Gelen başvuruları inceleyin, durumlarını güncelleyin ve başvuru formundaki birim/komisyon kategorilerini yönetin."
      />

      <CategoryManagerBar
        listKey="commissions"
        title="Üyelik / Başvuru Birim Kategorileri"
        placeholder="Yeni birim veya komisyon adı..."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Arama */}
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="İsim, il veya birim ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-secondary focus:outline-none"
          />
        </div>

        {/* Durum Sekmeleri */}
        <div className="flex flex-wrap gap-1.5">
          {(["TÜMÜ", "BEKLIYOR", "ILETISIME_GECILDI", "ONAYLANDI"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === st
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st === "TÜMÜ"
                ? `Tümü (${applications.length})`
                : st === "BEKLIYOR"
                ? `Bekleyenler (${applications.filter((a) => a.status === "BEKLIYOR").length})`
                : st === "ILETISIME_GECILDI"
                ? "İletişime Geçildi"
                : "Onaylandı"}
            </button>
          ))}
        </div>
      </div>

      <SaveStatus state={state} />

      {filtered.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">
            <UserCheck size={40} className="mx-auto mb-3 text-slate-400" />
            <p className="text-base font-semibold">Başvuru bulunamadı</p>
            <p className="text-xs text-slate-400 mt-1">
              Kriterlere uygun gönüllü başvurusu bulunmuyor.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app) => {
            const badge = STATUS_BADGES[app.status] || STATUS_BADGES.BEKLIYOR;
            const isUpdating = updatingId === app.id;

            return (
              <Card key={app.id}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-ink">{app.fullName}</h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-secondary">
                        {app.commission}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-secondary shrink-0" />
                        <a href={`tel:${app.phone}`} className="hover:underline font-mono">
                          {app.phone}
                        </a>
                      </div>
                      {app.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail size={14} className="text-secondary shrink-0" />
                          <a href={`mailto:${app.email}`} className="hover:underline truncate">
                            {app.email}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-secondary shrink-0" />
                        <span>{app.city}</span>
                      </div>
                      {app.university && (
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <GraduationCap size={14} className="text-secondary shrink-0" />
                          <span>{app.university}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={14} className="shrink-0" />
                        <span>
                          {new Date(app.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="mt-2 rounded-lg bg-surface p-3 text-xs text-slate-700 border border-slate-100">
                        <span className="font-semibold text-slate-900">Açıklama / Not:</span>{" "}
                        {app.notes}
                      </div>
                    )}
                  </div>

                  {/* Durum değiştirme ve aksiyonlar */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <span className="text-xs text-slate-500 hidden lg:block">Durumu Güncelle:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isUpdating || app.status === "BEKLIYOR"}
                        onClick={() => handleStatusChange(app, "BEKLIYOR")}
                        className="rounded px-2.5 py-1 text-xs font-medium border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-40"
                        title="Bekliyor olarak işaretle"
                      >
                        <Clock size={13} className="inline mr-1" /> Bekliyor
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating || app.status === "ILETISIME_GECILDI"}
                        onClick={() => handleStatusChange(app, "ILETISIME_GECILDI")}
                        className="rounded px-2.5 py-1 text-xs font-medium border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100 disabled:opacity-40"
                        title="İletişime geçildi olarak işaretle"
                      >
                        <Phone size={13} className="inline mr-1" /> Arandı
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating || app.status === "ONAYLANDI"}
                        onClick={() => handleStatusChange(app, "ONAYLANDI")}
                        className="rounded px-2.5 py-1 text-xs font-medium border border-green-300 bg-green-50 text-green-800 hover:bg-green-100 disabled:opacity-40"
                        title="Onaylandı olarak işaretle"
                      >
                        <CheckCircle2 size={13} className="inline mr-1" /> Onayla
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="rounded p-1.5 text-red-600 hover:bg-red-50 ml-1"
                        title="Başvuruyu Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
