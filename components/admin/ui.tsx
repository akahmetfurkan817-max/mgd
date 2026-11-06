"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Database } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      {isFirebaseConfigured ? (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-primary">
          <Database size={14} className="shrink-0" /> Değişiklikler Firestore’a kaydedilir ve sitede anında yansır.
        </p>
      ) : (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertTriangle size={14} className="shrink-0" /> Firebase yapılandırılmamış (.env.local). Kayıt işlemleri çalışmaz.
        </p>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}

export function Field({ label, value, onChange, multiline, type = "text" }: FieldProps) {
  const cls = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export type SaveState = { status: "idle" | "saving" | "saved" } | { status: "error"; message: string };

export const IDLE: SaveState = { status: "idle" };

export function SaveStatus({ state }: { state: SaveState }) {
  if (state.status === "saved")
    return (
      <span className="flex items-center gap-1 text-sm text-green-700">
        <CheckCircle2 size={16} /> Kaydedildi
      </span>
    );
  if (state.status === "error")
    return (
      <span role="alert" className="text-sm text-red-700">
        {state.message}
      </span>
    );
  return null;
}
