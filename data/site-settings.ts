import type { SectionBlock, SiteSettings } from "@/types";

export const DEFAULT_SECTIONS: SectionBlock[] = [
  {
    id: "hero",
    label: "Hero / Manşet & Duyuru Slider",
    desc: "Ana karşılama mesajı, eylem butonları ve döner duyuru paneli",
    enabled: true,
  },
  {
    id: "stats",
    label: "Canlı İstatistik Sayacı",
    desc: "81 İl, 120+ Üniversite, 50.000+ Gönüllü, 250+ Faaliyet göstergesi",
    enabled: true,
  },
  {
    id: "basindaBiz",
    label: "Basında Biz & Faaliyetlerimiz",
    desc: "2025-2026 Yaz Etkinlikleri ve İl Binası Açılışları (milligenclik.org.tr vitrini)",
    enabled: true,
  },
  {
    id: "reports",
    label: "Basın Bildirileri ve Haftalık Raporlar",
    desc: "Haftalık faaliyet raporları ve resmi kamuoyu duyuruları",
    enabled: true,
  },
  {
    id: "events",
    label: "Genel Başkan & Teşkilat Program Takvimi",
    desc: "İl kongreleri, üniversite buluşmaları ve ziyaret takvimi",
    enabled: true,
  },
  {
    id: "videos",
    label: "Video Galeri & Multimedya Vitrini",
    desc: "Genel Başkan konuşmaları ve kongre video arşivi (Dahili oynatıcı)",
    enabled: true,
  },
  {
    id: "principles",
    label: "Milli Görüş İlkeleri & Gençlik Hedefleri (Vaatler)",
    desc: "Denk Bütçe, Önce Ahlak ve Maneviyat, Yeniden Büyük Türkiye vizyon kartları",
    enabled: true,
  },
  {
    id: "vision",
    label: "Vizyon & Erbakan Alıntısı",
    desc: "'Önce Ahlak ve Maneviyat' düsturu ve 3 temel ilke kartı",
    enabled: true,
  },
  {
    id: "erbakan",
    label: "Prof. Dr. Necmettin Erbakan Özel Bölümü",
    desc: "Milli Gençlik davasının lideri, hayatı, vizyonu ve gençliğe hitabı",
    enabled: true,
  },
  {
    id: "president",
    label: "Genel Başkan Mesajı & Biyografi",
    desc: "Genel Başkanın resmi portresi, mesajı, CV ve sosyal medya hesapları",
    enabled: true,
  },
  {
    id: "team",
    label: "Yönetim Kurulu & Birim Başkanları",
    desc: "Genel Başkan Yardımcıları ve Birim Başkanları listesi",
    enabled: true,
  },
  {
    id: "social",
    label: "Sosyal Medya Akışı (@milligenclikmgd)",
    desc: "Resmi X (Twitter) ve Instagram paylaşımları, duyurular ve medya vitrini",
    enabled: true,
  },
  {
    id: "map",
    label: "İnteraktif 81 İl Teşkilat Haritası",
    desc: "Tıklanabilir Türkiye haritası ve il başkanlığı detay kartları",
    enabled: true,
  },
  {
    id: "news",
    label: "Haberler & Duyurular Vitrini",
    desc: "Kategorilere göre filtrelenebilir son gelişmeler",
    enabled: true,
  },
  {
    id: "publications",
    label: "Yayınlar & E-Kütüphane",
    desc: "Teşkilat bültenleri, faaliyet raporları ve dergiler",
    enabled: true,
  },
  {
    id: "gallery",
    label: "Fotoğraf Galerisi & Etkinlikler",
    desc: "Kamplar, şuralar ve buluşmalardan kareler (Lightbox)",
    enabled: true,
  },
  {
    id: "sliderNews",
    label: "Manşet Slider & Hızlı Haber Akışı",
    desc: "Yeniden Refah tarzı çift kanatlı büyük manşet ve son dakika haber vitrini",
    enabled: false,
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  sections: DEFAULT_SECTIONS,
  hero: {
    badge: "Milli Gençlik Derneği Genel Merkezi",
    titleLine1: "Gençliğin Sesi,",
    titleLine2: "Milletin Geleceği",
    description:
      "Milli Gençlik Derneği olarak 81 ilde; ahlak, ilim, irfan ve vatan sevgisiyle yetişen şuurlu bir gençlik için gece gündüz çalışıyoruz.",
    volunteerBtnText: "Gönüllü Ol",
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
  },
  theme: {
    primaryColor: "#003366",
    secondaryColor: "#0066CC",
  },
};
