"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { COLLECTIONS, getDb } from "@/lib/firebase";
import { NEWS } from "@/data/news";
import { PROVINCES } from "@/data/provinces";
import { LEADERS, PRESIDENT } from "@/data/leaders";
import { IBAN_LIST } from "@/data/iban";
import { PUBLICATIONS } from "@/data/publications";
import { SAMPLE_APPLICATIONS } from "@/data/applications";
import { SOCIAL_POSTS } from "@/data/social";
import { DEFAULT_SECTIONS, DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import type {
  IbanInfo,
  Leader,
  NewsItem,
  President,
  Province,
  Publication,
  SiteSettings,
  SocialPost,
  VolunteerApplication,
} from "@/types";

interface Live<T> {
  data: T;
  /** Firestore'dan canlı veri geldi mi (false: örnek veri gösteriliyor) */
  live: boolean;
}

function useCollection<T>(name: string, seed: T[], combine: (remote: T[], seed: T[]) => T[]): Live<T[]> {
  const [state, setState] = useState<Live<T[]>>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`mgd_col_${name}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return { data: combine(parsed, seed), live: true };
          }
        }
      } catch {}
    }
    return { data: seed, live: false };
  });

  useEffect(() => {
    const cacheKey = `mgd_col_${name}`;
    const db = getDb();
    if (!db) return;
    return onSnapshot(
      collection(db, name),
      (snap) => {
        const remote = snap.docs.map((d) => d.data() as T);
        setState({ data: combine(remote, seed), live: true });
        try {
          localStorage.setItem(cacheKey, JSON.stringify(remote));
        } catch {}
      },
      (err) => console.error(`${name} dinlenemedi:`, err),
    );
  }, [name, seed, combine]);

  return state;
}

function useDocument<T>(col: string, id: string, seed: T): Live<T> {
  const [state, setState] = useState<Live<T>>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`mgd_doc_${col}_${id}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            return { data: { ...seed, ...parsed }, live: true };
          }
        }
      } catch {}
    }
    return { data: seed, live: false };
  });

  useEffect(() => {
    const cacheKey = `mgd_doc_${col}_${id}`;
    const db = getDb();
    if (!db) return;
    return onSnapshot(
      doc(db, col, id),
      (snap) => {
        if (snap.exists()) {
          const val = { ...seed, ...snap.data() } as T;
          setState({ data: val, live: true });
          try {
            localStorage.setItem(cacheKey, JSON.stringify(snap.data()));
          } catch {}
        } else {
          setState({ data: seed, live: true });
        }
      },
      (err) => console.error(`${col}/${id} dinlenemedi:`, err),
    );
  }, [col, id, seed]);

  return state;
}

/** Uzak kayıtları örnek verinin üzerine bindirir; sıra örnek veriye göre korunur. */
function overlay<T>(key: (x: T) => string | number) {
  return (remote: T[], seed: T[]): T[] => {
    const map = new Map<string | number, T>(seed.map((s) => [key(s), s]));
    remote.forEach((r) => map.set(key(r), { ...map.get(key(r)), ...r }));
    return Array.from(map.values());
  };
}

const combineProvinces = overlay<Province>((p) => p.plate);

// Yönetim kurulu: Veritabanında kayıt varsa doğrudan veritabanındakileri kullan (ekleme/çıkarma tam yansısın)
const combineLeaders = (remote: Leader[], seed: Leader[]): Leader[] => {
  if (!remote || remote.length === 0) return seed;
  return remote;
};

const combineNews = (remote: NewsItem[]): NewsItem[] =>
  [...remote].sort((a, b) => b.date.localeCompare(a.date));

const combinePublications = (remote: Publication[], seed: Publication[]): Publication[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => b.date.localeCompare(a.date));
};

const combineApplications = (remote: VolunteerApplication[], seed: VolunteerApplication[]): VolunteerApplication[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export function useNews(): Live<NewsItem[]> {
  return useCollection<NewsItem>(COLLECTIONS.news, NEWS, combineNews);
}
export function useProvinces(): Live<Province[]> {
  return useCollection<Province>(COLLECTIONS.provinces, PROVINCES, combineProvinces);
}
export function useLeaders(): Live<Leader[]> {
  return useCollection<Leader>(COLLECTIONS.board, LEADERS, combineLeaders);
}
export function usePresident(): Live<President> {
  return useDocument<President>(COLLECTIONS.settings, "baskan", PRESIDENT);
}
export function useIban(): Live<IbanInfo[]> {
  const { data, live } = useDocument<{ list: IbanInfo[] }>(COLLECTIONS.settings, "iban", IBAN_SEED);
  return { data: data.list, live };
}

export function usePublications(): Live<Publication[]> {
  return useCollection<Publication>(COLLECTIONS.publications, PUBLICATIONS, combinePublications);
}

export function useApplications(): Live<VolunteerApplication[]> {
  return useCollection<VolunteerApplication>(COLLECTIONS.applications, [], combineApplications);
}

const combineSocialPosts = (remote: SocialPost[], seed: SocialPost[]): SocialPost[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
};

export function useSocialPosts(): Live<SocialPost[]> {
  return useCollection<SocialPost>(COLLECTIONS.social, SOCIAL_POSTS, combineSocialPosts);
}

export function useSiteSettings(): Live<SiteSettings> {
  const { data, live } = useDocument<SiteSettings>(COLLECTIONS.settings, "site", DEFAULT_SITE_SETTINGS);
  return {
    data: {
      ...DEFAULT_SITE_SETTINGS,
      ...data,
      sections: data.sections && data.sections.length > 0 ? data.sections : DEFAULT_SECTIONS,
    },
    live,
  };
}

const IBAN_SEED = { list: IBAN_LIST };
