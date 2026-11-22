import type { Announcement, NewsItem } from "@/types";

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "2026 - 2027 Üniversite Burs Sonuçları Açıklandı",
    text: "Eğitim ve Burs Komisyonumuz tarafından değerlendirilen burs sonuçları sorgulama ekranı yayındadır.",
    href: "/haberler",
  },
  {
    id: "a2",
    title: "Milli Maarif Yükseköğrenim Burs Başvuruları",
    text: "Maddi desteğe ihtiyaç duyan üniversite öğrencilerimiz için karşılıksız eğitim bursu başvuruları devam ediyor.",
    href: "/haberler",
  },
  {
    id: "a3",
    title: "81 İlde Gençlik Buluşmaları Başlıyor",
    text: "Genel Merkez koordinasyonunda tüm illerimizde yılın en kapsamlı gençlik programı için kayıtlar açıldı.",
    href: "/etkinlikler",
  },
  {
    id: "a4",
    title: "Gönüllü Olmak İçin Şimdi Başvurun",
    text: "Milli Gençlik Derneği ailesine katılın; ülkemiz için birlikte üretelim.",
    href: "/#iletisim",
  },
];

export const NEWS: NewsItem[] = [
  {
    id: "n-burs-1",
    title: "2026 - 2027 Eğitim Yılı Üniversite Lisans & Lisansüstü Burs Sonuçları Açıklandı!",
    summary:
      "Genel Merkez Eğitim ve Burs Komisyonumuz tarafından titizlikle yürütülen değerlendirmeler neticesinde; 81 ilden binlerce üniversite öğrencimizin burs hak sahipliği sonuçları ilan edilmiştir. T.C. Kimlik numaranız ile sorgulama yapabilirsiniz.",
    category: "Duyurular & Burs",
    date: "2026-11-05",
    image: "/images/slider/burs-universite.jpg",
  },
  {
    id: "n-burs-2",
    title: "Milli Maarif Barınma ve Eğitim Yardımı Başvuruları İçin Son Günler",
    summary:
      "Üniversiteye yeni yerleşen ve barınma güçlüğü çeken kardeşlerimize yönelik yurt tahsisi ve karşılıksız beslenme desteği başvuruları devam etmektedir.",
    category: "Duyurular & Burs",
    date: "2026-11-01",
    image: "/images/mgd/once-ahlak-ve-maneviyat-diyebilen-bir-genclik.jpeg",
  },
  {
    id: "n1",
    title: "Liderler Konya’da Prof. Dr. Necmettin Erbakan’ı Andı: 'Milli Görüş Asla Sönmeyecek Bir Meşaledir'",
    summary:
      "Milli Görüş hareketinin kurucusu Prof. Dr. Necmettin Erbakan, doğumunun 100. yılı dolayısıyla Konya’da düzenlenen muazzam bir programla anıldı. Genel Başkanımız Ahmet Özvatan önemli mesajlar verdi.",
    category: "Genel Merkez",
    date: "2026-11-02",
    image: "/images/erbakan_banner.png",
  },
  {
    id: "n-prog-1",
    title: "3. Olağan Büyük Gençlik Şöleni Program Akışı ve Salon Tahsisleri Açıklandı",
    summary:
      "Ankara Haliç ve Nazım Hikmet Kongre Merkezlerinde icra edilecek dev gençlik şöleninde ezgiler, tiyatro gösterileri, teknoloji stantları ve Genel Başkanımızın tarihi hitabı yer alacak.",
    category: "Programlar",
    date: "2026-10-30",
    image: "/images/mgd/haydi-milli-genclik.jpg",
  },
  {
    id: "n2",
    title: "Genel Başkanımız Ahmet Özvatan’ın İl Başkanları Kasım Ayı Konuşması",
    summary:
      "“Gençliği ihmal edenler, geleceklerini imha ederler. Bizler 81 ilde tek bir gencimizi dahi ifsat şebekelerinin insafına terk etmeyeceğiz. Türkiye'nin asıl gücü inançlı evlatlarıdır.”",
    category: "Basın Açıklaması",
    date: "2026-10-28",
    image: "/images/mgd/11102025-il-baskanlari-toplantisi.jpg",
  },
  {
    id: "n-tesk-1",
    title: "81 İl Teşkilatımızda Eş Zamanlı 'Milli Maarif Okuma Halkaları' Start Aldı",
    summary:
      "Teşkilatlanma Başkanlığımızın koordinasyonunda 81 il başkanlığı binamızda yüzlerce genç kardeşimizin katılımıyla ilk okuma halkası dersleri dualarla başladı.",
    category: "Teşkilattan Haberler",
    date: "2026-10-22",
    image: "/images/mgd/nicin-milli-genclik.jpg",
  },
  {
    id: "n3",
    title: "Gaziantep, Tekirdağ ve Antalya İl Hizmet Binalarımız Hizmete Açıldı",
    summary:
      "Teşkilatlanma seferberliğimiz kapsamında üç büyük şehrimizde gençlik eğitim merkezlerimiz ve il başkanlığı binalarımız dualarla açıldı.",
    category: "Teşkilattan Haberler",
    date: "2026-10-18",
    image: "/images/mgd/milli-genclik-dernegi-il-baskanlari-toplantisi-06092025.jpg",
  },
  {
    id: "n4",
    title: "120 Üniversitede 'Milli Maarif ve Bilim Kulüpleri' Faaliyete Başladı",
    summary:
      "Üniversite Teşkilatları Başkanlığımız, yeni akademik yılda genç mühendis, hekim ve ilahiyatçı kardeşlerimiz için araştırma atölyeleri kurdu.",
    category: "Üniversite",
    date: "2026-10-10",
    image: "/images/mgd/2025-2026-yaz-etkinliklerimiz.jpg",
  },
  {
    id: "n5",
    title: "Doğu Akdeniz ve Mavi Vatan Konusunda Resmî Basın Açıklamamız",
    summary:
      "Kıbrıs Barış Harekâtı'nın mimarı Erbakan Hocamızın mirası KKTC ve deniz yetki alanlarımız konusundaki tavizsiz duruşumuz kamuoyuyla paylaşıldı.",
    category: "Basın Açıklaması",
    date: "2026-09-24",
    image: "/images/erbakan_portrait.png",
  },
];
