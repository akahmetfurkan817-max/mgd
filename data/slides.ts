export interface HomeSlideItem {
  id: string;
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  image: string;
  linkUrl: string;
  buttonText: string;
  date?: string;
}

export const HOME_SLIDES: HomeSlideItem[] = [
  {
    id: "slide-burs-sonuclari",
    badge: "BURS DUYURUSU",
    badgeColor: "bg-emerald-600",
    title: "2026 - 2027 Eğitim Dönemi Üniversite Lisans & Lisansüstü Burs Sonuçları Açıklandı!",
    subtitle:
      "Genel Merkez Eğitim ve Burs Komisyonumuz tarafından titizlikle incelenen burs başvuruları sonuçlanmıştır. Sonuçları hemen sorgulayabilirsiniz.",
    image: "/images/basinda-biz/antalya-il.png",
    linkUrl: "/haberler#burs-sonuclari",
    buttonText: "Burs Sonuçlarını Sorgula →",
    date: "Kasım 2026",
  },
  {
    id: "slide-burs-basvuru",
    badge: "BURS BAŞVURULARI DEVAM EDİYOR",
    badgeColor: "bg-blue-600",
    title: "Milli Maarif Yükseköğrenim ve Barınma Destek Bursu Başvuruları Başladı",
    subtitle:
      "Türkiye genelindeki üniversite öğrencilerimiz için karşılıksız eğitim bursu ve yurt destek başvuruları resmî portalımız üzerinden alınmaktadır.",
    image: "/images/basinda-biz/yaz-etkinlikleri.png",
    linkUrl: "/haberler#burs-basvuru",
    buttonText: "Burs Başvuru Formuna Git →",
    date: "Aktif Başvuru",
  },
  {
    id: "slide-buyuk-solen",
    badge: "GENÇLİK ŞÖLENİ",
    badgeColor: "bg-red-600",
    title: "3. Olağan Büyük Gençlik Şöleni ve Liderler Buluşması Tarihi Belli Oldu",
    subtitle:
      "81 il teşkilatımız, üniversite temsilciliklerimiz ve on binlerce gencimizin katılımıyla Ankara'da gerçekleşecek dev buluşmanın program akışı yayınlandı.",
    image: "/images/basinda-biz/istanbul-fetih.png",
    linkUrl: "/etkinlikler",
    buttonText: "Program Akışını İncele →",
    date: "18 Kasım 2026",
  },
  {
    id: "slide-yaz-kampi",
    badge: "TEŞKİLAT SEFERBERLİĞİ",
    badgeColor: "bg-indigo-600",
    title: "81 İlde 'Milli Maarif Okuma Halkaları' ve Liderlik Kampları Başlıyor",
    subtitle:
      "Ahlak, ilim ve maneviyatla yoğrulan gençliğimiz için 120 üniversitede eş zamanlı atölyeler ve seminer takvimi hayata geçiyor.",
    image: "/images/basinda-biz/antalya-yayla.png",
    linkUrl: "/faaliyetler",
    buttonText: "Faaliyetleri İncele →",
    date: "Dönemsel Program",
  },
];
