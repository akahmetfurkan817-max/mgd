import type { Announcement, NewsItem } from "@/types";

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "81 İlde Gençlik Buluşmaları Başlıyor",
    text: "Genel Merkez koordinasyonunda tüm illerimizde yılın en kapsamlı gençlik programı için kayıtlar açıldı.",
    href: "#haberler",
  },
  {
    id: "a2",
    title: "Üniversite Teşkilatları Tanışma Kampı",
    text: "Yeni dönem üniversite temsilcilerimizle bir araya geliyoruz. Başvurular devam ediyor.",
    href: "#haberler",
  },
  {
    id: "a3",
    title: "Gönüllü Olmak İçin Şimdi Başvurun",
    text: "Milli Gençlik Derneği ailesine katılın; ülkemiz için birlikte üretelim.",
    href: "#iletisim",
  },
];

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Liderler Konya’da Prof. Dr. Necmettin Erbakan’ı Andı: 'Milli Görüş Asla Sönmeyecek Bir Meşaledir'",
    summary:
      "Milli Görüş hareketinin kurucusu Prof. Dr. Necmettin Erbakan, doğumunun 100. yılı dolayısıyla Konya’da düzenlenen muazzam bir programla anıldı. Genel Başkanımız Ahmet Özvatan önemli mesajlar verdi.",
    category: "Genel Merkez",
    date: "2026-11-02",
    image: "/images/basinda-biz/istanbul-fetih.png",
  },
  {
    id: "n2",
    title: "Genel Başkanımız Ahmet Özvatan’ın İl Başkanları Kasım Ayı Konuşması",
    summary:
      "“Gençliği ihmal edenler, geleceklerini imha ederler. Bizler 81 ilde tek bir gencimizi dahi ifsat şebekelerinin insafına terk etmeyeceğiz. Türkiye'nin asıl gücü inançlı evlatlarıdır.”",
    category: "Basın Açıklaması",
    date: "2026-10-28",
    image: "/images/ahmet-ozvatan.jpg",
  },
  {
    id: "n3",
    title: "Gaziantep, Tekirdağ ve Antalya İl Hizmet Binalarımız Hizmete Açıldı",
    summary:
      "Teşkilatlanma seferberliğimiz kapsamında üç büyük şehrimizde gençlik eğitim merkezlerimiz ve il başkanlığı binalarımız dualarla açıldı.",
    category: "Genel Merkez",
    date: "2026-10-18",
    image: "/images/basinda-biz/gaziantep.png",
  },
  {
    id: "n4",
    title: "120 Üniversitede 'Milli Maarif ve Bilim Kulüpleri' Faaliyete Başladı",
    summary:
      "Üniversite Teşkilatları Başkanlığımız, yeni akademik yılda genç mühendis, hekim ve ilahiyatçı kardeşlerimiz için araştırma atölyeleri kurdu.",
    category: "Üniversite",
    date: "2026-10-10",
    image: "/images/basinda-biz/yaz-etkinlikleri.png",
  },
  {
    id: "n5",
    title: "Doğu Akdeniz ve Mavi Vatan Konusunda Resmî Basın Açıklamamız",
    summary:
      "Kıbrıs Barış Harekâtı'nın mimarı Erbakan Hocamızın mirası KKTC ve deniz yetki alanlarımız konusundaki tavizsiz duruşumuz kamuoyuyla paylaşıldı.",
    category: "Basın Açıklaması",
    date: "2026-09-24",
    image: "/images/basinda-biz/antalya-yayla.png",
  },
  {
    id: "n6",
    title: "Antalya Yayla Gençlik Şöleni On Binlerin Katılımıyla Tamamlandı",
    summary:
      "Geleneksel okçuluk, ahlak seminerleri, teknoloji sergileri ve konserlerle dolu şölenimizde genç kardeşlerimiz kardeşlik ahdini tazeledi.",
    category: "Üniversite",
    date: "2026-09-15",
    image: "/images/basinda-biz/antalya-il.png",
  },
];
