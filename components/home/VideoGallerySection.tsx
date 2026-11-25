"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Download, Eye, Play } from "lucide-react";
import { useVideos } from "@/hooks/useSiteData";
import VideoModal from "@/components/modals/VideoModal";
import type { VideoItem } from "@/types";

export default function VideoGallerySection() {
  const { data: videos } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) return null;

  const featured = videos[0];
  const rest = videos.slice(1, 4);

  return (
    <section id="videolar" className="bg-primary-dark py-20 lg:py-24 text-white border-b border-white/10">
      <div className="container-x">
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/10 mb-10">
          <div>
            <div className="section-eyebrow mb-3">
              <span className="h-[1.5px] w-7 bg-gold" />
              <span>Milli Gençlik TV</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Video Galeri
            </h2>
          </div>

          <Link
            href="/videolar"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light hover:text-white transition-colors self-start sm:self-auto group"
          >
            <span>Tüm Videolar ({videos.length})</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Öne Çıkan Video */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedVideo(featured)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedVideo(featured)}
            className="lg:col-span-7 group relative flex flex-col justify-end min-h-[360px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-white/10 cursor-pointer bg-slate-900"
          >
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06101F] via-[#06101F]/45 to-transparent" />

            {/* Oynat Butonu */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/95 text-primary-dark shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-white group-hover:border-gold">
                <Play size={24} className="fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Alt Bilgi */}
            <div className="relative p-6 sm:p-8 z-10">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mb-2.5">
                <span className="font-bold uppercase tracking-wider text-gold-light">
                  {featured.category}
                </span>
                <span className="text-white/25">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} /> {featured.duration}
                </span>
                {featured.views && (
                  <>
                    <span className="text-white/25">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} /> {featured.views}
                    </span>
                  </>
                )}
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug group-hover:text-gold-light transition-colors">
                {featured.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
                {featured.description}
              </p>
              {featured.showDownload && featured.downloadUrl?.trim() && (
                <div className="mt-3">
                  <a
                    href={
                      featured.downloadUrl.trim().startsWith("/") ||
                      /^https?:\/\//i.test(featured.downloadUrl.trim())
                        ? featured.downloadUrl.trim()
                        : `https://${featured.downloadUrl.trim()}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow transition"
                  >
                    <Download size={13} /> Videoyu İndir
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Yan Video Listesi */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {rest.map((vid) => (
              <div
                key={vid.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedVideo(vid)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedVideo(vid)}
                className="group flex gap-4 p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-gold/40 transition-all cursor-pointer"
              >
                <div className="relative h-24 w-36 sm:h-28 sm:w-40 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary-dark transition-transform group-hover:scale-110 group-hover:bg-gold group-hover:text-white">
                      <Play size={14} className="fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    {vid.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light">
                      {vid.category}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-white group-hover:text-gold-light transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-2">
                    <div className="flex items-center gap-2">
                      <span>{vid.date}</span>
                      {vid.views && <span>• {vid.views}</span>}
                    </div>
                    {vid.showDownload && vid.downloadUrl?.trim() && (
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
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 hover:bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white transition"
                      >
                        <Download size={10} /> Videoyu İndir
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {rest.length < 3 && (
              <Link
                href="/videolar"
                className="group p-6 rounded-xl bg-white/[0.04] border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                    Görsel Arşiv
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white mt-1">
                    Tüm Konuşma ve Program Kayıtları
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Genel Başkan hitapları, teşkilat eğitimleri, gençlik şölenleri ve basın açıklamalarının tamamına ulaşın.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-light group-hover:text-white transition-colors">
                  Arşive Git <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </section>
  );
}
