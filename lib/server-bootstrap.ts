import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { COLLECTIONS, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { cert, getApp, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore as getAdminFirestore, type Firestore as AdminFirestore } from "firebase-admin/firestore";

const DOC_TARGETS: readonly { col: string; id: string }[] = [
  { col: COLLECTIONS.settings, id: "site" },
  { col: COLLECTIONS.settings, id: "baskan" },
  { col: COLLECTIONS.settings, id: "iban" },
  { col: COLLECTIONS.settings, id: "slides" },
  { col: COLLECTIONS.settings, id: "oncu_sahsiyetler" },
];

const COL_TARGETS: readonly string[] = [
  COLLECTIONS.news,
  COLLECTIONS.provinces,
  COLLECTIONS.board,
  COLLECTIONS.publications,
  COLLECTIONS.videos,
  COLLECTIONS.archive,
  COLLECTIONS.social,
];

function getServerAdminFirestore(): AdminFirestore | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw || raw.trim().length === 0) return null;
  try {
    const app = getApps().length
      ? getApp()
      : (() => {
          const account = JSON.parse(raw) as ServiceAccount & { private_key?: string };
          if (account.private_key) account.private_key = account.private_key.replace(/\\n/g, "\n");
          return initializeApp({ credential: cert(account) });
        })();
    return getAdminFirestore(app);
  } catch {
    return null;
  }
}

function toPlainJson<T>(val: T): T {
  try {
    return JSON.parse(JSON.stringify(val));
  } catch {
    return val;
  }
}

async function fetchAllFromFirebase(): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};

  const adminDb = getServerAdminFirestore();
  if (adminDb) {
    await Promise.allSettled([
      ...DOC_TARGETS.map(async ({ col, id }) => {
        const snap = await adminDb.collection(col).doc(id).get();
        if (snap.exists) {
          out[`mgd_doc_${col}_${id}`] = toPlainJson(snap.data());
        }
      }),
      ...COL_TARGETS.map(async (colName) => {
        const snap = await adminDb.collection(colName).get();
        if (!snap.empty) {
          out[`mgd_col_${colName}`] = toPlainJson(snap.docs.map((d) => d.data()));
        }
      }),
    ]);
    return out;
  }

  if (!isFirebaseConfigured) return out;
  const clientDb = getDb();
  if (!clientDb) return out;

  await Promise.allSettled([
    ...DOC_TARGETS.map(async ({ col, id }) => {
      const snap = await getDoc(doc(clientDb, col, id));
      if (snap.exists()) {
        out[`mgd_doc_${col}_${id}`] = toPlainJson(snap.data());
      }
    }),
    ...COL_TARGETS.map(async (colName) => {
      const snap = await getDocs(collection(clientDb, colName));
      if (!snap.empty) {
        out[`mgd_col_${colName}`] = toPlainJson(snap.docs.map((d) => d.data()));
      }
    }),
  ]);

  return out;
}

/**
 * Sunucu tarafında (SSR) canlı Firestore verilerini tek seferde çeker.
 * Böylece sayfa yenilendiğinde eski örnek verinin 0.1 saniye görünüp değişmesi (FOUC/flash) tamamen engellenir.
 */
export async function loadServerSiteCache(): Promise<Record<string, unknown>> {
  try {
    const timeout = new Promise<Record<string, unknown>>((resolve) =>
      setTimeout(() => resolve({}), 3500),
    );
    return await Promise.race([fetchAllFromFirebase(), timeout]);
  } catch (err) {
    console.warn("Sunucu Firestore önbellek yüklemesi atlandı:", err);
    return {};
  }
}
