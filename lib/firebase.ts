import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/** Firebase yapılandırması .env.local içindeki NEXT_PUBLIC_FIREBASE_* değişkenlerinden okunur. */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured: boolean = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const COLLECTIONS = {
  news: "haberler",
  provinces: "iller",
  board: "yonetim",
  settings: "ayarlar",
  applications: "basvurular",
  publications: "yayinlar",
  gallery: "galeri",
  social: "sosyal_medya",
  videos: "videolar",
  archive: "dosya_arsivi",
  media: "medya",
  mediaChunks: "medya_parcalari",
} as const;

let app: FirebaseApp | null = null;

/** Yapılandırma yoksa null döner; site örnek verilerle çalışmaya devam eder. */
export function getDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  app = app ?? (getApps().length ? getApp() : initializeApp(firebaseConfig));
  return getFirestore(app);
}
