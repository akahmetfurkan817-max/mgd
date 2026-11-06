"use client";

import Image from "next/image";
import {
  Briefcase,
  ExternalLink,
  Heart,
  Instagram,
  Layers,
  Phone,
  Play,
  UserCheck,
} from "lucide-react";

interface InstagramGridItem {
  id: string;
  image: string;
  title: string;
  type?: "video" | "carousel" | "photo";
  likes: string;
}

const INSTAGRAM_POSTS: InstagramGridItem[] = [
  {
    id: "ig-1",
    image: "/images/slider/burs-universite.jpg",
    title: "Türkiye Geneli Eğitim & Burs Başvuruları Başladı",
    type: "video",
    likes: "2.4B",
  },
  {
    id: "ig-2",
    image: "/images/slider/genclik-soleni.jpg",
    title: "Ekim Ayı Şube İnsan Kaynakları ve Halkla İlişkiler Komisyon Toplantısı",
    type: "carousel",
    likes: "1.8B",
  },
  {
    id: "ig-3",
    image: "/images/slider/okuma-halkalari.jpg",
    title: "Milli Maarif ve İrfan Meclisi Büyük Salon Buluşması",
    type: "photo",
    likes: "3.1B",
  },
  {
    id: "ig-4",
    image: "/images/basinda-biz/teskilat.png",
    title: "81 İlde Teşkilat Seferberliği ve Saha Çalışmaları",
    type: "photo",
    likes: "1.5B",
  },
  {
    id: "ig-5",
    image: "/images/slider/haydi-milli-genclik.jpg",
    title: "Şube Liseler Komisyonu Gençlik Buluşması",
    type: "photo",
    likes: "2.2B",
  },
  {
    id: "ig-6",
    image: "/images/basinda-biz/yaz_etkinlikleri_cartoon.png",
    title: "Çocuklarla Oyun ve Yaz Etkinlikleri Atölyesi",
    type: "video",
    likes: "4.7B",
  },
];

export default function SocialMediaSection() {
  const facebookUrl = "https://www.facebook.com/milligenclikmgd";
  const instagramUrl = "https://www.instagram.com/milligenclikmgd/";

  return (
    <section id="sosyal-medya" className="py-20 bg-white relative overflow-hidden border-t border-slate-200/60 select-none">
      <div className="container-x relative">
        {/* Başlık (Birebir görseldeki gibi ortalanmış ve sade) */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sosyal Medya
          </h2>
        </div>

        {/* 2 Kolonlu Widget Izgarası: Sol Facebook - Sağ Instagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
          
          {/* ==================== 1. FACEBOOK WIDGET KARTI ==================== */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-md transition duration-200">
            {/* Kart Üst Başlık */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  <span className="font-serif leading-none">f</span>
                </div>
                <span className="font-bold text-slate-800 text-sm">Facebook</span>
              </div>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-blue-600/30 text-blue-700 hover:bg-blue-50 text-[11px] font-bold px-4 py-1.5 transition active:scale-95"
              >
                TAKİP ET
              </a>
            </div>

            {/* İç Facebook Sayfa Kutusu (Birebir Tasarım) */}
            <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white mt-3.5 shadow-xs">
              {/* Sayfa Kapak Görseli */}
              <div className="relative h-32 sm:h-36 bg-gradient-to-r from-[#07244f] via-[#0e3b7a] to-[#07244f] p-4 text-white overflow-hidden flex items-center justify-end">
                {/* Sol/Arka plan MGD amblemi */}
                <div className="absolute -left-6 -top-6 w-32 h-32 opacity-15 pointer-events-none">
                  <Image
                    src="/images/logo-symbol.png"
                    alt=""
                    fill
                    className="object-contain filter brightness-200"
                  />
                </div>

                {/* Sağdaki Resmî Slogan ve Tasarım */}
                <div className="relative z-10 text-right pr-2">
                  <div className="flex items-center justify-end gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-blue-200 font-mono tracking-tighter drop-shadow">
                      52
                    </span>
                    <div className="text-left leading-tight">
                      <p className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        sevgi ve
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-blue-200 tracking-wide">
                        kardeşliğin teminatıyız
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kapak Sağ Üst Facebook İkonu */}
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs backdrop-blur font-bold">
                  f
                </div>
              </div>

              {/* Sayfa Profil Bilgileri & Takip Et Alanı */}
              <div className="px-4 pb-4">
                {/* Üst Üste Binen Yuvarlak Profil Logosu */}
                <div className="-mt-9 mb-2 relative z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white p-1 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                  <div className="relative w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                    <Image
                      src="/images/logo_crop.png"
                      alt="MGD Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Sayfa Başlığı ve Takipçi */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    MGD Genel Merkez - Milli Gençlik Derneği
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    205 B takipçi
                  </p>
                </div>

                {/* Biyografi */}
                <p className="text-[11px] text-slate-700 mt-2 leading-relaxed">
                  &ldquo;İnsanların en hayırlısı insanlığa faydalı olandır.&rdquo;{" "}
                  <a
                    href="https://www.milligenclik.org.tr"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    www.milligenclik.org.tr
                  </a>{" "}
                  |{" "}
                  <a
                    href="https://twitter.com/milligenclikmgd"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    twitter.com/milligenclikmgd
                  </a>
                </p>

                {/* Meta Detaylar */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Briefcase size={12} className="text-slate-500" /> Sivil Toplum Örgütü (STÖ)
                  </span>
                  <span>•</span>
                  <span>Geçerli Değil</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Phone size={12} className="text-slate-500" /> +90 312 472 54 54
                  </span>
                </div>

                {/* Mavi Takip Et Butonu */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 w-full rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.99]"
                >
                  <UserCheck size={16} />
                  <span>Takip et</span>
                </a>
              </div>

              {/* Son Paylaşım Önizlemesi */}
              <div className="border-t border-slate-100 pt-3 px-4 pb-3 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <Image
                      src="/images/logo_crop.png"
                      alt="MGD"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-slate-800">
                      MGD Genel Merkez - Milli Gençlik Derneği
                    </span>
                    <span className="text-slate-400">• 1g</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-snug line-clamp-2 mb-2">
                  📍 52. Dönem Ekim Ayı Şube İnsan Kaynakları ve Halkla İlişkiler komisyon Başkanları Toplantısı, Genel Başkan Yardımcımız Lokman...
                </p>

                {/* Paylaşım Görseli / Afiş */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative h-28 sm:h-32 rounded-lg overflow-hidden border border-blue-200/80 group"
                >
                  <Image
                    src="/images/slider/yeniden-milli-genclik.jpg"
                    alt="Toplantı Paylaşımı"
                    fill
                    className="object-cover group-hover:scale-102 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2f64] via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-900/80 px-2 py-0.5 rounded backdrop-blur">
                      EKİM AYI ŞUBE İNSAN KAYNAKLARI TOPLANTISI
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* ==================== 2. INSTAGRAM WIDGET KARTI ==================== */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-md transition duration-200">
            {/* Kart Üst Başlık */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Instagram size={17} />
                </div>
                <span className="font-bold text-slate-800 text-sm">Instagram</span>
              </div>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-pink-500/40 text-pink-700 hover:bg-pink-50 text-[11px] font-bold px-4 py-1.5 transition active:scale-95"
              >
                TAKİP ET
              </a>
            </div>

            {/* Profil Başlığı Box (Avatar + İsim + Takipçi + IG Rozeti) */}
            <div className="px-2 pt-3.5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Instagram Hikaye Halka Efektli Avatar */}
                <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shrink-0">
                  <div className="p-0.5 bg-white rounded-full">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        src="/images/logo_crop.png"
                        alt="Milli Gençlik Derneği"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Kullanıcı Adı ve İstatistikler */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                      milligenclikmgd
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    Milli Gençlik Derneği
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    <strong className="text-slate-800 font-bold">54 B</strong> takipçi • <strong className="text-slate-800 font-bold">10.197</strong> gönderi
                  </p>
                </div>
              </div>

              {/* Sağdaki Instagram Outline Logosu */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition p-1"
                aria-label="Instagram'da gör"
              >
                <Instagram size={24} />
              </a>
            </div>

            {/* 6'lı Fotoğraf / Video Izgarası (3x2 Birebir Grid) */}
            <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mt-1.5 bg-slate-100">
              {INSTAGRAM_POSTS.map((item) => (
                <a
                  key={item.id}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square bg-slate-900 overflow-hidden block"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover group-hover:scale-108 transition-transform duration-300 ease-out"
                  />

                  {/* Sağ Üst Medya Rozeti (Video için Play, Galeri için Layers) */}
                  {item.type === "video" && (
                    <div className="absolute top-1.5 right-1.5 z-10 drop-shadow">
                      <Play size={14} className="text-white fill-white" />
                    </div>
                  )}
                  {item.type === "carousel" && (
                    <div className="absolute top-1.5 right-1.5 z-10 drop-shadow">
                      <Layers size={14} className="text-white" />
                    </div>
                  )}

                  {/* Hover Karartma Katmanı & Beğeni İkonu */}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center">
                    <Heart size={18} className="fill-white text-white mb-1" />
                    <span className="text-xs font-bold">{item.likes}</span>
                    <span className="text-[10px] text-pink-200 flex items-center gap-1 mt-1">
                      İncele <ExternalLink size={10} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
