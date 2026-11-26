"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Film,
  Image as ImageIcon,
  Play,
  Quote,
  Sparkles,
  User,
  X,
  Youtube,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import VideoModal from "@/components/modals/VideoModal";
import FlipbookModal from "@/components/corporate/FlipbookModal";
import { type SahsiyetPhoto, type SahsiyetVideo } from "@/data/oncu-sahsiyetler";
import { useOncuSahsiyetler } from "@/hooks/useSiteData";
import type { VideoItem } from "@/types";

export default function OncuSahsiyetDetayPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data: pioneers } = useOncuSahsiyetler();

  const leader = pioneers.find((p) => p.id === id) || pioneers[0];
  const others = pioneers.filter((p) => p.id !== leader?.id);

  const [activeTab, setActiveTab] = useState<"bio" | "videos" | "photos" | "books">("bio");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<SahsiyetPhoto | null>(null);
  const [readingPdf, setReadingPdf] = useState<{ url: string; title: string } | null>(null);

  if (!leader) return null;

  const getVideoThumb = (vid: SahsiyetVideo) =>
    vid.thumbnail ||
    (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : leader.portrait || "/images/erbakan_banner.png");

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
      downloadUrl: vid.downloadUrl,
      showDownload: vid.showDownload,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Tam Genişlik Özelleştirilebilir Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#061124] via-[#0B2248] to-[#071630] text-white py-14 sm:py-20 border-b border-blue-900/40">
          {leader.backgroundImage && (
            <>
              <Image
                src={leader.backgroundImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-30"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050E1E]/95 via-[#071732]/85 to-[#061124]/65" />
            </>
          )}

          <div className="container-x relative z-10">
            <ScrollReveal y={18} duration={650}>
              <Link
                href="/oncu-sahsiyetler"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-1.5 text-xs font-bold text-blue-100 transition mb-8"
              >
                <ArrowLeft size={14} /> Tüm Öncü Şahsiyetler
              </Link>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Portre (Opsiyonel / Boş bırakılabilir) */}
                <div className="lg:col-span-4">
                  <div className="relative aspect-[4/4.6] w-full max-w-xs mx-auto lg:mx-0 overflow-hidden rounded-3xl border-2 border-white/20 bg-white/[0.05] shadow-2xl">
                    {leader.portrait ? (
                      <Image
                        src={leader.portrait}
                        alt={leader.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 30vw"
                        className="object-cover object-top"
                        priority
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <User size={72} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Başlık & Şiar */}
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    {leader.badge && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                        <Sparkles size={12} /> {leader.badge}
                      </span>
                    )}
                    {leader.period && (
                      <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-blue-100">
                        {leader.period}
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {leader.name}
                  </h1>
                  {leader.title && (
                    <p className="mt-2 text-base sm:text-lg font-medium text-blue-200/90">
                      {leader.title}
                    </p>
                  )}

                  {leader.motto && (
                    <blockquote className="mt-6 rounded-2xl border-l-4 border-amber-400 bg-white/[0.08] backdrop-blur-sm p-5 text-sm sm:text-base italic text-blue-50 leading-relaxed max-w-2xl">
                      <Quote size={16} className="inline mr-2 text-amber-300" />
                      {leader.motto}
                    </blockquote>
                  )}

                  {/* Sekme Butonları */}
                  <div className="mt-8 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("bio")}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                        activeTab === "bio"
                          ? "bg-white text-primary shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                      }`}
                    >
                      <BookOpen size={15} /> Hayatı &amp; Biyografi
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("videos")}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                        activeTab === "videos"
                          ? "bg-white text-primary shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                      }`}
                    >
                      <Film size={15} /> Video Arşivi ({leader.videos.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("photos")}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                        activeTab === "photos"
                          ? "bg-white text-primary shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                      }`}
                    >
                      <ImageIcon size={15} /> Fotoğraflar ({leader.photos.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("books")}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition ${
                        activeTab === "books"
                          ? "bg-white text-primary shadow-lg"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                      }`}
                    >
                      <Sparkles size={15} /> Kitaplar &amp; PDF ({leader.books.length})
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Sekme İçerikleri */}
        <section className="py-12 sm:py-16">
          <div className="container-x">
            {activeTab === "bio" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  {leader.bioSections.map((sec, i) => (
                    <ScrollReveal key={i} delay={i * 70} y={22} duration={700}>
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink mb-3 flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                          {sec.heading}
                        </h2>
                        <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed text-justify">
                          {sec.content}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <div className="lg:col-span-4">
                  <ScrollReveal delay={100} y={24} duration={750}>
                    <div className="sticky top-24 bg-gradient-to-br from-[#07152B] to-primary-dark text-white rounded-3xl p-6 sm:p-8 border border-blue-900/50 shadow-xl">
                      <div className="flex items-center gap-2 text-amber-300 mb-5">
                        <Quote size={22} />
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-200">
                          Unutulmaz Veciz Sözleri
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {leader.quotes.map((q, idx) => (
                          <blockquote
                            key={idx}
                            className="text-xs sm:text-sm text-blue-100/90 leading-relaxed pl-3.5 border-l-2 border-amber-400/80 italic"
                          >
                            {q}
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              leader.videos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz video eklenmemiş.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leader.videos.map((vid, idx) => (
                    <ScrollReveal key={vid.id} delay={(idx % 3) * 65} y={22} duration={700}>
                      <div
                        onClick={() => handlePlayVideo(vid)}
                        className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-primary/40 transition cursor-pointer flex flex-col justify-between h-full"
                      >
                        <div>
                          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                            <Image
                              src={getVideoThumb(vid)}
                              alt={vid.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
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
                            <h3 className="text-sm font-bold text-ink group-hover:text-primary transition mt-2 line-clamp-2">
                              {vid.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vid.description}</p>
                          </div>
                        </div>
                        <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-100">
                          <span>{vid.date}</span>
                          <div className="flex items-center gap-2.5">
                            {vid.downloadUrl?.trim() && (
                              <a
                                href={
                                  vid.downloadUrl.trim().startsWith("/") ||
                                  /^https?:\/\//i.test(vid.downloadUrl.trim())
                                    ? vid.downloadUrl.trim()
                                    : `https://${vid.downloadUrl.trim()}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white transition"
                              >
                                <Download size={12} /> Videoyu İndir
                              </a>
                            )}
                            <span className="text-primary font-bold flex items-center gap-1">
                              <Youtube size={14} /> İzle
                            </span>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )
            )}

            {activeTab === "photos" && (
              leader.photos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz fotoğraf eklenmemiş.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {leader.photos.map((photo, idx) => (
                    <ScrollReveal key={photo.id} delay={(idx % 4) * 60} y={22} duration={700}>
                      <div
                        onClick={() => setPreviewPhoto(photo)}
                        className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition cursor-pointer"
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
                          <p className="text-xs font-semibold text-ink line-clamp-2">{photo.caption}</p>
                          {photo.year && (
                            <span className="text-[10px] text-slate-400 font-mono block mt-1">{photo.year}</span>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )
            )}

            {activeTab === "books" && (
              leader.books.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-sm text-slate-500">
                  Bu şahsiyet için henüz kitap veya PDF eser eklenmemiş.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {leader.books.map((book, idx) => {
                    const isPdf = Boolean(book.pdfUrl && /\.pdf(\?|$)/i.test(book.pdfUrl));
                    return (
                      <ScrollReveal key={book.id} delay={(idx % 3) * 65} y={22} duration={700}>
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-start gap-4 mb-4">
                              <div className="relative w-20 h-28 rounded-xl overflow-hidden bg-primary shadow-md shrink-0 border border-slate-200">
                                <Image
                                  src={book.coverImage || "/images/mgd/0001.jpg"}
                                  alt={book.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 font-mono block">
                                  {book.year}
                                  {book.totalPages > 0 ? ` • ${book.totalPages} Sayfa` : ""}
                                </span>
                                <h3 className="text-base font-bold text-ink mt-0.5 leading-snug">{book.title}</h3>
                                <p className="text-xs text-secondary font-medium mt-0.5">{book.author}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-6">{book.description}</p>
                          </div>

                          <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                            {isPdf ? (
                              <button
                                type="button"
                                onClick={() => setReadingPdf({ url: book.pdfUrl, title: book.title })}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-secondary transition"
                              >
                                <BookOpen size={14} /> Dergi Modunda Oku
                              </button>
                            ) : book.pdfUrl && book.pdfUrl !== "#" ? (
                              <a
                                href={book.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow hover:bg-secondary transition"
                              >
                                <Download size={14} /> PDF İncele / İndir
                              </a>
                            ) : (
                              <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs">
                                PDF Henüz Eklenmedi
                              </span>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              )
            )}

            {/* Diğer Öncü Şahsiyetler */}
            {others.length > 0 && (
              <ScrollReveal y={22} duration={700} className="mt-16 pt-12 border-t border-slate-200">
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-6">
                  Diğer Öncü Şahsiyetlerimiz
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {others.map((other) => (
                    <Link
                      key={other.id}
                      href={`/oncu-sahsiyetler/${other.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-primary/40 transition"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                        {other.portrait ? (
                          <Image src={other.portrait} alt={other.name} fill className="object-cover object-top" unoptimized />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/30">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-ink group-hover:text-primary truncate">{other.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{other.period}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition shrink-0" />
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />

      {readingPdf && (
        <FlipbookModal
          docKey={null}
          customPdfUrl={readingPdf.url}
          customTitle={readingPdf.title}
          onClose={() => setReadingPdf(null)}
        />
      )}

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
              <Image src={previewPhoto.url} alt={previewPhoto.caption} fill className="object-contain" unoptimized />
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
