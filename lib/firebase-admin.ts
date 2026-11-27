import { cert, getApp, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore as AdminFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { collection, deleteDoc, doc, getDoc, getDocs, limit as fsLimit, query, setDoc, writeBatch } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

export interface UnifiedDocSnap {
  id: string;
  exists: boolean;
  data: () => Record<string, unknown> | undefined;
}

export interface UnifiedQuerySnap {
  empty: boolean;
  docs: UnifiedDocSnap[];
}

export interface UnifiedDocRef {
  id: string;
  _docRef?: unknown;
  get: () => Promise<UnifiedDocSnap>;
  set: (data: unknown, options?: { merge?: boolean }) => Promise<unknown>;
  delete: () => Promise<unknown>;
}

export interface UnifiedCollectionRef {
  doc: (id?: string) => UnifiedDocRef;
  get: () => Promise<UnifiedQuerySnap>;
  limit: (n: number) => { get: () => Promise<UnifiedQuerySnap> };
}

export interface UnifiedDb {
  collection: (col: string) => UnifiedCollectionRef;
  batch: () => {
    set: (docRef: unknown, data: unknown, options?: { merge?: boolean }) => void;
    commit: () => Promise<void>;
  };
}

let adminDb: AdminFirestore | null = null;

function getAdminApp(): App | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw || raw.trim().length === 0) return null;
  if (getApps().length) return getApp();
  const account = JSON.parse(raw) as ServiceAccount & { private_key?: string };
  if (account.private_key) account.private_key = account.private_key.replace(/\\n/g, "\n");
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || undefined;
  return initializeApp({
    credential: cert(account),
    ...(storageBucket ? { storageBucket } : {}),
  });
}

export function getAdminStorageBucket() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (!bucketName) return null;
  try {
    const app = getAdminApp();
    if (!app) return null;
    return getStorage(app).bucket(bucketName);
  } catch (e) {
    console.warn("Firebase Storage başlatılamadı:", e);
    return null;
  }
}

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
        const app = getAdminApp();
        if (!app) return null;
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
            get: async () => {
              const s = await getDoc(dRef);
              return {
                id: s.id,
                exists: s.exists(),
                data: () => (s.exists() ? (s.data() as Record<string, unknown>) : undefined),
              };
            },
            set: async (data: unknown, options?: { merge?: boolean }) => {
              // @ts-expect-error setDoc supports record objects
              return setDoc(dRef, data, options?.merge ? { merge: true } : {});
            },
            delete: async () => {
              return deleteDoc(dRef);
            },
          };
        },
        get: async () => {
          const snap = await getDocs(collection(clientDb, colName));
          return {
            empty: snap.empty,
            docs: snap.docs.map((s) => ({
              id: s.id,
              exists: true,
              data: () => s.data() as Record<string, unknown>,
            })),
          };
        },
        limit: (n: number) => ({
          get: async () => {
            const snap = await getDocs(query(collection(clientDb, colName), fsLimit(n)));
            return {
              empty: snap.empty,
              docs: snap.docs.map((s) => ({
                id: s.id,
                exists: true,
                data: () => s.data() as Record<string, unknown>,
              })),
            };
          },
        }),
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
