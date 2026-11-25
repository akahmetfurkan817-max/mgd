import type { AdminUser, RoleId } from "@/types";

export const SESSION_COOKIE = "mgd_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

const enc = new TextEncoder();

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET tanımlı değil (.env.local)");
  return s;
}

function toB64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  arr.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

interface SessionPayload extends AdminUser {
  exp: number;
}

/** İmzalı oturum belirteci üretir (Edge + Node uyumlu, Web Crypto). */
export async function createSession(user: AdminUser): Promise<string> {
  const payload: SessionPayload = { ...user, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS };
  const body = toB64Url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body));
  return `${body}.${toB64Url(sig)}`;
}

export async function verifySession(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(), fromB64Url(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64Url(body))) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    const { username, displayName, role } = payload;
    return { username, displayName, role };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

interface DemoUser extends AdminUser {
  password: string | undefined;
}

function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/i̇/g, "i");
}

/** İSKELET: Demo kullanıcılar. Üretimde veritabanı + parola hash'i (bcrypt/argon2) kullanın. */
function demoUsers(): DemoUser[] {
  return [
    {
      username: "admin",
      displayName: "Süper Admin",
      role: "SUPER_ADMIN" as RoleId,
      password: (process.env.ADMIN_SUPER_PASSWORD || "Super!2025").trim(),
    },
    {
      username: "editor",
      displayName: "Haber Editörü",
      role: "NEWS_EDITOR" as RoleId,
      password: (process.env.ADMIN_EDITOR_PASSWORD || "Editor!2025").trim(),
    },
    {
      username: "teskilat",
      displayName: "Teşkilat Sorumlusu",
      role: "ORG_MANAGER" as RoleId,
      password: (process.env.ADMIN_ORG_PASSWORD || "Teskilat!2025").trim(),
    },
  ];
}

export function authenticate(username: string, password: string): AdminUser | null {
  const normalized = normalizeUsername(username);
  const cleanPassword = password.trim();
  const u = demoUsers().find((x) => x.username === normalized);
  if (!u || !u.password || u.password !== cleanPassword) return null;
  return { username: u.username, displayName: u.displayName, role: u.role };
}
