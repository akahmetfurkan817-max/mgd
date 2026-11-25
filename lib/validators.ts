import type { ApplicationStatus, ArchiveCategory, ArchiveItem, IbanInfo, Leader, NewsCategory, NewsItem, President, Province, Publication, PublicationCategory, SocialPost, VideoCategory, VideoItem, VolunteerApplication } from "@/types";
import type { OncuSahsiyet, SahsiyetBook, SahsiyetPhoto, SahsiyetVideo } from "@/data/oncu-sahsiyetler";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, max = 5000): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

const CATEGORIES: readonly NewsCategory[] = [
  "Genel Merkez",
  "Üniversite",
  "Basın Açıklaması",
  "Duyurular & Burs",
  "Programlar",
  "Teşkilattan Haberler",
  "Yayınlar & Kütüphane",
  "Basın Bildirisi & Rapor",
];
const ARCHIVE_CATEGORIES: readonly ArchiveCategory[] = [
  "Konsept",
  "Raporlar",
  "Broşürler",
  "Yayınlar",
  "Kurumsal Medya",
];
const PUBLICATION_CATEGORIES: readonly PublicationCategory[] = ["Bülten", "Faaliyet Raporu", "Dergi", "Kitapçık"];
const VIDEO_CATEGORIES: readonly VideoCategory[] = [
  "Genel Başkan Konuşması",
  "Teşkilat & Kongre",
  "Belgesel & Arşiv",
  "Gençlik Buluşması",
  "Erbakan Hoca Videoları",
  "Fatih Erbakan Videoları",
  "MGD TV",
];
const APPLICATION_STATUSES: readonly ApplicationStatus[] = ["BEKLIYOR", "ILETISIME_GECILDI", "ONAYLANDI", "REDDEDILDI"];

export function parseNews(v: unknown): NewsItem | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 300);
  const category = CATEGORIES.find((c) => c === v.category);
  const date = str(v.date, 10);
  if (!title || !category || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const content = str(v.content, 20000);
  return {
    id: str(v.id, 100),
    title,
    summary: str(v.summary, 2000),
    ...(content ? { content } : {}),
    category,
    date,
    image: str(v.image, 500),
  };
}

export function parseArchiveItem(v: unknown): ArchiveItem | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 300);
  const category = ARCHIVE_CATEGORIES.find((c) => c === v.category) || "Konsept";
  const fileUrl = str(v.fileUrl, 1000);
  if (!title || !fileUrl) return null;
  const downloadUrl = str(v.downloadUrl, 1000);
  return {
    id: str(v.id, 100),
    title,
    category,
    date: str(v.date, 20) || new Date().toISOString().slice(0, 10),
    coverImage: str(v.coverImage, 1000),
    fileUrl,
    ...(downloadUrl ? { downloadUrl } : {}),
    description: str(v.description, 2000),
  };
}

export function parseProvince(v: unknown): Province | null {
  if (!isObj(v)) return null;
  const plate = Number(v.plate);
  if (!Number.isInteger(plate) || plate < 1 || plate > 81) return null;
  return {
    plate,
    name: str(v.name, 100),
    chairName: str(v.chairName, 200),
    chairPhoto: str(v.chairPhoto, 500),
    address: str(v.address, 500),
    phone: str(v.phone, 50),
    email: str(v.email, 200),
  };
}

function parsePersonBase(v: Obj) {
  return {
    id: str(v.id, 100),
    name: str(v.name, 200),
    title: str(v.title, 200),
    photo: str(v.photo, 500),
    bio: str(v.bio),
  };
}

export function parseLeader(v: unknown): Leader | null {
  if (!isObj(v)) return null;
  const base = parsePersonBase(v);
  const rawGroup = v.group === "divan" ? "divan" : (v.group === "birim" || v.group === "komisyon" ? "birim" : "yardimci");
  if (!base.id || !base.name) return null;
  return {
    ...base,
    group: rawGroup,
    email: str(v.email, 150),
    xUrl: str(v.xUrl, 300),
    instagramUrl: str(v.instagramUrl, 300),
  };
}

export function parsePresident(v: unknown): President | null {
  if (!isObj(v)) return null;
  const base = parsePersonBase(v);
  if (!base.name) return null;
  return {
    ...base,
    id: "baskan",
    message: str(v.message),
    email: str(v.email, 150),
    xUrl: str(v.xUrl, 300),
    instagramUrl: str(v.instagramUrl, 300),
  };
}

export function parseIbanList(v: unknown): IbanInfo[] | null {
  if (!Array.isArray(v)) return null;
  const out: IbanInfo[] = [];
  for (const item of v) {
    if (!isObj(item)) return null;
    const iban = str(item.iban, 60);
    const bank = str(item.bank, 100);
    if (!iban || !bank) return null;
    out.push({ bank, iban, accountHolder: str(item.accountHolder, 200), note: str(item.note, 300) });
  }
  return out;
}

export function parsePublication(v: unknown): Publication | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 300);
  const category = PUBLICATION_CATEGORIES.find((c) => c === v.category);
  const date = str(v.date, 10);
  const description = str(v.description, 2000);
  if (!title || !category) return null;
  return {
    id: str(v.id, 100),
    title,
    category,
    date: date || new Date().toISOString().slice(0, 10),
    description,
    coverImage: str(v.coverImage, 500),
    pdfUrl: str(v.pdfUrl, 500) || "#",
  };
}

export function parseVolunteerApplication(v: unknown): VolunteerApplication | null {
  if (!isObj(v)) return null;
  const fullName = str(v.fullName, 150);
  const phone = str(v.phone, 50);
  const email = str(v.email, 150);
  const city = str(v.city, 100);
  const commission = str(v.commission, 100);
  if (!fullName || !phone || !city) return null;
  const status = APPLICATION_STATUSES.find((s) => s === v.status) ?? "BEKLIYOR";
  return {
    id: str(v.id, 100),
    fullName,
    phone,
    email,
    city,
    university: str(v.university, 200),
    commission: commission || "Genel Teşkilat",
    status,
    notes: str(v.notes, 1000),
    createdAt: str(v.createdAt, 40) || new Date().toISOString(),
  };
}

export function parseSocialPost(v: unknown): SocialPost | null {
  if (!isObj(v)) return null;
  const platform = v.platform === "instagram" ? "instagram" : "x";
  const content = str(v.content, 3000);
  const postUrl = str(v.postUrl, 500);
  if (!content) return null;
  return {
    id: str(v.id, 100) || `sp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    platform,
    authorName: str(v.authorName, 100) || "Milli Gençlik Derneği",
    authorHandle: str(v.authorHandle, 50) || "@milligenclikmgd",
    authorAvatar: str(v.authorAvatar, 500) || "/images/ahmet-ozvatan.jpg",
    content,
    imageUrl: str(v.imageUrl, 500),
    postUrl: postUrl || (platform === "instagram" ? "https://www.instagram.com/milligenclikmgd/" : "https://x.com/milligenclikmgd"),
    date: str(v.date, 40) || "Yeni",
    likes: Number(v.likes) || 0,
    shares: Number(v.shares) || 0,
    comments: Number(v.comments) || 0,
    createdAt: str(v.createdAt, 40) || new Date().toISOString(),
  };
}

export function parseVideo(v: unknown): VideoItem | null {
  if (!isObj(v)) return null;
  const title = str(v.title, 300);
  if (!title) return null;
  const cat = VIDEO_CATEGORIES.find((c) => c === v.category) || "Genel Başkan Konuşması";
  return {
    id: str(v.id, 100),
    title,
    category: cat,
    duration: str(v.duration, 50) || "10:00",
    date: str(v.date, 50) || "Bugün",
    thumbnail: str(v.thumbnail, 500) || "/images/basinda-biz/antalya-il.png",
    youtubeId: str(v.youtubeId, 50) || "dQw4w9WgXcQ",
    views: str(v.views, 50) || "1.000",
    description: str(v.description, 2000),
  };
}

export function parseOncuSahsiyetList(v: unknown): OncuSahsiyet[] | null {
  if (!Array.isArray(v)) return null;
  const out: OncuSahsiyet[] = [];

  for (const raw of v) {
    if (!isObj(raw)) return null;
    const name = str(raw.name, 200);
    if (!name) return null;

    const id = str(raw.id, 100) || `sahsiyet-${Date.now()}-${out.length}`;

    const bioSections = Array.isArray(raw.bioSections)
      ? raw.bioSections
          .filter(isObj)
          .map((b) => ({
            heading: str(b.heading, 300),
            content: str(b.content, 5000),
          }))
          .filter((b) => b.heading || b.content)
      : [];

    const quotes = Array.isArray(raw.quotes)
      ? raw.quotes.map((q) => str(q, 1000)).filter(Boolean)
      : [];

    const videos: SahsiyetVideo[] = Array.isArray(raw.videos)
      ? raw.videos
          .filter(isObj)
          .map((vid, idx) => ({
            id: str(vid.id, 100) || `v-${id}-${idx}-${Date.now()}`,
            title: str(vid.title, 300),
            youtubeId: str(vid.youtubeId, 100),
            duration: str(vid.duration, 50) || "00:00",
            date: str(vid.date, 100),
            category: str(vid.category, 100) || "Arşiv",
            description: str(vid.description, 2000),
            ...(str(vid.thumbnail, 500) ? { thumbnail: str(vid.thumbnail, 500) } : {}),
          }))
          .filter((vid) => Boolean(vid.title))
      : [];

    const photos: SahsiyetPhoto[] = Array.isArray(raw.photos)
      ? raw.photos
          .filter(isObj)
          .map((p, idx) => ({
            id: str(p.id, 100) || `p-${id}-${idx}-${Date.now()}`,
            url: str(p.url, 1000),
            caption: str(p.caption, 500),
            ...(str(p.year, 50) ? { year: str(p.year, 50) } : {}),
          }))
          .filter((p) => Boolean(p.url))
      : [];

    const books: SahsiyetBook[] = Array.isArray(raw.books)
      ? raw.books
          .filter(isObj)
          .map((bk, idx) => ({
            id: str(bk.id, 100) || `b-${id}-${idx}-${Date.now()}`,
            title: str(bk.title, 300),
            author: str(bk.author, 200) || name,
            year: str(bk.year, 50),
            coverImage: str(bk.coverImage, 1000) || "/images/mgd/0001.jpg",
            description: str(bk.description, 2000),
            totalPages: Math.max(0, Number(bk.totalPages) || 0),
            pdfUrl: str(bk.pdfUrl, 1000),
          }))
          .filter((bk) => Boolean(bk.title))
      : [];

    const bgImg = str(raw.backgroundImage, 1000);
    out.push({
      id,
      name,
      title: str(raw.title, 300),
      period: str(raw.period, 100),
      portrait: str(raw.portrait, 1000),
      ...(bgImg ? { backgroundImage: bgImg } : {}),
      badge: str(raw.badge, 200),
      motto: str(raw.motto, 1000),
      bioSections,
      quotes,
      videos,
      photos,
      books,
    });
  }

  return out;
}

