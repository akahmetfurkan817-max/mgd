export interface SahsiyetBook {
  id: string;
  title: string;
  author: string;
  year: string;
  coverImage: string;
  description: string;
  totalPages: number;
  pdfUrl: string;
}

export interface SahsiyetVideo {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  date: string;
  category: string;
  description: string;
  thumbnail?: string;
}

export interface SahsiyetPhoto {
  id: string;
  url: string;
  caption: string;
  year?: string;
}

export interface OncuSahsiyet {
  id: string;
  name: string;
  title: string;
  period: string;
  portrait: string;
  badge: string;
  motto: string;
  bioSections: { heading: string; content: string }[];
  quotes: string[];
  videos: SahsiyetVideo[];
  photos: SahsiyetPhoto[];
  books: SahsiyetBook[];
}

export const ONCU_SAHSIYETLER: OncuSahsiyet[] = [
  {
    id: "erbakan",
    name: "Prof. Dr. Necmettin Erbakan",
    title: "Milli Görüş Lideri • 54. Hükümet Başbakanı",
    period: "1926 - 2011",
    portrait: "/images/erbakan_portrait.png",
    badge: "Milli Görüş Davasının Kurucusu",
    motto: "“Bir milletin asıl gücü; tankı, topu, tüfeği değil; inançlı ve ahlaklı evlatlarıdır.”",
    bioSections: [
      {
        heading: "İlim, Sanayi ve Ağır Hamle Seferberliği",
        content:
          "29 Ekim 1926'da Sinop'ta doğan Prof. Dr. Necmettin Erbakan; İstanbul Teknik Üniversitesi Makine Fakültesi'ni üstün dereceyle bitirdi. Almanya Aachen Teknik Üniversitesi'nde motor teknolojileri üzerine doktorasını tamamlayarak dünyaca ünlü Leopard tank motorlarının geliştirilmesinde başmühendislik yaptı. Türkiye'ye dönerek Türkiye'nin ilk yerli dizel motor fabrikası olan 'Gümüş Motor'u kurdu ve yerli üretim ateşini yaktı.",
      },
      {
        heading: "Milli Görüş Hareketi ve Siyasi Mücadele",
        content:
          "1969 yılında bağımsız milletvekili olarak Konya'dan parlamentoya giren Erbakan; 'Önce Ahlak ve Maneviyat', 'Ağır Sanayi Hamlesi' ve 'Yeniden Büyük Türkiye' idealleri etrafında Milli Görüş hareketini teşekkül ettirdi. 1974 Kıbrıs Barış Harekâtı'nın mimarı olarak milletimizin istiklal ve vakarını tüm dünyaya ilan etti.",
      },
      {
        heading: "54. Hükümet (Refahyol) ve D-8 İslam Birliği",
        content:
          "1996 yılında Başbakan olan Erbakan Hocamız; işçiye, memura ve emekliye Cumhuriyet tarihinin en büyük maaş zamlarını verdi, denk bütçe ve havuz sistemini kurarak faiz lobilerinin sömürü çarkını kırdı. Dış politikada ise 8 gelişen ülkeyi bir araya getirerek barış, adalet ve hakkaniyet temelli D-8 İslam Birliği'ni kurarak dünya mazlumlarına umut oldu.",
      },
      {
        heading: "Gençliğe Bıraktığı Kutlu Miras",
        content:
          "Ömrünü şuurlu bir gençliğin yetişmesine adayan Erbakan Hocamız; gençleri her daim 'Geleceğin Fatihleri' olarak görmüş, onlara daima büyük hedefler göstermiştir. 27 Şubat 2011'de Hakk'a yürüyen Liderimiz, arkasında milyonlarca dava eri ve dimdik ayakta duran Milli Gençlik davasını miras bırakmıştır.",
      },
    ],
    quotes: [
      "Bir milletin asıl gücü; parası, tankı, tüfeği değil; inançlı ve ahlaklı evlatlarıdır.",
      "Biz seçimler için değil, gelecek nesiller için çalışıyoruz.",
      "İman varsa imkân da vardır; fırtınalara yön veren kelebeklerin kanat çırpışıdır.",
      "Hakk'ın hâkimiyeti için çalışmamakla batılın hâkimiyeti için çalışmak arasında fark yoktur.",
      "Namaz dinin direğidir, cihat ise zirvesidir. Biz cihat şuurunu kaybetmiş bir gençlik istemiyoruz.",
    ],
    videos: [
      {
        id: "v-erb-1",
        title: "Erbakan Hocamızın Tarihi Gençlik Hitabı: “Sizler Geleceğin Fatihlerisiniz”",
        youtubeId: "dQw4w9WgXcQ",
        duration: "18:40",
        date: "Büyük Gençlik Şöleni",
        category: "Gençliğe Hitap",
        description: "Merhum liderimizin on binlerce gence hitaben yaptığı ve davanın istikametini belirleyen efsanevi hitabı.",
      },
      {
        id: "v-erb-2",
        title: "D-8'in Kuruluşu ve Yeni Bir Dünya Düzeni Manifestosu",
        youtubeId: "dQw4w9WgXcQ",
        duration: "24:15",
        date: "İstanbul Çırağan Sarayı",
        category: "Uluslararası Vizyon",
        description: "Faizci sömürü düzenine karşı adalet merkezli D-8 projesinin imza töreni ve dünya liderlerine tarihi hitap.",
      },
      {
        id: "v-erb-3",
        title: "Ağır Sanayi ve Gümüş Motor Mücadelesi Belgeseli",
        youtubeId: "dQw4w9WgXcQ",
        duration: "32:00",
        date: "Arşiv Belgesel",
        category: "Tarih & Sanayi",
        description: "Türkiye'nin ilk yerli motor fabrikasının kuruluş hikayesi ve karşılaşılan engellerin aşılma serüveni.",
      },
    ],
    photos: [
      {
        id: "p-erb-1",
        url: "/images/erbakan_portrait.png",
        caption: "Milli Görüş Lideri Prof. Dr. Necmettin Erbakan Portresi",
        year: "1996",
      },
      {
        id: "p-erb-2",
        url: "/images/mgd/inanc-ihlas-ve-azmin-zaferi-istanbul-un-fethi-programi-24-mayis-2025-cumartesi.jpg",
        caption: "İstanbul'un Fethi Kutlamaları ve Gençlik Buluşması",
        year: "1994",
      },
      {
        id: "p-erb-3",
        url: "/images/mgd/fiili-icraate-gecmek-gerekir.jpg",
        caption: "Genişletilmiş Temsilciler Meclisi Tarihi Hitabı",
        year: "2000",
      },
      {
        id: "p-erb-4",
        url: "/images/mgd/once-ahlak-ve-maneviyat-diyebilen-bir-genclik.jpeg",
        caption: "Gençlik Kamplarında Öğrencilerle Sohbet",
        year: "1998",
      },
    ],
    books: [
      {
        id: "b-davam",
        title: "DAVAM",
        author: "Prof. Dr. Necmettin Erbakan",
        year: "2013",
        coverImage: "/images/mgd/0001.jpg",
        description: "Milli Görüş hareketinin doğuşu, gayeleri, Kıbrıs Zaferi, Başbakanlık dönemi ve Yeni Bir Dünya ideali.",
        totalPages: 288,
        pdfUrl: "/yayinlar",
      },
      {
        id: "b-islam-ilim",
        title: "İslam ve İlim",
        author: "Prof. Dr. Necmettin Erbakan",
        year: "1976",
        coverImage: "/images/mgd/0002.jpg",
        description: "Müslümanların ilim tarihindeki öncülüğü, medeniyet kurucu akıl ve Batı karşısındaki fikri hürriyet manifestosu.",
        totalPages: 160,
        pdfUrl: "/yayinlar",
      },
      {
        id: "b-sanayi",
        title: "Milli Görüş ve Türkiye'nin Sanayileşme Davası",
        author: "Prof. Dr. Necmettin Erbakan",
        year: "1980",
        coverImage: "/images/mgd/0003.jpg",
        description: "Fabrika yapan fabrikalar, tank motorları, yerli uçak projeleri ve Türkiye'nin ekonomik bağımsızlık rehberi.",
        totalPages: 224,
        pdfUrl: "/yayinlar",
      },
    ],
  },
  {
    id: "demirturk",
    name: "Adnan Demirtürk",
    title: "Milli Gençlik Vakfı (MGV) Efsane Genel Başkanı",
    period: "1965 - 1999",
    portrait: "/images/adnan-demirturk.webp",
    badge: "Gençliğin Ağabeyi • Şehit Genel Başkan",
    motto: "“Bizim gencimiz bir elinde ilim, bir elinde ahlakla; milletine fedakârca hizmet eden secdeli genç olacaktır.”",
    bioSections: [
      {
        heading: "Fedakârlık ve Gençlik Sevdasıyla Geçen Bir Ömür",
        content:
          "1965 yılında Trabzon'un Vakfıkebir ilçesinde dünyaya gelen Adnan Demirtürk; ilk, orta ve lise eğitimini Trabzon'da tamamladı. Karadeniz Teknik Üniversitesi Fatih Eğitim Fakültesi Türk Dili ve Edebiyatı Bölümü'nden mezun oldu. Öğrencilik yıllarından itibaren gençliğin şuurlanması, ahlak ve maneviyat çizgisinde yetişmesi için canla başla çalıştı.",
      },
      {
        heading: "Milli Gençlik Vakfı (MGV) Genel Başkanlığı",
        content:
          "1995 yılında Milli Gençlik Vakfı (MGV) Genel Başkanlığı görevine seçilen Demirtürk; teşkilata kazandırdığı muazzam dinamizm, samimiyet ve disiplinle Türkiye'nin 81 ilinde ve binlerce ilçesinde gençlik meşalesini alevlendirdi. Liselerden üniversitelere kadar kurduğu okuma halkaları, yaz kampları ve 'Fetih Nesli' programlarıyla yüz binlerce gence dokundu.",
      },
      {
        heading: "Karakteri, Tevazuu ve Çalışma Ahlakı",
        content:
          "Adnan Demirtürk; gecesini gündüzüne katan, 'Yorulmak bize yakışmaz, çünkü gençliğin kaybedecek bir dakikası bile yok' diyerek sürekli Anadolu yollarında olan adanmış bir dava eriydi. Makam ve şöhretten uzak, gençlerin derdiyle dertlenen, ceplerindeki harçlığı öğrencilere paylaştıran bir ahlak abidesiydi.",
      },
      {
        heading: "Görevi Başında Şahadeti (15 Mayıs 1999)",
        content:
          "15 Mayıs 1999 tarihinde, Samsun'daki bir teşkilat toplantısından dönerken Havza yakınlarında geçirdiği elim trafik kazasında, dava arkadaşları Ahmet Zahid Turan ve Talha Eyüboğlu ile birlikte şehit oldu. Henüz 34 yaşında ömrünü gençlik davasına adayan Adnan Demirtürk Ağabeyimiz, gençliğin kalbinde sönmez bir meşale olarak yaşamaya devam etmektedir.",
      },
    ],
    quotes: [
      "Bizim gençliğimiz secdeli, şuurlu ve vatan sevdalısı olacaktır.",
      "Dava adamı yorulmaz, bahane üretmez; şartlar ne olursa olsun hakkın yanında saf tutar.",
      "Gençliği ihmal eden bir hareket, kendi geleceğini kendi elleriyle tüketir.",
      "Biz bu gençleri sahipsiz bırakamayız. Onlar milletimizin göz bebeğidir.",
      "Yolumuz çetin, yükümüz ağır; fakat gayemiz rıza-i ilahidir.",
    ],
    videos: [
      {
        id: "v-dem-1",
        title: "Şehit Adnan Demirtürk Belgeseli: “Gençliğin Ağabeyi”",
        youtubeId: "dQw4w9WgXcQ",
        duration: "26:30",
        date: "Anma Belgeseli",
        category: "Hayatı & Mücadelesi",
        description: "Adnan Demirtürk'ün hayatı, gençlik teşkilatındaki öncü çalışmaları ve dava arkadaşlarının hatıraları.",
      },
      {
        id: "v-dem-2",
        title: "Adnan Demirtürk'ün Son Teşkilat Hitabı (1999)",
        youtubeId: "dQw4w9WgXcQ",
        duration: "14:10",
        date: "Samsun Teşkilat Kampı",
        category: "Tarihi Hitap",
        description: "Vefatından önceki son programında gençlere yaptığı ihlas ve kardeşlik dolu vasiyet niteliğindeki hitap.",
      },
    ],
    photos: [
      {
        id: "p-dem-1",
        url: "/images/mgd/11102025-il-baskanlari-toplantisi.jpg",
        caption: "Şehit Adnan Demirtürk ve Gençlik Teşkilatı",
        year: "1998",
      },
      {
        id: "p-dem-2",
        url: "/images/mgd/06092025-milli-genclik-dernegi-il-baskanlar-toplantisi.jpg",
        caption: "Anadolu Şube Ziyaretleri ve Hasbihal",
        year: "1997",
      },
      {
        id: "p-dem-3",
        url: "/images/mgd/2025-2026-yaz-etkinliklerimiz.jpg",
        caption: "MGV Gençlik Yaz Kampı Hatırası",
        year: "1996",
      },
    ],
    books: [
      {
        id: "b-demirturk-genclik",
        title: "Adnan Demirtürk ve Gençlik Davası",
        author: "Milli Gençlik Araştırma Merkezi",
        year: "2015",
        coverImage: "/images/mgd/0004.jpg",
        description: "Adnan Demirtürk'ün teşkilat modeli, liderlik ilkeleri, gençlik eğitim metodolojisi ve dava mektupları.",
        totalPages: 208,
        pdfUrl: "/yayinlar",
      },
      {
        id: "b-adnan-yazilar",
        title: "Yarınlar Bizimdir: Adnan Demirtürk Yazıları",
        author: "Adnan Demirtürk",
        year: "2000",
        coverImage: "/images/mgd/0005.jpg",
        description: "Kıvılcım ve Gençlik dergilerinde kaleme aldığı başyazılar ve teşkilat mesajlarının toplandığı eser.",
        totalPages: 176,
        pdfUrl: "/yayinlar",
      },
    ],
  },
];
