export type RoleId = "SUPER_ADMIN" | "NEWS_EDITOR" | "ORG_MANAGER";

export type AdminSection =
  | "news"
  | "provinces"
  | "board"
  | "iban"
  | "applications"
  | "publications"
  | "layout"
  | "content"
  | "social";

export interface AdminUser {
  username: string;
  displayName: string;
  role: RoleId;
}

export interface Person {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
}

export interface Leader extends Person {
  group?: "divan" | "yardimci" | "birim";
  email?: string;
  xUrl?: string;
  instagramUrl?: string;
}

export interface President extends Person {
  message: string;
  email?: string;
  xUrl?: string;
  instagramUrl?: string;
}

export interface Province {
  plate: number;
  name: string;
  chairName: string;
  chairPhoto: string;
  address: string;
  phone: string;
  email: string;
}

export type NewsCategory = "Genel Merkez" | "Üniversite" | "Basın Açıklaması";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string; // ISO
  image?: string;
}

export interface Announcement {
  id: string;
  title: string;
  text: string;
  href: string;
}

export interface IbanInfo {
  bank: string;
  accountHolder: string;
  iban: string;
  note?: string;
}

export type ApplicationStatus = "BEKLIYOR" | "ILETISIME_GECILDI" | "ONAYLANDI" | "REDDEDILDI";

export interface VolunteerApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  university?: string;
  commission: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string; // ISO
}

export type PublicationCategory = "Bülten" | "Faaliyet Raporu" | "Dergi" | "Kitapçık";

export interface Publication {
  id: string;
  title: string;
  category: PublicationCategory;
  date: string;
  description: string;
  coverImage?: string;
  pdfUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  description?: string;
}

export interface SocialPost {
  id: string;
  platform: "x" | "instagram";
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  postUrl: string;
  date: string;
  likes?: number;
  shares?: number;
  comments?: number;
  createdAt?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  category: "Haftalık Rapor" | "Basın Bildirisi" | "AR-GE Raporu";
  summary: string;
  content: string;
  date: string;
  pdfUrl?: string;
  author?: string;
  readTime?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  city: string;
  venue: string;
  category: "İl Kongresi" | "Üniversite Buluşması" | "Basın Toplantısı" | "Gençlik Şöleni" | "İl Divanı";
  speaker: string;
  description: string;
  status: "Yaklaşan" | "Tamamlandı";
}

export interface VideoItem {
  id: string;
  title: string;
  category: "Genel Başkan Konuşması" | "Teşkilat & Kongre" | "Belgesel & Arşiv" | "Gençlik Buluşması";
  duration: string;
  date: string;
  thumbnail: string;
  youtubeId?: string;
  views?: string;
  description: string;
}

export interface PrincipleItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  points: string[];
}

/* --- Sayfa Düzenleyici & Canlı Metin Yönetimi (WordPress Mantığı) --- */

export type HomeSectionId =
  | "hero"
  | "sliderNews"
  | "stats"
  | "basindaBiz"
  | "reports"
  | "events"
  | "videos"
  | "principles"
  | "vision"
  | "erbakan"
  | "president"
  | "team"
  | "social"
  | "map"
  | "news"
  | "publications"
  | "gallery";

export interface SectionBlock {
  id: HomeSectionId;
  label: string;
  desc: string;
  enabled: boolean;
}

export interface StatsItemConfig {
  id: string;
  label: string;
  value: string;
  desc: string;
}

export interface HeroConfig {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  volunteerBtnText: string;
  donateBtnText: string;
}

export interface VisionConfig {
  tag: string;
  heading: string;
  quote: string;
  author: string;
}

export interface ContactConfig {
  phone: string;
  email: string;
  address: string;
  headerNotice?: string;
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SiteSettings {
  sections: SectionBlock[];
  hero: HeroConfig;
  stats: StatsItemConfig[];
  vision: VisionConfig;
  contact?: ContactConfig;
  theme?: ThemeConfig;
}
