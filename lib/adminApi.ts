import type { AdminSection } from "@/types";

export interface ApiResult {
  ok: boolean;
  error?: string;
}

async function parse(res: Response): Promise<ApiResult> {
  if (res.ok) return { ok: true };
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  return { ok: false, error: data.error ?? `İşlem başarısız (${res.status}).` };
}

export async function saveSection(section: AdminSection, body: unknown): Promise<ApiResult> {
  const res = await fetch(`/api/admin/${section}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parse(res);
}

export async function deleteNews(id: string): Promise<ApiResult> {
  return parse(await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: "DELETE" }));
}

export async function deleteItem(section: AdminSection, id: string): Promise<ApiResult> {
  return parse(await fetch(`/api/admin/${section}?id=${encodeURIComponent(id)}`, { method: "DELETE" }));
}

export async function seedDatabase(): Promise<ApiResult> {
  return parse(await fetch("/api/admin/seed", { method: "POST" }));
}
