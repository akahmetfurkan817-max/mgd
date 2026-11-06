import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { COLLECTIONS } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  parseIbanList,
  parseLeader,
  parseNews,
  parsePresident,
  parseProvince,
  parsePublication,
  parseSocialPost,
  parseVideo,
  parseVolunteerApplication,
} from "@/lib/validators";
import type { AdminSection } from "@/types";

const SECTIONS: readonly AdminSection[] = [
  "slides",
  "media",
  "news",
  "provinces",
  "board",
  "iban",
  "applications",
  "publications",
  "layout",
  "content",
  "videos",
];

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

async function guard(section: string) {
  if (!SECTIONS.includes(section as AdminSection)) return { error: fail("Bölüm bulunamadı.", 404) };
  const user = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (!user) return { error: fail("Oturum gerekli.", 401) };
  if (!can(user.role, section as AdminSection)) return { error: fail("Bu işlem için yetkiniz yok.", 403) };
  const db = getAdminDb();
  if (!db) {
    return { error: fail("Firebase bağlı değil: .env.local içine FIREBASE_SERVICE_ACCOUNT_KEY ekleyin.", 503) };
  }
  return { db, section: section as AdminSection };
}

export async function PUT(req: Request, { params }: { params: { section: string } }) {
  const g = await guard(params.section);
  if ("error" in g) return g.error;
  const { db, section } = g;
  const body: unknown = await req.json().catch(() => null);
  const bad = fail("Geçersiz veri.", 400);

  switch (section) {
    case "slides": {
      const b = body as { list?: unknown } | unknown[] | null;
      const list = Array.isArray(b) ? b : Array.isArray((b as any)?.list) ? (b as any).list : null;
      if (!list) return bad;
      await db.collection(COLLECTIONS.settings).doc("slides").set({ list }, { merge: true });
      return NextResponse.json({ ok: true });
    }

    case "layout": {
      const b = body as { sections?: unknown } | null;
      if (!Array.isArray(b?.sections)) return bad;
      await db.collection(COLLECTIONS.settings).doc("site").set({ sections: b.sections }, { merge: true });
      return NextResponse.json({ ok: true });
    }

    case "content": {
      const b = body as Record<string, unknown> | null;
      if (!b || typeof b !== "object") return bad;
      await db.collection(COLLECTIONS.settings).doc("site").set(b, { merge: true });
      return NextResponse.json({ ok: true });
    }

    case "news": {
      const item = parseNews(body);
      if (!item) return bad;
      const ref = item.id ? db.collection(COLLECTIONS.news).doc(item.id) : db.collection(COLLECTIONS.news).doc();
      await ref.set({ ...item, id: ref.id });
      return NextResponse.json({ ok: true, id: ref.id });
    }

    case "publications": {
      const item = parsePublication(body);
      if (!item) return bad;
      const ref = item.id ? db.collection(COLLECTIONS.publications).doc(item.id) : db.collection(COLLECTIONS.publications).doc();
      await ref.set({ ...item, id: ref.id });
      return NextResponse.json({ ok: true, id: ref.id });
    }

    case "applications": {
      const app = parseVolunteerApplication(body);
      if (!app || !app.id) return bad;
      await db.collection(COLLECTIONS.applications).doc(app.id).set(app, { merge: true });
      return NextResponse.json({ ok: true });
    }

    case "provinces": {
      const p = parseProvince(body);
      if (!p) return bad;
      await db.collection(COLLECTIONS.provinces).doc(String(p.plate)).set(p);
      return NextResponse.json({ ok: true });
    }

    case "board": {
      const b = body as { president?: unknown; leaders?: unknown; leader?: unknown } | null;

      // Tek bir yönetici ekleme / güncelleme
      if (b?.leader) {
        const leader = parseLeader(b.leader);
        if (!leader) return bad;
        const ref = leader.id ? db.collection(COLLECTIONS.board).doc(leader.id) : db.collection(COLLECTIONS.board).doc();
        await ref.set({ ...leader, id: ref.id });
        return NextResponse.json({ ok: true, id: ref.id });
      }

      // Genel başkan güncelleme
      if (b?.president && !b?.leaders) {
        const president = parsePresident(b.president);
        if (!president) return bad;
        await db.collection(COLLECTIONS.settings).doc("baskan").set(president, { merge: true });
        return NextResponse.json({ ok: true });
      }

      // Toplu kaydetme
      const president = parsePresident(b?.president);
      const leaders = Array.isArray(b?.leaders) ? b.leaders.map(parseLeader) : null;
      if (!president || !leaders || leaders.some((l) => l === null)) return bad;
      const batch = db.batch();
      batch.set(db.collection(COLLECTIONS.settings).doc("baskan"), president);
      leaders.forEach((l) => l && batch.set(db.collection(COLLECTIONS.board).doc(l.id), l));
      await batch.commit();
      return NextResponse.json({ ok: true });
    }

    case "iban": {
      const list = parseIbanList((body as { list?: unknown } | null)?.list);
      if (!list || list.length === 0) return bad;
      await db.collection(COLLECTIONS.settings).doc("iban").set({ list });
      return NextResponse.json({ ok: true });
    }

    case "videos": {
      const b = body as { item?: unknown } | null;
      const vid = parseVideo(b?.item ?? body);
      if (!vid) return bad;
      const ref = vid.id ? db.collection(COLLECTIONS.videos).doc(vid.id) : db.collection(COLLECTIONS.videos).doc();
      await ref.set({ ...vid, id: ref.id });
      return NextResponse.json({ ok: true, id: ref.id });
    }
  }
}

export async function DELETE(req: Request, { params }: { params: { section: string } }) {
  const g = await guard(params.section);
  if ("error" in g) return g.error;
  const allowed = ["news", "publications", "applications", "board", "videos"];
  if (!allowed.includes(g.section)) return fail("Silme bu bölümde desteklenmiyor.", 405);
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return fail("id gerekli.", 400);

  const colMap: Record<string, string> = {
    news: COLLECTIONS.news,
    publications: COLLECTIONS.publications,
    applications: COLLECTIONS.applications,
    board: COLLECTIONS.board,
    videos: COLLECTIONS.videos,
  };

  await g.db.collection(colMap[g.section]).doc(id).delete();
  return NextResponse.json({ ok: true });
}
