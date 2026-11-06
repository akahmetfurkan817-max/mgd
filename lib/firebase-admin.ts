import { cert, getApp, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore as AdminFirestore } from "firebase-admin/firestore";
import { collection, deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export interface UnifiedDocRef {
  id: string;
  _docRef?: unknown;
  set: (data: unknown, options?: { merge?: boolean }) => Promise<unknown>;
  delete: () => Promise<unknown>;
}

export interface UnifiedDb {
  collection: (col: string) => {
    doc: (id?: string) => UnifiedDocRef;
  };
  batch: () => {
    set: (docRef: unknown, data: unknown, options?: { merge?: boolean }) => void;
    commit: () => Promise<void>;
  };
}

let adminDb: AdminFirestore | null = null;

/**
 * Yazma işlemleri öncelikle FIREBASE_SERVICE_ACCOUNT_KEY ile (Admin SDK),
 * bulunmadığı takdirde web yapılandırması (Client SDK adapter) üzerinden yürütülür.
 */
export function getAdminDb(): UnifiedDb | null {
  // 1. Servis hesabı JSON anahtarı varsa Firebase Admin SDK kullan
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw && raw.trim().length > 0) {
    try {
      if (!adminDb) {
        const account = JSON.parse(raw) as ServiceAccount & { private_key?: string };
        if (account.private_key) account.private_key = account.private_key.replace(/\\n/g, "\n");
        const app = getApps().length ? getApp() : initializeApp({ credential: cert(account) });
        const instance = getFirestore(app);
        instance.settings({ ignoreUndefinedProperties: true });
        adminDb = instance;
      }
      return adminDb as unknown as UnifiedDb;
    } catch (e) {
      console.warn("Firebase Admin başlatılamadı, web istemcisine geçiliyor:", e);
    }
  }

  // 2. Servis hesabı yoksa ama Web API bilgileri tanımlıysa Client SDK adapter kullan
  if (isFirebaseConfigured) {
    const clientDb = getDb();
    if (!clientDb) return null;

    const adapter: UnifiedDb = {
      collection: (colName: string) => ({
        doc: (id?: string) => {
          const dRef = id ? doc(clientDb, colName, id) : doc(collection(clientDb, colName));
          return {
            id: dRef.id,
            _docRef: dRef,
            set: async (data: unknown, options?: { merge?: boolean }) => {
              // @ts-expect-error setDoc supports record objects
              return setDoc(dRef, data, options?.merge ? { merge: true } : {});
            },
            delete: async () => {
              return deleteDoc(dRef);
            },
          };
        },
      }),
      batch: () => {
        const b = writeBatch(clientDb);
        return {
          set: (target: unknown, data: unknown, options?: { merge?: boolean }) => {
            const ref = (target as { _docRef?: unknown })?._docRef || target;
            // @ts-expect-error writeBatch set supports document references
            b.set(ref, data, options?.merge ? { merge: true } : {});
          },
          commit: async () => {
            await b.commit();
          },
        };
      },
    };
    return adapter;
  }

  return null;
}
