export interface HomeSlideItem {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  mobileFit?: "contain" | "cover";
  linkUrl: string;
  buttonText: string;
  date?: string;
}

export const HOME_SLIDES: HomeSlideItem[] = [
  {
    id: "slide-yeniden-mgd",
    badge: "MİLLİ GENÇLİK HAREKETİ",
    badgeColor: "bg-blue-600",
    title: "Yeniden Milli Gençlik: Aydınlık Yarınlar İçin Başlıyoruz",
    subtitle:
      "Ahlak, ilim ve maneviyat bayrağını 81 ilde daha yükseğe taşımak için kutlu yürüyüşümüz kararlılıkla devam ediyor.",
    image: "/images/slider/yeniden-milli-genclik.jpg",
    linkUrl: "/kurumsal",
    buttonText: "Teşkilatımızı Tanıyın →",
    date: "Resmî Kampanya",
  },
  {
    id: "slide-burs-sonuclari",
    badge: "BURS DUYURUSU",
    badgeColor: "bg-emerald-600",
    title: "2026 - 2027 Dönemi Üniversite Lisans & Yükseköğrenim Burs Başvuruları Açıldı",
    subtitle:
      "Genel Merkez Eğitim ve Burs Komisyonumuz tarafından yürütülen karşılıksız eğitim desteği ve barınma bursu başvuruları başlamıştır.",
    image: "/images/slider/burs-universite.jpg",
    linkUrl: "/haberler#burs-basvuru",
    buttonText: "Burs Başvuru Formuna Git →",
    date: "Aktif Başvuru",
  },
  {
    id: "slide-haydi-mgd",
    badge: "GENÇLİK BULUŞMASI",
    badgeColor: "bg-emerald-700",
    title: "Haydi Milli Gençlik! Büyük Anadolu Seferberliği Başladı",
    subtitle:
      "81 il, 120 üniversite ve binlerce gencimizle tek yürek: 'Önce Ahlak ve Maneviyat' düsturuyla geleceği inşa ediyoruz.",
    image: "/images/slider/haydi-milli-genclik.jpg",
    linkUrl: "/etkinlikler",
    buttonText: "Etkinlik Takvimine Git →",
    date: "Dönemsel Program",
  },
  {
    id: "slide-buyuk-solen",
    badge: "GENÇLİK ŞÖLENİ",
    badgeColor: "bg-red-600",
    title: "3. Olağan Büyük Gençlik Şöleni ve Liderler Buluşması Tarihi Belli Oldu",
    subtitle:
      "81 il teşkilatımız, üniversite temsilciliklerimiz ve on binlerce gencimizin katılımıyla Ankara'da gerçekleşecek dev buluşmanın program akışı yayınlandı.",
    image: "/images/slider/genclik-soleni.jpg",
    linkUrl: "/etkinlikler",
    buttonText: "Program Akışını İncele →",
    date: "18 Kasım 2026",
  },
  {
    id: "slide-okuma-halkalari",
    badge: "EĞİTİM & İRFAN",
    badgeColor: "bg-indigo-600",
    title: "81 İlde 'Milli Maarif Okuma Halkaları' ve Liderlik Kampları Başlıyor",
    subtitle:
      "Ahlak, ilim ve maneviyatla yoğrulan gençliğimiz için 120 üniversitede eş zamanlı atölyeler ve seminer takvimi hayata geçiyor.",
    image: "/images/slider/okuma-halkalari.jpg",
    linkUrl: "/faaliyetler",
    buttonText: "Faaliyetleri İncele →",
    date: "Akademik Yıl",
  },
];
