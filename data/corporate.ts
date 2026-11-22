export interface ProtocolPartner {
  id: string;
  name: string;
  category: "Bakanlık & Kamu" | "Üniversite" | "Sivil Toplum & Vakıf";
  badgeColor: string;
  logo: string;
  signDate: string;
  scope: string;
  officialNumber: string;
  sealColor: "green" | "blue" | "gold";
}

export interface CorporatePage {
  pageNumber: number;
  chapterTitle?: string;
  heading: string;
  subheading?: string;
  body: string[];
  notes?: string;
  showSeal?: boolean;
}

export interface CorporateDoc {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  totalPages: number;
  pdfFilename: string;
  pages: CorporatePage[];
  partners?: ProtocolPartner[];
}

export const PROTOCOL_PARTNERS: ProtocolPartner[] = [
  {
    id: "meb-protokol",
    name: "T.C. Millî Eğitim Bakanlığı",
    category: "Bakanlık & Kamu",
    badgeColor: "bg-emerald-600",
    logo: "/images/mgd-logo.png",
    signDate: "15 Ekim 2025",
    scope: "Ortaöğretim ve Liselerde 'Milli Maarif, Ahlak ve Değerler Eğitimi' İş Birliği Protokolü",
    officialNumber: "MEB-OGM-2025/1442",
    sealColor: "green",
  },
  {
    id: "gsb-protokol",
    name: "T.C. Gençlik ve Spor Bakanlığı",
    category: "Bakanlık & Kamu",
    badgeColor: "bg-red-600",
    logo: "/images/mgd-logo.png",
    signDate: "22 Ağustos 2025",
    scope: "Gençlik Kampları, Spor Tesisleri ve Liderlik Eğitimi Ortak Kullanım Çerçeve Protokolü",
    officialNumber: "GSB-GGM-2025/890",
    sealColor: "blue",
  },
  {
    id: "univ-birligi",
    name: "Üniversiteler Akademik İş Birliği Ağı",
    category: "Üniversite",
    badgeColor: "bg-blue-600",
    logo: "/images/mgd-logo.png",
    signDate: "12 Kasım 2025",
    scope: "34 Devlet ve Vakıf Üniversitesi ile Öğrenci Kulüpleri, Çalıştay ve Lisansüstü Araştırma Bursu Protokolü",
    officialNumber: "UNIV-AKD-2025/77",
    sealColor: "blue",
  },
  {
    id: "vakif-protokol",
    name: "İlim ve İrfan Vakıfları Dayanışma Meclisi",
    category: "Sivil Toplum & Vakıf",
    badgeColor: "bg-emerald-700",
    logo: "/images/mgd-logo.png",
    signDate: "05 Eylül 2025",
    scope: "İhtiyaç Sahibi Üniversite Öğrencilerine Karşılıksız Burs ve Barınma Yurdu Tahsisi Protokolü",
    officialNumber: "VAKIF-BURS-2025/301",
    sealColor: "green",
  },
  {
    id: "d8-genclik",
    name: "Uluslararası D-8 Gençlik Teşkilatları Forumu",
    category: "Sivil Toplum & Vakıf",
    badgeColor: "bg-indigo-700",
    logo: "/images/mgd-logo.png",
    signDate: "30 Ocak 2026",
    scope: "Gelişen 8 Ülke Gençliği Arasında Kültür, Teknoloji ve Kardeşlik Değişim Programı Protokolü",
    officialNumber: "D8-YOUTH-2026/01",
    sealColor: "gold",
  },
];

export const CORPORATE_DOCS: Record<string, CorporateDoc> = {
  hakkimizda: {
    id: "hakkimizda",
    title: "Milli Gençlik Derneği Hakkında",
    subtitle: "Tarihçe, Misyon, Vizyon ve Gençlik Davamız",
    badge: "Kurumsal Tanıtım",
    date: "2026 Resmî Yayını",
    totalPages: 4,
    pdfFilename: "MGD-Hakkimizda-Kurumsal.pdf",
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "BÖLÜM 1: GİRİŞ VE MANİFESTO",
        heading: "Bir Milletin Asıl Gücü Ne Parası Ne Tankıdır; İmanlı Gençliğidir!",
        subheading: "Milli Gençlik Derneği'nin Kuruluş Felsefesi",
        body: [
          "Milli Gençlik Derneği (MGD); milletimizin kadim medeniyet değerlerini, ahlak ve maneviyat şiarını, ilim ve teknoloji aşkını göğsünde taşıyan öncü bir neslin yetişmesi amacıyla kurulmuştur.",
          "Bizler, çağın tüm ifsat edici akımlarına ve yozlaşma rüzgârlarına karşı, gençlerimize sağlam bir sığınak, ahlaki bir pusula ve aydınlık bir gelecek sunmayı kutsal bir vazife addediyoruz.",
          "Genel Merkezimiz koordinasyonunda 81 ilde, yüzlerce ilçe ve 120'den fazla üniversite kampüsünde teşkilatlanan derneğimiz; siyaset üstü bir anlayışla, milletimizin her bir ferdine kucak açmaktadır.",
        ],
        notes: "Milli Gençlik Derneği Genel Kurulu Resmî Bildirgesi'nden derlenmiştir.",
        showSeal: true,
      },
      {
        pageNumber: 2,
        chapterTitle: "BÖLÜM 2: MİSYON VE VİZYON",
        heading: "Ahlak, Maneviyat ve Yerli Teknolojiyle Donanmış Gençlik",
        subheading: "Yeniden Büyük Türkiye ve Adil Bir Dünya İdeali",
        body: [
          "MİSYONUMUZ: Gençlerimizin zihnen, ruhen ve bedenen en yüksek erdemlerle donanmasını sağlamak; ilmi ve ahlaki gelişimi bir arada yürüten, üreten, düşünen ve milletine hizmeti ibadet bilen şuurlu fertler yetiştirmektir.",
          "VİZYONUMUZ: Türkiye'nin her mahallesinde, her üniversitesinde ve her köyünde; adalet, merhamet ve hakkın hâkim olduğu Yeniden Büyük Türkiye'yi kuracak lider kadroları bugünden inşa etmektir.",
          "TEMEL DEĞERLERİMİZ: Önce Ahlak ve Maneviyat, Hak ve Adalet, Kardeşlik ve Dayanışma, İlim ve Fen Aşkı, Emanet Bilinci ve Kararlılık.",
        ],
        notes: "Stratejik Eylem Planı 2025 - 2030",
        showSeal: true,
      },
      {
        pageNumber: 3,
        chapterTitle: "BÖLÜM 3: ÇALIŞMA ALANLARIMIZ",
        heading: "81 İlde Eğitimden Sanata, Teknolojiden İnsani Yardıma",
        subheading: "Gençliğe Dokunan Faaliyet Başlıklarımız",
        body: [
          "1. EĞİTİM VE MAARİF: Üniversite ve lise gençliği için okuma halkaları, liderlik kampları, felsefe, tarih ve medeniyet seminerleri.",
          "2. BİLİM VE TEKNOLOJİ: Gençlerimizin yapay zekâ, robotik, havacılık ve yazılım alanlarında proje geliştirdiği 'Gümüş Motor' atölyeleri.",
          "3. BURS VE SOSYAL DESTEK: Her yıl binlerce üniversite öğrencisine karşılıksız eğitim bursu, barınma imkânı ve kırtasiye desteği.",
          "4. AFET VE ARAMA KURTARMA: Olası afet durumlarında eğitimli genç gönüllülerimizle milletimizin yardımına koşan 'MGD Arama Kurtarma' birimi.",
        ],
        notes: "Tüm faaliyetler kamu denetimine ve Dernekler Bilgi Sistemi'ne (DERBİS) açıktır.",
        showSeal: false,
      },
      {
        pageNumber: 4,
        chapterTitle: "BÖLÜM 4: TEŞKİLAT VE YÖNETİM",
        heading: "Şeffaf, Katılımcı ve Güçlü Teşkilat Mimarisi",
        subheading: "Genel Merkezden 81 İl ve Üniversiteye Uzanan Ağ",
        body: [
          "Derneğimiz, Genel Başkanımız Ahmet Özvatan riyasetinde toplanan Başkanlık Divanı ve Genel Yönetim Kurulu tarafından sevk ve idare edilmektedir.",
          "81 ilimizde il başkanlıklarımız, ilçe temsilciliklerimiz ve üniversite başkanlıklarımız tam bir koordinasyon içerisinde çalışmalarını sürdürmektedir.",
          "Gençliğimizin dinamizmi ve büyüklerimizin tecrübesiyle harmanlanan bu kutlu çatı, milletimizin istikbal güvencesidir.",
        ],
        notes: "Milli Gençlik Derneği Genel Merkezi - Çankaya / Ankara",
        showSeal: true,
      },
    ],
  },
  tuzuk: {
    id: "tuzuk",
    title: "Milli Gençlik Derneği Resmî Tüzüğü",
    subtitle: "Amaç, İlke, Üyelik, Organlar ve Teşkilat Esasları",
    badge: "Resmî Tüzük",
    date: "T.C. Mülki İdare Onaylı",
    totalPages: 4,
    pdfFilename: "MGD-Resmi-Dernek-Tuzugu.pdf",
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "BÖLÜM I: GENEL HÜKÜMLER",
        heading: "Madde 1 - 4: Derneğin Adı, Merkezi ve Amacı",
        subheading: "Dernek Kuruluş Maddeleri",
        body: [
          "MADDE 1 - DERNEĞİN ADI VE GENEL MERKEZİ: Derneğin adı 'MİLLİ GENÇLİK DERNEĞİ'dir. Kısa adı 'MGD'dir. Genel Merkezi Ankara ilindedir. Dernek yurt içinde 81 il ve ilçelerde şubeler, temsilcilikler açabilir; yurt dışında uluslararası temsilcilikler teşkil edebilir.",
          "MADDE 2 - DERNEĞİN AMACI: Milletimizin köklü tarihi, milli ve manevi değerlerini özümsemiş; vatanına ve bayrağına sadakatle bağlı, ahlak ve maneviyat timsali, ilim ve fen sahasında donanımlı öncü bir gençliğin yetişmesini temin etmektir.",
          "MADDE 3 - ÇALIŞMA KONULARI: Gençlerin ilmi, fikri, bedeni ve ahlaki gelişimini temin edecek konferanslar, kamplar, atölyeler ve sportif faaliyetler tertip etmek; ihtiyaç sahibi öğrencilere burs ve barınma sağlamaktır.",
        ],
        notes: "5253 sayılı Dernekler Kanunu hükümlerine göre tescil edilmiştir.",
        showSeal: true,
      },
      {
        pageNumber: 2,
        chapterTitle: "BÖLÜM II: ÜYELİK HÜKÜMLERİ",
        heading: "Madde 5 - 8: Üye Olma Hakkı, Haklar ve Yükümlülükler",
        subheading: "Teşkilat Üyelik Esasları",
        body: [
          "MADDE 5 - ÜYELİK ŞARTLARI: Fiil ehliyetine sahip bulunan ve derneğin gayesini benimseyen her Türkiye Cumhuriyeti vatandaşı derneğe üye olma hakkına sahiptir. Mevzuatın üye olmasını yasakladığı kişiler üye olamaz.",
          "MADDE 6 - ÜYELİKTEN ÇIKMA: Her üye, yazılı olarak bildirmek kaydıyla, dernekten çıkma hakkına sahiptir. Çıkma dilekçesi yönetim kuruluna ulaştığı anda çıkış işlemi tamamlanmış sayılır.",
          "MADDE 7 - ÜYELİKTEN ÇIKARILMA: Dernek tüzüğüne aykırı davranışlarda bulunmak, verilen görevlerden sürekli kaçınmak ve dernek gayesine zarar verici eylemlerde bulunmak üyelikten ihraç sebebidir.",
        ],
        notes: "Üyelik kayıtları DERBİS dijital kütüğünde saklanmaktadır.",
        showSeal: true,
      },
      {
        pageNumber: 3,
        chapterTitle: "BÖLÜM III: DERNEĞİN ORGANLARI",
        heading: "Madde 9 - 13: Genel Kurul, Yönetim ve Denetim Kurulları",
        subheading: "Yönetim Organlarının Görev ve Yetkileri",
        body: [
          "MADDE 9 - DERNEK ORGANLARI: Derneğin zorunlu organları: a) Genel Kurul, b) Yönetim Kurulu (Başkanlık Divanı), c) Denetim Kurulu'dur. İhtiyari olarak Danışma ve Yüksek İstişare Kurulları oluşturulabilir.",
          "MADDE 10 - GENEL KURULUN TOPLANMASI: Genel Kurul, 3 yılda bir olağan olarak Ankara'da toplanır. Yönetim veya Denetim Kurulunun gerekli gördüğü hallerde veya üyelerin beşte birinin yazılı isteği üzerine olağanüstü toplanabilir.",
          "MADDE 11 - YÖNETİM KURULU: Yönetim Kurulu, Genel Kurulca seçilen Genel Başkan ve asil üyelerden teşekkül eder. Derneği temsil yetkisi Genel Başkana aittir.",
        ],
        notes: "Genel Kurul kararları salt çoğunlukla alınır.",
        showSeal: true,
      },
      {
        pageNumber: 4,
        chapterTitle: "BÖLÜM IV: MALİ HÜKÜMLER VE DENETİM",
        heading: "Madde 14 - 18: Gelirler, Giderler ve İç Denetim Standartları",
        subheading: "Mali Şeffaflık ve Hesap Verebilirlik",
        body: [
          "MADDE 14 - DERNEĞİN GELİRLERİ: a) Üye aidatları, b) Gerçek ve tüzel kişilerin kendi isteğiyle yaptıkları bağış ve yardımlar, c) Sosyal ve kültürel faaliyetlerden sağlanan gelirler, d) İktisadi işletme gelirleri.",
          "MADDE 15 - BORÇLANMA USULLERİ: Dernek, amacını gerçekleştirmek ve faaliyetlerini yürütebilmek için ihtiyaç duyulması halinde Yönetim Kurulu kararı ile borçlanabilir. Ancak bu borçlanma derneğin gelir kaynakları ile karşılanamayacak miktarlarda yapılamaz.",
          "MADDE 16 - İÇ DENETİM: Dernekte Genel Kurul, Yönetim Kurulu veya Denetim Kurulu tarafından iç denetim yapılabileceği gibi, bağımsız denetim kuruluşlarına da denetim yaptırılabilir.",
        ],
        notes: "Tüzüğün resmî nüshası Genel Merkez Hukuk Müşavirliği'nde muhafaza edilmektedir.",
        showSeal: true,
      },
    ],
  },
  protokoller: {
    id: "protokoller",
    title: "Resmî Kurumsal Protokollerimiz",
    subtitle: "Bakanlıklar, Üniversiteler ve Vakıflarla İmzalanan Resmî İş Birliği Belgeleri",
    badge: "Resmî Protokoller",
    date: "2025 - 2026 Yürürlükteki Belgeler",
    totalPages: 3,
    pdfFilename: "MGD-Resmi-Isbirligi-Protokolleri.pdf",
    partners: PROTOCOL_PARTNERS,
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "KAMU KURUM VE BAKANLIK PROTOKOLLERİ",
        heading: "Millî Eğitim Bakanlığı & Gençlik ve Spor Bakanlığı Protokolleri",
        subheading: "T.C. Resmî Kurumlarıyla Ortak Gençlik Seferberliği",
        body: [
          "MİLLÎ EĞİTİM BAKANLIĞI ORTAK ÇALIŞMA PROTOKOLÜ (No: MEB-OGM-2025/1442): 81 ildeki ortaöğretim kurumlarında öğrencilerimizin milli şuur, medeniyet tarihi ve güzel ahlak dersleriyle buluşmasını temin eden ortak eğitim protokolüdür.",
          "GENÇLİK VE SPOR BAKANLIĞI TESİS VE KAMP PROTOKOLÜ (No: GSB-GGM-2025/890): Bakanlığa bağlı gençlik kampları, spor salonları ve eğitim tesislerinin derneğimizin ahlaki ve bedeni gelişim kamplarında tahsisini düzenleyen resmî belgedir.",
          "Her iki protokol de T.C. Resmî Gazete ve ilgili bakanlık tebliğleri doğrultusunda yürürlükte olup, 81 il valiliği ve il müdürlüklerince uygulanmaktadır.",
        ],
        notes: "İmzalar: T.C. Millî Eğitim Bakanı & MGD Genel Başkanı Ahmet Özvatan",
        showSeal: true,
      },
      {
        pageNumber: 2,
        chapterTitle: "AKADEMİK VE ÜNİVERSİTE PROTOKOLLERİ",
        heading: "34 Üniversite İle Ortak Çalıştay ve Araştırma Bursu Protokolü",
        subheading: "Kampüslerde İlim, İrfan ve Yerli Teknoloji İş Birliği",
        body: [
          "ÜNİVERSİTELER BİRLİĞİ AKADEMİK PROTOKOLÜ (No: UNIV-AKD-2025/77): Türkiye'nin saygın 34 üniversitesinde faaliyet gösteren Milli Maarif kulüplerimize akademik danışmanlık, konferans salonu tahsisi ve ortak kütüphane erişimini kapsar.",
          "LİSANSÜSTÜ VE DOKTORA DESTEK PROTOKOLÜ: Sosyal bilimler, yapay zekâ, savunma sanayii ve İslam iktisadı alanlarında tez hazırlayan yüksek lisans ve doktora öğrencilerine MGD Araştırma Fonu'ndan karşılıksız burs sağlanması taahhüt edilmiştir.",
          "Akademisyen heyetlerimizin denetiminde her dönem 1500'ü aşkın genç araştırmacı bu protokollerden faydalanmaktadır.",
        ],
        notes: "Üniversiteler Rektörlükler Kurulu Onaylı Resmî Metin",
        showSeal: true,
      },
      {
        pageNumber: 3,
        chapterTitle: "SİVİL TOPLUM VE ULUSLARARASI PROTOKOLLER",
        heading: "Vakıflar Meclisi ve D-8 Uluslararası Gençlik Değişim Protokolleri",
        subheading: "Karşılıksız Burs, Barınma ve Küresel Kardeşlik Köprüleri",
        body: [
          "İLİM VE İRFAN VAKIFLARI DAYANIŞMA PROTOKOLÜ (No: VAKIF-BURS-2025/301): Türkiye genelinde 42 vakıf ile müştereken yürütülen protokol kapsamında; ihtiyaç sahibi üniversite öğrencilerimize yurt, ev ve burs desteği kesintisiz verilmektedir.",
          "ULUSLARARASI D-8 GENÇLİK PROTOKOLÜ (No: D8-YOUTH-2026/01): Merhum Prof. Dr. Necmettin Erbakan Hocamızın kurduğu Gelişen 8 Ülke (Türkiye, Malezya, Endonezya, Pakistan, Bangladeş, İran, Mısır, Nijerya) gençlik teşkilatları arasında kardeşlik köprüsü kuran tarihi iş birliği belgesidir.",
          "Milli Gençlik Derneği; sadece Türkiye'de değil, tüm mazlum coğrafyalarda adalet ve hakkın savunucusu olma azmindedir.",
        ],
        notes: "D-8 Genel Sekreterliği ve MGD Dış İlişkiler Başkanlığı Arşivi",
        showSeal: true,
      },
    ],
  },
  kurumsalKimlik: {
    id: "kurumsalKimlik",
    title: "Kurumsal Kimlik & Logo Kullanım Kılavuzu",
    subtitle: "Logo Standartları, Renk Kodları, Tipografi ve Bayrak Standartları",
    badge: "Kurumsal Standart",
    date: "v2.0 Güncellemesi",
    totalPages: 3,
    pdfFilename: "MGD-Kurumsal-Kimlik-Kilavuzu.pdf",
    pages: [
      {
        pageNumber: 1,
        chapterTitle: "LOGO STANDARTLARI VE GAYESİ",
        heading: "Hilal ve Gençliğin Kucaklaşması: MGD Amblemi",
        subheading: "Geometri, Oranlar ve Kullanım Kuralları",
        body: [
          "AMBLEM FELSEFESİ: Milli Gençlik Derneği amblemi; bağımsızlığımızın, milli şuurumuzun ve inancımızın timsali olan kutlu Hilal ile, milletimizin istikbalini omuzlayan gençlik figürünün kusursuz ahengini temsil eder.",
          "ORANLAR VE EMNİYET ALANI: Logo çevresinde en az 'M' harfi yüksekliği kadar koruma alanı bırakılmalı; logonun üzerine metin, fotoğraf veya başka şekiller bindirilmemelidir.",
          "HATA VE YASAK KULLANIMLAR: Logo en/boy oranı bozulamaz, eğilemez, degradeye zorlanamaz ve derneğin onaylamadığı renklerde kullanılamaz.",
        ],
        notes: "Vektörel SVG ve Yüksek Çözünürlüklü PNG Formatları Resmî Sitede Yayındadır.",
        showSeal: true,
      },
      {
        pageNumber: 2,
        chapterTitle: "KURUMSAL RENK PALETİ VE KODLAR",
        heading: "Resmî Renk Standartları (CMYK, RGB, HEX, Pantone)",
        subheading: "Baskı ve Dijital Medya Uyum Standartları",
        body: [
          "1. GECE MAVİSİ (PRIMARY): HEX: #0A192F | RGB: 10, 25, 47 | CMYK: 90, 75, 40, 60. Anlamı: Derinlik, köklü kurumsal ciddiyet ve sarsılmaz güven.",
          "2. MİLLİ MAVİ (SECONDARY): HEX: #2563EB | RGB: 37, 99, 235 | CMYK: 85, 60, 0, 0. Anlamı: Gençliğin dinamizmi, yüksek vizyon ve hareket şuuru.",
          "3. ARTIK BEYAZ: HEX: #FFFFFF | Temizlik, doğruluk ve samimiyet.",
          "4. ZÜMRÜT YEŞİLİ (PROTOKOL VE MÜHÜR): HEX: #059669 | RGB: 5, 150, 105. Resmî mühür, berat ve takdirnamelerde kullanılır.",
        ],
        notes: "Tüm matbaa baskılarında Pantone Formula Guide standartlarına riayet edilmelidir.",
        showSeal: true,
      },
      {
        pageNumber: 3,
        chapterTitle: "BAYRAK, FLAMA VE ANTETLİ STANDARTLAR",
        heading: "Teşkilat Binaları, Salonlar ve Resmî Yazışma Şablonları",
        subheading: "Açık ve Kapalı Alan Kullanım Normları",
        body: [
          "BAYRAK VE FLAMA STANDARTLARI: Dernek bayrağı 100x150 cm, 150x225 cm ebatlarında ve dikey flamalarda beyaz saten veya raşel kumaş üzerine Gece Mavisi logo baskısı ile imal edilir.",
          "RESMÎ YAZIŞMA ŞABLONU: Genel Merkez ve 81 il başkanlığı yazışmalarında sol üstte MGD resmî logosu, sağ üstte T.C. Dernekler kütük numarası yer alır. Yazı fontu olarak Inter veya Arial kullanılmalıdır.",
          "KİMLİK KARTLARI: Tüm üye ve temsilcilik kartları QR kodlu, çift yüzlü güvenlik hologramlı olarak Genel Merkez Bilgi İşlem Başkanlığı'nca basılır.",
        ],
        notes: "Milli Gençlik Derneği Basın ve Kurumsal İletişim Başkanlığı",
        showSeal: true,
      },
    ],
  },
};
