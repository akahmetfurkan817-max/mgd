"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { COLLECTIONS, getDb, isFirebaseConfigured } from "@/lib/firebase";
import { NEWS } from "@/data/news";
import { PROVINCES } from "@/data/provinces";
import { LEADERS, PRESIDENT } from "@/data/leaders";
import { IBAN_LIST } from "@/data/iban";
import { PUBLICATIONS } from "@/data/publications";
import { SAMPLE_APPLICATIONS } from "@/data/applications";
import { SOCIAL_POSTS } from "@/data/social";
import { VIDEOS } from "@/data/videos";
import { DEFAULT_HEADER_LABELS, DEFAULT_SECTIONS, DEFAULT_SITE_CATEGORIES, DEFAULT_SITE_SETTINGS } from "@/data/site-settings";
import { HOME_SLIDES, type HomeSlideItem } from "@/data/slides";
import { ONCU_SAHSIYETLER, type OncuSahsiyet } from "@/data/oncu-sahsiyetler";
import { ARCHIVE_ITEMS } from "@/data/archive";
import type {
  ArchiveItem,
  IbanInfo,
  Leader,
  NewsItem,
  NewsletterSubscriber,
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
  /** İlk canlı veri veya önbellek henüz yüklenmediyse true */
  loading?: boolean;
}

const memoryCache = new Map<string, unknown>();

/**
 * Sunucudan (SSR) gelen canlı Firestore verilerini ilk render'dan önce bellek önbelleğine yazar.
 * Böylece sayfa yenilendiğinde eski örnek veriler asla yanıp sönmez.
 */
export function hydrateSiteCache(initial?: Record<string, unknown> | null) {
  if (!initial || typeof initial !== "object") return;
  for (const [key, val] of Object.entries(initial)) {
    if (val !== undefined && val !== null) {
      memoryCache.set(key, val);
    }
  }
}

function useCollection<T>(
  name: string,
  seed: T[],
  combine: (remote: T[], seed: T[], managed?: boolean) => T[],
  managed = false,
): Live<T[]> {
  const cacheKey = `mgd_col_${name}`;
  const [state, setState] = useState<Live<T[]>>(() => {
    const mem = memoryCache.get(cacheKey);
    if (Array.isArray(mem)) {
      return { data: combine(mem as T[], seed, managed), live: true, loading: false };
    }
    return { data: managed ? [] : seed, live: false, loading: isFirebaseConfigured };
  });

  useEffect(() => {
    try {
      if (memoryCache.has(cacheKey)) {
        const current = memoryCache.get(cacheKey);
        if (Array.isArray(current)) {
          if (current.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(current));
          }
          setState({ data: combine(current as T[], seed, managed), live: true, loading: false });
        }
      } else {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryCache.set(cacheKey, parsed);
            setState({ data: combine(parsed, seed, managed), live: true, loading: false });
          }
        }
      }
    } catch {}

    const db = getDb();
    if (!db) {
      setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      return;
    }
    return onSnapshot(
      collection(db, name),
      (snap) => {
        const remote = snap.docs.map((d) => d.data() as T);
        memoryCache.set(cacheKey, remote);
        setState({ data: combine(remote, seed, managed), live: true, loading: false });
        try {
          if (remote.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(remote));
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch {}
      },
      (err) => {
        console.error(`${name} dinlenemedi:`, err);
        setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      },
    );
  }, [cacheKey, name, seed, combine, managed]);

  return state;
}

function useDocument<T>(col: string, id: string, seed: T): Live<T> {
  const cacheKey = `mgd_doc_${col}_${id}`;
  const [state, setState] = useState<Live<T>>(() => {
    const mem = memoryCache.get(cacheKey);
    if (mem && typeof mem === "object") {
      return { data: { ...seed, ...(mem as Partial<T>) }, live: true, loading: false };
    }
    return { data: seed, live: false, loading: isFirebaseConfigured };
  });

  useEffect(() => {
    try {
      if (memoryCache.has(cacheKey)) {
        const current = memoryCache.get(cacheKey);
        if (current && typeof current === "object") {
          localStorage.setItem(cacheKey, JSON.stringify(current));
        }
      } else {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            memoryCache.set(cacheKey, parsed);
            setState({ data: { ...seed, ...parsed }, live: true, loading: false });
          }
        }
      }
    } catch {}

    const db = getDb();
    if (!db) {
      setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      return;
    }
    return onSnapshot(
      doc(db, col, id),
      (snap) => {
        if (snap.exists()) {
          const raw = snap.data();
          memoryCache.set(cacheKey, raw);
          const val = { ...seed, ...raw } as T;
          setState({ data: val, live: true, loading: false });
          try {
            localStorage.setItem(cacheKey, JSON.stringify(raw));
          } catch {}
        } else {
          setState({ data: seed, live: true, loading: false });
        }
      },
      (err) => {
        console.error(`${col}/${id} dinlenemedi:`, err);
        setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      },
    );
  }, [cacheKey, col, id, seed]);

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

const combineNews = (remote: NewsItem[], seed: NewsItem[], managed = false): NewsItem[] => {
  if (!remote || remote.length === 0) return managed ? [] : seed;
  return [...remote].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
};

const combinePublications = (remote: Publication[], seed: Publication[], managed = false): Publication[] => {
  if (!remote || remote.length === 0) return managed ? [] : seed;
  return [...remote].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
};

const combineApplications = (remote: VolunteerApplication[], seed: VolunteerApplication[]): VolunteerApplication[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
};

export function useNews(): Live<NewsItem[]> {
  const { data: settings } = useSiteSettings();
  return useCollection<NewsItem>(COLLECTIONS.news, NEWS, combineNews, Boolean(settings.managedCollections?.news));
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
  const { data: settings } = useSiteSettings();
  return useCollection<Publication>(
    COLLECTIONS.publications,
    PUBLICATIONS,
    combinePublications,
    Boolean(settings.managedCollections?.publications),
  );
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

const combineVideos = (remote: VideoItem[], seed: VideoItem[], managed = false): VideoItem[] => {
  if (!remote || remote.length === 0) return managed ? [] : seed;
  return remote;
};

export function useVideos(): Live<VideoItem[]> {
  const { data: settings } = useSiteSettings();
  return useCollection<VideoItem>(COLLECTIONS.videos, VIDEOS, combineVideos, Boolean(settings.managedCollections?.videos));
}

export function useSiteSettings(): Live<SiteSettings> {
  const { data, live } = useDocument<SiteSettings>(COLLECTIONS.settings, "site", DEFAULT_SITE_SETTINGS);
  const merged = useMemo<SiteSettings>(() => {
    const safe = data && typeof data === "object" ? data : DEFAULT_SITE_SETTINGS;
    return {
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
      categories: {
        news: Array.isArray(safe.categories?.news) && safe.categories.news.length > 0 ? safe.categories.news : DEFAULT_SITE_CATEGORIES.news,
        videos: Array.isArray(safe.categories?.videos) && safe.categories.videos.length > 0 ? safe.categories.videos : DEFAULT_SITE_CATEGORIES.videos,
        archive: Array.isArray(safe.categories?.archive) && safe.categories.archive.length > 0 ? safe.categories.archive : DEFAULT_SITE_CATEGORIES.archive,
        publications: Array.isArray(safe.categories?.publications) && safe.categories.publications.length > 0 ? safe.categories.publications : DEFAULT_SITE_CATEGORIES.publications,
        commissions: Array.isArray(safe.categories?.commissions) && safe.categories.commissions.length > 0 ? safe.categories.commissions : DEFAULT_SITE_CATEGORIES.commissions,
        donationPurposes:
          Array.isArray(safe.categories?.donationPurposes) && safe.categories.donationPurposes.length > 0
            ? safe.categories.donationPurposes
            : DEFAULT_SITE_CATEGORIES.donationPurposes,
      },
      headerLabels: {
        ...DEFAULT_HEADER_LABELS,
        ...(safe.headerLabels && typeof safe.headerLabels === "object" ? safe.headerLabels : {}),
      },
      sections: Array.isArray(safe.sections) && safe.sections.length > 0 ? safe.sections : DEFAULT_SECTIONS,
    };
  }, [data]);
  return { data: merged, live };
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

const combineArchive = (remote: ArchiveItem[], seed: ArchiveItem[], managed = false): ArchiveItem[] => {
  if (!remote || remote.length === 0) return managed ? [] : seed;
  return [...remote].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
};

export function useArchiveItems(): Live<ArchiveItem[]> {
  const { data: settings } = useSiteSettings();
  return useCollection<ArchiveItem>(
    COLLECTIONS.archive,
    ARCHIVE_ITEMS,
    combineArchive,
    Boolean(settings.managedCollections?.archive),
  );
}

const EMPTY_SUBSCRIBERS: NewsletterSubscriber[] = [];
const combineSubscribers = (remote: NewsletterSubscriber[], seed: NewsletterSubscriber[]): NewsletterSubscriber[] => {
  if (!remote || remote.length === 0) return seed;
  return [...remote].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
};

export function useNewsletterSubscribers(): Live<NewsletterSubscriber[]> {
  return useCollection<NewsletterSubscriber>(COLLECTIONS.newsletter, EMPTY_SUBSCRIBERS, combineSubscribers);
}
