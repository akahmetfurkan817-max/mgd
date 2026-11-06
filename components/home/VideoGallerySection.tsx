"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Eye,
  Play,
  Video as VideoIcon,
} from "lucide-react";
import { useVideos } from "@/hooks/useSiteData";
import VideoModal from "@/components/modals/VideoModal";
import type { VideoItem } from "@/types";

export default function VideoGallerySection() {
  const { data: videos } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) return null;

  const featured = videos[0];
  const rest = videos.slice(1, 2); // Show only 1 side video on homepage (total 2)

  return (
    <section id="videolar" className="relative py-16 bg-slate-950 text-white overflow-hidden border-b border-blue-900/30">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <VideoIcon size={18} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">Görsel Medya Arşivi</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Video Galeri</h2>
            </div>
          </div>

          <Link
            href="/videolar"
            className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1.5 transition self-start sm:self-auto group"
          >
            TÜM VİDEOLARI GÖRMEK İÇİN TIKLAYIN ({videos.length}) <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Video Grid: 1 Featured (Large) + 3 Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured Video (7 cols) */}
          <div
            onClick={() => setSelectedVideo(featured)}
            className="lg:col-span-7 group relative flex flex-col justify-end min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer bg-slate-900"
          >
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90" />

            {/* Play Button Center Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-900/50 group-hover:scale-110 transition-transform duration-300">
                <Play size={26} className="fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Content */}
            <div className="relative p-6 sm:p-8 z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600/80 text-white shadow-sm">
                  {featured.category}
                </span>
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <Clock size={12} /> {featured.duration}
                </span>
                {featured.views && (
                  <span className="text-xs text-white/70 flex items-center gap-1">
                    <Eye size={12} /> {featured.views} izlenme
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-blue-300 transition">
                {featured.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 max-w-xl">
                {featured.description}
              </p>
            </div>
          </div>

          {/* Side Videos (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {rest.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="group flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/30 transition cursor-pointer"
              >
                <div className="relative h-28 w-40 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                  <Image
                    src={vid.thumbnail}
                    alt={vid.title}
                    fill
                    sizes="160px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                    <div className="h-9 w-9 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition">
                      <Play size={15} className="fill-white translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                    {vid.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                      {vid.category}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-300 transition line-clamp-2 mt-0.5">
                      {vid.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <span>{vid.date}</span>
                    {vid.views && <span>• {vid.views} izlenme</span>}
                  </div>
                </div>
              </div>
            ))}

            {/* Archive Callout Card */}
            <Link
              href="/videolar"
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900/80 border border-blue-500/20 hover:border-blue-400/50 transition flex flex-col justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Milli Gençlik TV
                </span>
                <h4 className="text-base font-bold text-white mt-1 group-hover:text-blue-300 transition">
                  Tüm Görsel & Video Arşivini Keşfedin
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Genel Başkanımızın hitapları, teşkilat eğitimleri, gençlik buluşmaları ve basın toplantılarının tüm video kayıtları.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 group-hover:text-white transition">
                <span>Tüm Videoları Görüntüle ({videos.length})</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </section>
  );
}
