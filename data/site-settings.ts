import type { SectionBlock, SiteSettings } from "@/types";

export const DEFAULT_SECTIONS: SectionBlock[] = [
  {
    id: "sliderNews",
    label: "Manşet Slider & Komisyon Kartları",
    desc: "Ana sayfa kaydırılabilir manşet slaytları ve Ortaokul / Ortaöğretim / Üniversiteler kartları",
    enabled: true,
  },
  {
    id: "map",
    label: "İnteraktif 81 İl Teşkilat Haritası",
    desc: "Size en yakın Millî Gençlik — tıklanabilir Türkiye haritası ve il başkanlığı kartları",
    enabled: true,
  },
  {
    id: "team",
    label: "Genel Başkan & Başkanlık Divanı (Kompakt)",
    desc: "AGD tarzı kompakt Genel Başkan ve Başkanlık Divanı vitrini",
    enabled: true,
  },
  {
    id: "news",
    label: "Haberler & Duyurular Vitrini",
    desc: "Kategorilere göre filtrelenebilir son gelişmeler ve burs duyuruları",
    enabled: true,
  },
  {
    id: "stats",
    label: "Canlı İstatistik Sayacı",
    desc: "81 İl, 120+ Üniversite, 50.000+ Gönüllü, 250+ Faaliyet göstergesi",
    enabled: true,
  },
  {
    id: "hero",
    label: "Kurumsal Manifesto / Tanıtım Bandı",
    desc: "Ana karşılama mesajı ve eylem butonları (isteğe bağlı)",
    enabled: false,
  },
  {
    id: "president",
    label: "Genel Başkan Mesajı & Biyografi",
    desc: "Genel Başkanın portresi, mesajı ve özgeçmişi (isteğe bağlı)",
    enabled: false,
  },
  {
    id: "videos",
    label: "Video Galeri & Multimedya Vitrini",
    desc: "Medya ve Yayınlar sayfasından erişilen video arşivi",
    enabled: false,
  },
  {
    id: "vision",
    label: "Vizyon & Erbakan Alıntısı",
    desc: "'Önce Ahlak ve Maneviyat' düsturu ve 3 temel ilke kartı",
    enabled: false,
  },
  {
    id: "erbakan",
    label: "Prof. Dr. Necmettin Erbakan Özel Bölümü",
    desc: "Öncü Şahsiyetler sayfasından erişilen Erbakan özel bölümü",
    enabled: false,
  },
  {
    id: "basindaBiz",
    label: "Basında Biz & Faaliyetlerimiz",
    desc: "Teşkilat faaliyetleri ve açılışlar",
    enabled: false,
  },
  {
    id: "reports",
    label: "Basın Bildirileri ve Haftalık Raporlar",
    desc: "Haftalık faaliyet raporları ve kamuoyu duyuruları",
    enabled: false,
  },
  {
    id: "events",
    label: "Program Takvimi",
    desc: "İl kongreleri, üniversite buluşmaları ve ziyaret takvimi",
    enabled: false,
  },
  {
    id: "principles",
    label: "Öncü Şahsiyetler Vitrini",
    desc: "Öncü Şahsiyetler sayfasından erişilen vitrin",
    enabled: false,
  },
  {
    id: "social",
    label: "Sosyal Medya Akışı (@milligenclikmgd)",
    desc: "Resmî Instagram paylaşımları ve Takip Et kartı",
    enabled: true,
  },
  {
    id: "publications",
    label: "Yayınlar & E-Kütüphane",
    desc: "Medya ve Yayınlar sayfasından erişilen bülten ve raporlar",
    enabled: false,
  },
  {
    id: "gallery",
    label: "Fotoğraf Galerisi",
    desc: "Kamplar ve buluşmalardan kareler",
    enabled: false,
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  sections: DEFAULT_SECTIONS,
  hero: {
    badge: "Milli Gençlik Derneği Genel Merkezi",
    titleLine1: "Şuurlu Gençlik,",
    titleLine2: "Güçlü Türkiye",
    description:
      "Ahlak, ilim ve sorumlulukla yarınları birlikte inşa ediyoruz.",
    volunteerBtnText: "Üyelik / Başvuru",
    donateBtnText: "Bağış Yap",
  },
  stats: [
    {
      id: "stat-1",
      label: "İl Teşkilatı",
      value: "81",
      desc: "Türkiye'nin tamamında aktif teşkilatlanma",
    },
    {
      id: "stat-2",
      label: "Üniversite Temsilciliği",
      value: "120+",
      desc: "Kampüslerde gençliğin ilim ve irfan sesi",
    },
    {
      id: "stat-3",
      label: "Aktif Gönüllü",
      value: "50.000+",
      desc: "Geleceğin inşasında omuz omuza çalışan gençler",
    },
    {
      id: "stat-4",
      label: "Yıllık Faaliyet",
      value: "250+",
      desc: "Seminer, kamp, çalıştay ve sosyal sorumluluk",
    },
  ],
  vision: {
    tag: "Temel Düsturumuz",
    heading: "“Önce Ahlak ve Maneviyat”",
    quote:
      "“Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve imanlı evlatlarıdır.”",
    author: "— Prof. Dr. Necmettin Erbakan",
  },
  contact: {
    phone: "0 (312) 472 54 54",
    email: "iletisim@milligenclik.org.tr",
    address: "Genel Merkez: Ankara",
    headerNotice: "Milli Gençlik Derneği Genel Merkez Portalı",
    xUrl: "https://x.com/milligenclikmgd",
    instagramUrl: "https://www.instagram.com/milligenclikmgd/",
  },
  theme: {
    primaryColor: "#1B3B7B",
    secondaryColor: "#1D56B8",
  },
};
