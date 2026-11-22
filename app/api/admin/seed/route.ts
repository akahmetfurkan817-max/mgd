import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/firebase";
import { getAdminDb } from "@/lib/firebase-admin";
import { NEWS } from "@/data/news";
import { PROVINCES } from "@/data/provinces";
import { LEADERS, PRESIDENT } from "@/data/leaders";
import { IBAN_LIST } from "@/data/iban";
import { PUBLICATIONS } from "@/data/publications";
import { SAMPLE_APPLICATIONS } from "@/data/applications";
import { DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import { ONCU_SAHSIYETLER } from "@/data/oncu-sahsiyetler";

/** Örnek verileri Firestore'a yükler (yalnızca SuperAdmin). Var olan kayıtların üzerine yazar. */
export async function POST() {
  const user = await verifySession(cookies().get(SESSION_COOKIE)?.value);
  if (user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Yalnızca Süper Admin yapabilir." }, { status: 403 });
  }
  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Firebase bağlı değil (FIREBASE_SERVICE_ACCOUNT_KEY)." }, { status: 503 });
  }

  const batch = db.batch();
  NEWS.forEach((n) => batch.set(db.collection(COLLECTIONS.news).doc(n.id), n));
  PROVINCES.forEach((p) => batch.set(db.collection(COLLECTIONS.provinces).doc(String(p.plate)), p));
  LEADERS.forEach((l) => batch.set(db.collection(COLLECTIONS.board).doc(l.id), l));
  batch.set(db.collection(COLLECTIONS.settings).doc("baskan"), PRESIDENT);
  batch.set(db.collection(COLLECTIONS.settings).doc("iban"), { list: IBAN_LIST });
  batch.set(db.collection(COLLECTIONS.settings).doc("site"), DEFAULT_SITE_SETTINGS);
  batch.set(db.collection(COLLECTIONS.settings).doc("oncu_sahsiyetler"), { list: ONCU_SAHSIYETLER });
  PUBLICATIONS.forEach((pub) => batch.set(db.collection(COLLECTIONS.publications).doc(pub.id), pub));
  SAMPLE_APPLICATIONS.forEach((app) => batch.set(db.collection(COLLECTIONS.applications).doc(app.id), app));
  await batch.commit();
  return NextResponse.json({ ok: true });
}
