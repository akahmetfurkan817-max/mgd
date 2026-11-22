"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VideoModal from "@/components/modals/VideoModal";
import { type SahsiyetPhoto, type SahsiyetVideo } from "@/data/oncu-sahsiyetler";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  Film,
  Image as ImageIcon,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Youtube,
} from "lucide-react";
import type { VideoItem } from "@/types";

export default function OncuSahsiyetlerPage() {
  const { data: pioneers } = useOncuSahsiyetler();
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>("erbakan");
  const [activeTab, setActiveTab] = useState<"bio" | "videos" | "photos" | "books">("bio");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<SahsiyetPhoto | null>(null);

  const leader =
    pioneers.find((l) => l.id === selectedLeaderId) || pioneers[0];

  const getVideoThumb = (vid: SahsiyetVideo) =>
    vid.thumbnail ||
    (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : leader.portrait);

  const handlePlayVideo = (vid: SahsiyetVideo) => {
    setPlayingVideo({
      id: vid.id,
      title: vid.title,
      category: "Belgesel & Arşiv",
      duration: vid.duration,
      date: vid.date,
      thumbnail: getVideoThumb(vid),
      youtubeId: vid.youtubeId,
      description: vid.description,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Üst Banner */}
        <section className="bg-gradient-to-r from-[#060e20] via-primary-dark to-[#0f214a] text-white py-16 sm:py-20 border-b border-blue-900/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none select-none">
            <Image
              src="/images/logo-symbol-light.png"
              alt="MGD Amblem"
              fill
              className="object-contain"
            />
          </div>

          <div className="container-x relative">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
              <Link href="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Ana Sayfa
              </Link>
              <span>/</span>
              <span>Davamızın Mimarları</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white">
              Öncü Şahsiyetlerimiz
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100/90 max-w-2xl leading-relaxed">
              Milli Görüş gençlik hareketinin kurucusu, rehberi ve efsane önderlerinin hayatı, vizyonu, video arşivleri, hatıraları ve eserleri.
            </p>
          </div>
        </section>

        {/* Lider Seçim Sekmeleri */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="container-x">
            <div className="flex flex-wrap items-center gap-3">
              {pioneers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedLeaderId(item.id);
                    setActiveTab("bio");
                  }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    leader.id === item.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <User size={18} />
                  <span>{item.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      leader.id === item.id
                        ? "bg-white/20 text-blue-100"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.period}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Seçili Lider Detayı & İçerik Alanı */}
        <section className="py-12">
          <div className="container-x">
            {/* Lider Başlık Kartı */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl mb-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Portre */}
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-secondary/30 shadow-md shrink-0">
                    <Image
                      src={leader.portrait}
                      alt={leader.name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-blue-50 border border-blue-100 inline-block mb-2">
                      {leader.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                      {leader.name}
                    </h2>
                    <p className="text-sm font-semibold text-slate-600 mt-1">
                      {leader.title} • ({leader.period})
                    </p>
                    <p className="mt-3 text-xs sm:text-sm text-primary-dark font-medium italic max-w-2xl bg-blue-50/60 p-3 rounded-xl border-l-4 border-primary">
                      {leader.motto}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alt Sekmeler: Biyografi, Videolar, Fotoğraflar, Kitaplar */}
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("bio")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    activeTab === "bio"
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <BookOpen size={15} /> Hayatı & Biyografi
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("videos")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    activeTab === "videos"
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Film size={15} /> Video Arşivi ({leader.videos.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("photos")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    activeTab === "photos"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <ImageIcon size={15} /> Fotoğraf Galerisi ({leader.photos.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("books")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    activeTab === "books"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Sparkles size={15} /> Kitapları & PDF Eserler ({leader.books.length})
                </button>
              </div>
            </div>

            {/* SEKME 1: BİYOGRAFİ & VECİZ SÖZLER */}
            {activeTab === "bio" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sol: Biyografi Bölümleri (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {leader.bioSections.map((sec, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-secondary" />
                        {sec.heading}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed text-justify">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sağ: Veciz Sözler & Hızlı Notlar (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-gradient-to-br from-[#060e20] to-primary-dark text-white rounded-3xl p-6 sm:p-8 border border-blue-900/50 shadow-xl">
                    <div className="flex items-center gap-2 text-yellow-400 mb-4">
                      <Quote size={24} />
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-blue-200">
                        Unutulmaz Veciz Sözleri
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {leader.quotes.map((q, idx) => (
                        <blockquote
                          key={idx}
                          className="text-xs text-blue-100/90 leading-relaxed pl-3 border-l-2 border-yellow-400/80 italic"
                        >
                          {q}
                        </blockquote>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 2: VİDEO ARŞİVİ */}
            {activeTab === "videos" && (
              leader.videos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz video eklenmemiş.
                </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leader.videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => handlePlayVideo(vid)}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-red-400/50 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <Image
                          src={getVideoThumb(vid)}
                          alt={vid.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition">
                            <Play size={20} className="fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {vid.duration}
                        </span>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-blue-50">
                          {vid.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition mt-2 line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {vid.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                      <span>{vid.date}</span>
                      <span className="text-red-600 font-bold flex items-center gap-1 group-hover:underline">
                        <Youtube size={14} /> İzle
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              )
            )}

            {/* SEKME 3: FOTOĞRAF GALERİSİ */}
            {activeTab === "photos" && (
              leader.photos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz fotoğraf eklenmemiş.
                </div>
              ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {leader.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setPreviewPhoto(photo)}
                    className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="relative aspect-square w-full bg-slate-900">
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                        {photo.caption}
                      </p>
                      {photo.year && (
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {photo.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )
            )}

            {/* SEKME 4: KİTAPLAR & PDF ESERLER */}
            {activeTab === "books" && (
              leader.books.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz kitap veya PDF eser eklenmemiş.
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leader.books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-primary shadow-md shrink-0 border border-slate-200">
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 font-mono block">
                            {book.year}{book.totalPages > 0 ? ` • ${book.totalPages} Sayfa` : ""}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                            {book.title}
                          </h4>
                          <p className="text-xs text-secondary font-medium mt-0.5">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                      {book.pdfUrl && book.pdfUrl !== "#" ? (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-primary-dark transition active:scale-95"
                        >
                          <Download size={14} /> PDF İncele / İndir
                        </a>
                      ) : (
                        <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                          <Download size={14} /> PDF Henüz Eklenmedi
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Video Modalı */}
      <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />

      {/* Fotoğraf Büyütme Modalı */}
      {previewPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-black">
              <Image
                src={previewPhoto.url}
                alt={previewPhoto.caption}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 flex items-center justify-between text-white bg-slate-900">
              <p className="text-sm font-semibold">{previewPhoto.caption}</p>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
