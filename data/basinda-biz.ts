export interface BasindaBizItem {
  id: string;
  title: string;
  badge: string;
  category: string;
  date: string;
  location: string;
  image: string;
  summary: string;
  content: string;
  galleryImages?: string[];
}

export const BASINDA_BIZ_ITEMS: BasindaBizItem[] = [
  {
    id: "gaziantep-acilis",
    title: "Gaziantep İl Binamızın Açılışı",
    badge: "Fotoğraf Arşivi",
    category: "Açılış & Teşkilat",
    date: "2026",
    location: "Gaziantep",
    image: "/images/basinda-biz/gaziantep.png",
    summary:
      "Milli Gençlik Derneği Gaziantep İl Başkanlığı hizmet binamız, genel merkez yöneticilerimiz ve bölge halkının yoğun katılımıyla dualarla açıldı.",
    content:
      "Gaziantep İl Başkanlığı yeni hizmet binamızın açılışı geniş bir katılımla gerçekleştirildi. Genel Merkez heyetimiz, il ve ilçe başkanlarımız, sivil toplum kuruluşu temsilcileri ve çok sayıda gönüllümüzün iştirak ettiği törende dualar edildi, kurdele kesildi. Yeni binamız, Gaziantep'teki gençlerimize ilim, irfan, ahlak ve maneviyat yolunda rehberlik edecek geniş konferans salonları, etüt odaları ve gençlik atölyeleriyle donatıldı.",
  },
  {
    id: "teskilat-ziyaretleri",
    title: "Teşkilat Ziyaretlerimiz",
    badge: "Fotoğraf Arşivi",
    category: "Teşkilat",
    date: "2026",
    location: "Anadolu Buluşmaları",
    image: "/images/basinda-biz/teskilat.png",
    summary:
      "Genel Başkanımız ve heyetimiz, il ve ilçe teşkilatlarımızı yerinde ziyaret ederek genç kardeşlerimizle istişare toplantıları gerçekleştirdi.",
    content:
      "Milli Gençlik teşkilatımızın dinamizmini korumak ve sahadaki çalışmaları yakından takip etmek amacıyla Türkiye genelinde il ziyaretlerimiz devam ediyor. Genel Başkanımız teşkilat mensuplarımızla bir araya gelerek 'Önce Ahlak ve Maneviyat' düsturuyla yürütülen eğitim, kültür ve gençlik projelerini değerlendirdi.",
  },
  {
    id: "antalya-yayla-soleni",
    title: "Antalya Yayla Gençlik Şöleni",
    badge: "Fotoğraf Arşivi",
    category: "Gençlik Buluşması",
    date: "2026",
    location: "Antalya",
    image: "/images/basinda-biz/antalya-yayla.png",
    summary:
      "Torosların zirvesinde binlerce gencin bir araya geldiği spor müsabakaları, ezgi dinletileri ve kardeşlik atmosferiyle dolu muhteşem şölen.",
    content:
      "Antalya İl Başkanlığımızın organizasyonunda Toros yaylalarında tertiplenen Geleneksel Yayla Gençlik Şöleni binlerce üniversiteli ve liseli gencimizi buluşturdu. Kamp ateşleri, okçuluk ve güreş turnuvaları, seminerler ve kardeşlik halaylarıyla dolu üç günlük program unutulmaz anlara sahne oldu.",
  },
  {
    id: "karabuk-acilis",
    title: "Karabük İl Binamızın Açılışı",
    badge: "Fotoğraf Arşivi",
    category: "Açılış & Teşkilat",
    date: "2026",
    location: "Karabük",
    image: "/images/basinda-biz/karabuk.png",
    summary:
      "Karabük il teşkilatımızın yeni hizmet binasının açılış kurdelesi, Genel Merkez heyetimiz ve kıymetli gönüldaşlarımızın iştirakiyle kesildi.",
    content:
      "Sanayi kenti Karabük'te gençliğimize nefes aldıracak, üniversite ve lise öğrencilerimize sıcak bir yuva olacak Karabük İl Başkanlığı binamız resmen hizmete açıldı. Açılışta konuşan Genel Merkez yetkilileri, gençliğin geleceğin teminatı olduğunu vurgulayarak teşkilatlanma çalışmalarının kararlılıkla süreceğini belirtti.",
  },
  {
    id: "tekirdag-acilis",
    title: "Tekirdağ İl Binamızın Açılışı",
    badge: "Fotoğraf Arşivi",
    category: "Açılış & Teşkilat",
    date: "2026",
    location: "Tekirdağ",
    image: "/images/basinda-biz/tekirdag.png",
    summary:
      "Trakya bölgesinde milli gençlik rüzgarı estirecek olan Tekirdağ İl Hizmet Binamız dualar eşliğinde açılışını gerçekleştirdi.",
    content:
      "Trakya teşkilatlanmamızın önemli merkezlerinden biri olan Tekirdağ İl Hizmet Binamız coşkulu bir törenle kapılarını açtı. Gençlerin sosyal ve manevi gelişimine katkı sağlayacak kütüphane ve sohbet halkaları alanı içeren merkezimiz bölge gençliğinin hizmetinde.",
  },
  {
    id: "antalya-il-acilis",
    title: "Antalya İl Binamızın Açılışı",
    badge: "Fotoğraf Arşivi",
    category: "Açılış & Teşkilat",
    date: "2026",
    location: "Antalya",
    image: "/images/basinda-biz/antalya-il.png",
    summary:
      "Akdeniz'in incisi Antalya'da gençliğimize hizmet edecek yeni il merkez binamız büyük bir coşku ve katılımla hizmete girdi.",
    content:
      "Antalya İl Temsilciliğimizin yeni modern hizmet binası dualar eşliğinde açıldı. Geniş katılımlı açılış töreninde gençlerimiz ve vatandaşlarımız bir araya gelerek milli ve manevi değerler etrafında kenetlendi.",
  },
  {
    id: "istanbul-fethi",
    title: "İstanbul'un Fethi Programı",
    badge: "Fotoğraf Arşivi",
    category: "Milli Şuur",
    date: "2026",
    location: "İstanbul",
    image: "/images/basinda-biz/istanbul-fetih.png",
    summary:
      "Çağ kapatıp çağ açan kutlu fethin 573. yıl dönümü, binlerce gencimizin katılımıyla Yahya Kemal Beyatlı Gösteri Merkezi'nde coşkuyla idrak edildi.",
    content:
      "Fatih Sultan Mehmed Han'ın emaneti olan aziz İstanbul'un fethi, Genel Merkezimiz ve İstanbul İl Teşkilatımızın öncülüğünde salon programı, mehteran gösterileri, Kur'an-ı Kerim tilavetleri ve tiyatral canlandırmalarla muazzam bir atmosferde kutlandı.",
  },
  {
    id: "yaz-etkinliklerimiz",
    title: "2025-2026 Yaz Etkinliklerimiz",
    badge: "Fotoğraf Arşivi",
    category: "Yaz Etkinlikleri",
    date: "2025-2026",
    location: "81 İl Teşkilatımızda",
    image: "/images/basinda-biz/yaz_etkinlikleri_cartoon.png",
    summary:
      "Geleceğimizin teminatı çocuklarımız için ahlak ve maneviyat, robotik kodlama, yüzme ve atölye çalışmalarıyla dolu unutulmaz yaz kampları.",
    content:
      "Milli Gençlik Derneği olarak geleceğimizin teminatı olan çocuklarımızın yaz tatillerini hem verimli hem de keyifli geçirmeleri için 2025-2026 Yaz Etkinlikleri kapsamında birçok program düzenledik. Bu etkinliklerde amacımız çocuklarımızın sadece boş vakitlerini doldurmaları değil; aynı zamanda ahlaki ve manevi değerlerle yetişmeleri, bununla birlikte fen eğitimi, kodlama ve yabancı dil gibi çağın gerekliliklerini kazanmaları oldu. İl başkanlıklarımızın öncülüğünde ve gönüllü kardeşlerimizin büyük emekleriyle hayata geçirilen bu yaz etkinlikleri, çocuklarımızın kişisel gelişimlerine önemli katkılar sağladı. Çeşitli dersler, oyunlar, atölye çalışmaları ve sosyal faaliyetlerle dolu geçen programlarımız öğrencilerimizin hem öğrenmesini hem eğlenmesini mümkün kıldı.",
    galleryImages: [
      "/images/basinda-biz/yaz_kamp_1.png",
      "/images/basinda-biz/yaz_kamp_2.png",
      "/images/basinda-biz/yaz_kamp_3.png",
      "/images/basinda-biz/yaz_kamp_4.png",
    ],
  },
];
