export interface CorporateDoc {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  date: string;
  content: string;
  sections?: { title: string; text: string }[];
}

export const CORPORATE_DOCS: Record<string, CorporateDoc> = {
  tuzuk: {
    id: "tuzuk",
    title: "Milli Gençlik Derneği Resmî Tüzüğü",
    subtitle: "Amaç, İlke, Üyelik ve Teşkilat Esasları",
    badge: "Resmî Belge",
    date: "Son Güncelleme: 2026",
    content: `MADDE 1: DERNEĞİN ADI VE GENEL MERKEZİ
Derneğin adı "MİLLİ GENÇLİK DERNEĞİ"dir. Kısa adı "MGD"dir. Derneğin Genel Merkezi Ankara'dadır. Yurt içinde 81 ilde ve yurt dışında şubeler, temsilcilikler ve irtibat büroları açabilir.

MADDE 2: DERNEĞİN GAYESİ VE İLKELERİ
Milli Gençlik Derneği; milletimizin tarihi, milli ve manevi değerlerini özümsemiş, vatanına ve bayrağına sadakatle bağlı, ahlak ve maneviyat timsali, ilim ve fen sahasında donanımlı, düşünen ve üreten öncü bir gençliğin yetişmesini temin etmek gayesiyle kurulmuştur.

MADDE 3: DERNEĞİN FAALİYET ALANLARI
a) Gençliğin ilmi, ahlaki, kültürel ve bedeni gelişimini destekleyecek seminerler, konferanslar, kamplar ve yarışmalar düzenlemek.
b) İhtiyaç sahibi öğrencilere burs, barınma, kırtasiye ve eğitim materyali desteğinde bulunmak.
c) Kitap, dergi, bülten ve dijital yayınlar neşrederek milli şuuru yaygınlaştırmak.
d) Afet ve acil durumlarda gençlik arama-kurtarma ve sosyal yardım ekipleri teşkil etmek.

MADDE 4: ÜYELİK VE TEŞKİLATLANMA
Dernek tüzüğünü kabul eden, milli ve ahlaki değerlere saygılı, kanunların derneklere üye olmasını yasaklamadığı her Türkiye Cumhuriyeti vatandaşı derneğe üye olabilir.`,
  },
  program: {
    id: "program",
    title: "Milli Gençlik Derneği Teşkilat Programı",
    subtitle: "2025 - 2030 Gençlik Eylem Planı & Çalışma Esasları",
    badge: "Vizyon Belgesi",
    date: "2025 - 2030",
    content: `MİLLİ GENÇLİK DERNEĞİ TEŞKİLAT PROGRAMI VE HEDEFLERİ

1. ŞAHSİYETLİ VE İNANÇLI GENÇLİK İNŞASI
* 81 ilde 'Milli Maarif Okuma Halkaları'nın kesintisiz sürdürülmesi.
* Karakter ve liderlik eğitimi seminerlerinin her ay düzenli icra edilmesi.
* Gençleri her türlü ifsat, bağımlılık ve zararlı akımlardan koruyacak 'Rehber Gençlik' masalarının kurulması.

2. ÜNİVERSİTE VE AKADEMİK ÇALIŞMALAR
* 120'den fazla üniversite temsilciliğimizde bilim, felsefe, teknoloji ve medeniyet kulüpleriyle ortak akademik çalıştaylar.
* Ulusal ve uluslararası hakemli gençlik dergimizin akademik yayın hayatına kazandırılması.
* Lisansüstü ve doktora öğrencilerine özel araştırma fonları.

3. TEKNOLOJİ VE YERLİ ÜRETİM SEFERBERLİĞİ
* 'Gümüş Motor' atölyeleriyle gençlerin yazılım, robotik, yapay zekâ ve insansız hava araçları projelerinin desteklenmesi.
* Genç girişimcilere teknik ve hukuki mentorluk ağının sağlanması.

4. DIŞ İLİŞKİLER VE MAZLUM COĞRAFYALARLA DAYANIŞMA
* D-8 ülkeleri gençlik sivil toplum örgütleriyle yıllık 'Uluslararası Gençlik Zirvesi'.
* Filistin, Kudüs ve gönül coğrafyamız için sürekli insani yardım ve bilinçlendirme çalışmaları.`,
  },
  gelirGider: {
    id: "gelirGider",
    title: "Mali Şeffaflık & Gelir-Gider Raporu",
    subtitle: "Dernekler Kanunu ve İç Denetim Standartları Uyarınca Şeffaf Yönetim",
    badge: "Mali Rapor",
    date: "2025-2026 Dönemi",
    content: `MALİ ŞEFFAFLIK VE HESAP VEREBİLİRLİK İLKESİ

Milli Gençlik Derneği olarak; milletimizin helal bağış ve aidatlarını emanet şuuruyla yönetiyor, her bir kuruşun hesabını hem milletimize hem de ilgili resmî denetim organlarına şeffaflıkla sunuyoruz.

GELİR KALEMLERİMİZ (2025-2026):
* Üye Aidatları: %18
* Gönüllü Bağışları (Banka & Online): %52
* İktisadi İşletme & Yayın Gelirleri: %20
* Şartlı Bağışlar (Öğrenci Bursları): %10

GİDER KALEMLERİMİZ:
* Öğrenci Eğitim Bursları & Barınma Destekleri: %38
* Teşkilat & Gençlik Eğitim Faaliyetleri (Kamplar, Seminerler): %32
* Basın, Yayın & Dijital İçerik Üretimi: %15
* Genel Merkez & Temsilcilik İdari Giderleri: %15

Denetleme Kurulumuz ve Bağımsız Mali Müşavirlik raporları Dernekler Bilgi Sistemi (DERBİS) üzerinden mülki idare amirliklerine periyodik olarak arz edilmektedir.`,
  },
  kurumsalKimlik: {
    id: "kurumsalKimlik",
    title: "Kurumsal Kimlik & Logo Kullanım Kılavuzu",
    subtitle: "Logo Vektörleri, Kurumsal Renk Paleti ve Tipografi",
    badge: "Kurumsal Standart",
    date: "v2.0 Standartları",
    content: `MİLLİ GENÇLİK DERNEĞİ KURUMSAL KİMLİK KILAVUZU

1. LOGO FELSEFESİ
Milli Gençlik Derneği amblemi; bağımsızlığımızın ve inancımızın sembolü olan hilal ile milletimizin istikbalini kucaklayan dinamik gençlik formunun lacivert ve beyazın asaletinde buluşmasını temsil eder.

2. KURUMSAL RENK PALETİ:
* Primary (Gece Mavisi): #0A192F / #172554 (Güven, asalet, köklü kurumsal duruş)
* Secondary (Kraliyet Mavisi): #2563EB (Dinamizm, vizyon, hareket)
* Accent (Gökyüzü Mavisi): #38BDF8 / #60A5FA (Umut, ufuk, berraklık)
* Background: #FFFFFF (Arı duruluk) ve #F8FAFC (Yumuşak açık gri kart zeminleri)
* Text / Slate: #0F172A (Yüksek okunabilirlik)

3. TİPOGRAFİ:
* Başlıklar: Sans-serif modern font ailesi (Inter / Montserrat), bold ve net ağırlıklar.
* Metinler: Temiz okunabilirlik sağlayan, satır aralıkları ferah tipografik hiyerarşi.

4. MATERYAL İNDİRME:
* Resmî Logo (Vektörel SVG & PNG şeffaf zemin)
* Kurumsal Antetli Kağıt & Zarf Şablonları
* Bayrak ve Flama Standartları`,
  },
};
