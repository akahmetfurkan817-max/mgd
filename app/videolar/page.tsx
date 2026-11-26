"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Download, Play, Tv, Video as VideoIcon } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useSiteSettings, useVideos } from "@/hooks/useSiteData";
import VideoModal from "@/components/modals/VideoModal";
import type { VideoItem } from "@/types";

function VideolarContent() {
  const searchParams = useSearchParams();
  const { data: videos } = useVideos();
  const { data: settings } = useSiteSettings();
  const videoFilters = ["Tümü", ...(settings.categories?.videos || [])];
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat && videoFilters.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams, videoFilters]);

  const filtered =
    activeCategory === "Tümü"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  return (
    <>
      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#061124] via-primary-dark to-[#0F244D] py-14 sm:py-20 border-b border-blue-900/40">
          <div className="container-x">
            <ScrollReveal y={18} duration={650}>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-blue-300 uppercase tracking-widest">
                <Link href="/" className="hover:underline flex items-center gap-1 text-slate-300">
                  <ArrowLeft size={14} /> Ana Sayfa
                </Link>
                <span>/</span>
                <span>Medya</span>
              </div>
              <div className="flex items-center gap-3">
                <Tv size={32} className="text-blue-400 shrink-0" />
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                  MGD TV &amp; Video Galeri
                </h1>
              </div>
              <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
                MGD TV yayınları, Prof. Dr. Necmettin Erbakan ve Dr. Fatih Erbakan konuşmaları, genel merkez programları ve gençlik şöleni kayıtları.
              </p>

              {/* Kategori Sekmeleri */}
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {videoFilters.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      activeCategory === cat
                        ? "bg-white text-primary shadow-md"
                        : "bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-12">
          <div className="container-x">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 py-16 text-center">
                <VideoIcon size={40} className="mx-auto text-slate-500 mb-3" />
                <p className="text-sm font-bold text-slate-300">
                  Bu kategoride henüz video eklenmemiş.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Admin panelindeki Video Galerisi bölümünden dilediğiniz zaman yeni videolar ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((video, idx) => {
                  const thumb =
                    video.thumbnail ||
                    (video.youtubeId
                      ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                      : "/images/basinda-biz/antalya-il.png");
                  return (
                    <ScrollReveal key={video.id} delay={(idx % 3) * 70} y={24} duration={700}>
                      <div
                        onClick={() => setSelectedVideo(video)}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg hover:shadow-2xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      >
                        <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                          <Image
                            src={thumb}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full bg-secondary/95 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary transition-transform">
                              <Play size={24} className="fill-current translate-x-0.5" />
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3 rounded-md bg-black/75 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white flex items-center gap-1">
                            <Clock size={11} /> {video.duration}
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                              {video.category || "Video"}
                            </span>
                            <h3 className="mt-1 font-bold text-white text-base leading-snug group-hover:text-blue-200 transition-colors">
                              {video.title}
                            </h3>
                            <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {video.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                            <span>{video.date}</span>
                            <div className="flex items-center gap-2">
                              {video.downloadUrl?.trim() && (
                                <a
                                  href={
                                    video.downloadUrl.trim().startsWith("/") ||
                                    /^https?:\/\//i.test(video.downloadUrl.trim())
                                      ? video.downloadUrl.trim()
                                      : `https://${video.downloadUrl.trim()}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white transition"
                                >
                                  <Download size={12} /> Videoyu İndir
                                </a>
                              )}
                              <span className="font-bold text-blue-300 group-hover:underline">
                                Videoyu İzle →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
}

export default function VideolarPage() {
  return (
    <div className="min-h-screen bg-[#060E1F] text-white flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex-1 py-24 text-center text-sm text-slate-400">Yükleniyor...</div>}>
        <VideolarContent />
      </Suspense>
      <Footer />
    </div>
  );
}
