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
import { VIDEOS } from "@/data/videos";
import { DEFAULT_SECTIONS, DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import { HOME_SLIDES, type HomeSlideItem } from "@/data/slides";
import { ONCU_SAHSIYETLER, type OncuSahsiyet } from "@/data/oncu-sahsiyetler";
import { ARCHIVE_ITEMS } from "@/data/archive";
import type {
  ArchiveItem,
  IbanInfo,
  Leader,
  NewsItem,
  President,
  Province,
  Publication,
  SiteSettings,
  SocialPost,
  VideoItem,
  VolunteerApplication,
} from "@/types";

interface Live<T> {
  data: T;
  /** Firestore'dan canlı veri geldi mi (false: örnek veri gösteriliyor) */
  live: boolean;
}

function useCollection<T>(name: string, seed: T[], combine: (remote: T[], seed: T[]) => T[]): Live<T[]> {
  const [state, setState] = useState<Live<T[]>>({ data: seed, live: false });

  useEffect(() => {
    const cacheKey = `mgd_col_${name}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setState({ data: combine(parsed, seed), live: true });
        }
      }
    } catch {}

    const db = getDb();
    if (!db) return;
    return onSnapshot(
      collection(db, name),
      (snap) => {
        const remote = snap.docs.map((d) => d.data() as T);
        setState({ data: combine(remote, seed), live: true });
        try {
          if (remote.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(remote));
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch {}
      },
      (err) => console.error(`${name} dinlenemedi:`, err),
    );
  }, [name, seed, combine]);

  return state;
}

function useDocument<T>(col: string, id: string, seed: T): Live<T> {
  const [state, setState] = useState<Live<T>>({ data: seed, live: false });

  useEffect(() => {
    const cacheKey = `mgd_doc_${col}_${id}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setState({ data: { ...seed, ...parsed }, live: true });
        }
      }
    } catch {}

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

const EMPTY_APPLICATIONS: VolunteerApplication[] = [];

const combineNews = (remote: NewsItem[], seed: NewsItem[]): NewsItem[] => {
  if (!remote || remote.length === 0) return seed;
  if (remote.length < 6) {
    const ids = new Set(remote.map((r) => r.id));
    return [...remote, ...seed.filter((s) => !ids.has(s.id))].sort((a, b) =>
      String(b.date || "").localeCompare(String(a.date || "")),
    );
  }
  return [...remote].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
};

const combinePublications = (remote: Publication[], seed: Publication[]): Publication[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
};

const combineApplications = (remote: VolunteerApplication[], seed: VolunteerApplication[]): VolunteerApplication[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
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
  return useCollection<VolunteerApplication>(COLLECTIONS.applications, EMPTY_APPLICATIONS, combineApplications);
}

const combineSocialPosts = (remote: SocialPost[], seed: SocialPost[]): SocialPost[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
};

export function useSocialPosts(): Live<SocialPost[]> {
  return useCollection<SocialPost>(COLLECTIONS.social, SOCIAL_POSTS, combineSocialPosts);
}

const combineVideos = (remote: VideoItem[], seed: VideoItem[]): VideoItem[] => {
  if (!remote || remote.length === 0) return seed;
  return remote;
};

export function useVideos(): Live<VideoItem[]> {
  return useCollection<VideoItem>(COLLECTIONS.videos, VIDEOS, combineVideos);
}

export function useSiteSettings(): Live<SiteSettings> {
  const { data, live } = useDocument<SiteSettings>(COLLECTIONS.settings, "site", DEFAULT_SITE_SETTINGS);
  const safe = data && typeof data === "object" ? data : DEFAULT_SITE_SETTINGS;
  return {
    data: {
      ...DEFAULT_SITE_SETTINGS,
      ...safe,
      hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(safe.hero && typeof safe.hero === "object" ? safe.hero : {}) },
      stats: Array.isArray(safe.stats) && safe.stats.length > 0 ? safe.stats : DEFAULT_SITE_SETTINGS.stats,
      vision: { ...DEFAULT_SITE_SETTINGS.vision, ...(safe.vision && typeof safe.vision === "object" ? safe.vision : {}) },
      contact: {
        ...DEFAULT_SITE_SETTINGS.contact!,
        ...(safe.contact && typeof safe.contact === "object" ? safe.contact : {}),
      },
      theme: { ...DEFAULT_SITE_SETTINGS.theme, ...(safe.theme && typeof safe.theme === "object" ? safe.theme : {}) },
      sections: Array.isArray(safe.sections) && safe.sections.length > 0 ? safe.sections : DEFAULT_SECTIONS,
    },
    live,
  };
}

const SLIDES_SEED = { list: HOME_SLIDES };

export function useSlides(): Live<HomeSlideItem[]> {
  const remote = useDocument<{ list: HomeSlideItem[] }>(COLLECTIONS.settings, "slides", SLIDES_SEED);
  const [localOverride, setLocalOverride] = useState<HomeSlideItem[] | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem("mgd_slides");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLocalOverride(parsed);
          }
        }
      } catch {}
    };

    handleUpdate();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("mgd_slides_updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("mgd_slides_updated", handleUpdate);
    };
  }, []);

  // Firestore canlı veri geldiyse ve boş değilse onu kullan, aksi halde yerel güncel veriyi kullan
  if (remote.live && Array.isArray(remote.data?.list) && remote.data.list.length > 0) {
    return { data: remote.data.list, live: true };
  }
  if (localOverride && localOverride.length > 0) {
    return { data: localOverride, live: true };
  }
  return { data: HOME_SLIDES, live: false };
}

const IBAN_SEED = { list: IBAN_LIST };
const PIONEERS_SEED = { list: ONCU_SAHSIYETLER };

export function useOncuSahsiyetler(): Live<OncuSahsiyet[]> {
  const { data, live } = useDocument<{ list: OncuSahsiyet[] }>(
    COLLECTIONS.settings,
    "oncu_sahsiyetler",
    PIONEERS_SEED,
  );
  return {
    data: Array.isArray(data?.list) && data.list.length > 0 ? data.list : ONCU_SAHSIYETLER,
    live,
  };
}

const combineArchive = (remote: ArchiveItem[], seed: ArchiveItem[]): ArchiveItem[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
};

export function useArchiveItems(): Live<ArchiveItem[]> {
  return useCollection<ArchiveItem>(COLLECTIONS.archive, ARCHIVE_ITEMS, combineArchive);
}
