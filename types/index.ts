export type RoleId = "SUPER_ADMIN" | "NEWS_EDITOR" | "ORG_MANAGER";

export type AdminSection =
  | "slides"
  | "media"
  | "news"
  | "provinces"
  | "board"
  | "iban"
  | "applications"
  | "publications"
  | "layout"
  | "content"
  | "videos"
  | "pioneers"
  | "archive"
  | "newsletter";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface HomeSlideItem {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  mobileFit?: "contain" | "cover";
  hiddenLink?: string;
  linkUrl: string;
  buttonText: string;
  date?: string;
}

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

export interface DistrictChair {
  id: string;
  name: string;
  chairName: string;
  phone: string;
}

export interface Province {
  plate: number;
  name: string;
  chairName: string;
  chairPhoto: string;
  address: string;
  phone: string;
  email: string;
  districts?: DistrictChair[];
}

export type NewsCategory = string;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: NewsCategory;
  date: string; // ISO
  image?: string;
}

export type ArchiveCategory = string;

export interface ArchiveItem {
  id: string;
  title: string;
  category: ArchiveCategory;
  date: string;
  coverImage?: string;
  fileUrl: string;
  downloadUrl?: string;
  description?: string;
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

export type PublicationCategory = string;

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

export type VideoCategory = string;

export interface VideoItem {
  id: string;
  title: string;
  category: VideoCategory;
  duration: string;
  date: string;
  thumbnail: string;
  youtubeId?: string;
  views?: string;
  description: string;
  downloadUrl?: string;
  showDownload?: boolean;
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
  xUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  whatsappUrl?: string;
  donateUrl?: string;
}

export interface ErbakanQuoteItem {
  quote: string;
  context: string;
}

export interface ErbakanConfig {
  badge?: string;
  title?: string;
  subtitle?: string;
  portrait?: string;
  quotes?: ErbakanQuoteItem[];
}

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ManagementCardsConfig {
  showQuickCards?: boolean;
  showDormitory?: boolean;
  dormitoryPhoto?: string;
}

export interface CorporatePdfsConfig {
  tuzuk?: string;
  hakkimizda?: string;
  protokoller?: string;
  kurumsalKimlik?: string;
}

export interface DonationPurposeItem {
  id: string;
  title: string;
  desc: string;
  note: string;
}

export interface SiteCategoriesConfig {
  news?: string[];
  videos?: string[];
  archive?: string[];
  publications?: string[];
  commissions?: string[];
  donationPurposes?: DonationPurposeItem[];
}

export interface HeaderLabelsConfig {
  programTakvimi?: string;
  kurumsal?: string;
  yonetim?: string;
  oncuSahsiyetler?: string;
  haberler?: string;
  dosyaArsivi?: string;
  medya?: string;
  iletisim?: string;
  bagisYap?: string;
  uyelikBasvuru?: string;
  milbisGiris?: string;
  milbisUrl?: string;
}

export interface SiteSettings {
  sections: SectionBlock[];
  hero: HeroConfig;
  stats: StatsItemConfig[];
  vision: VisionConfig;
  contact?: ContactConfig;
  theme?: ThemeConfig;
  erbakan?: ErbakanConfig;
  managementCards?: ManagementCardsConfig;
  corporatePdfs?: CorporatePdfsConfig;
  categories?: SiteCategoriesConfig;
  headerLabels?: HeaderLabelsConfig;
  sliderZoomEnabled?: boolean;
  sliderMobileMode?: "new" | "classic";
}
