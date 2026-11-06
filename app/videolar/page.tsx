"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Clock, Eye, Play, Video as VideoIcon } from "lucide-react";
import { VIDEOS } from "@/data/videos";
import VideoModal from "@/components/modals/VideoModal";
import type { VideoItem } from "@/types";

export default function VideolarPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 py-16 sm:py-20 border-b border-blue-900/30">
          <div className="container-x">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-red-400 uppercase tracking-widest">
              <Link href="/" className="hover:underline flex items-center gap-1 text-slate-300">
                <ArrowLeft size={14} /> Ana Sayfa
              </Link>
              <span>/</span>
              <span>Görsel Medya Arşivi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white">
              Video Galeri & Konuşmalar
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl">
              Genel Başkanımızın basın açıklamaları, il kongre konuşmaları, gençlik şöleni ve anma programlarımızın video kayıtları.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-x">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VIDEOS.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg hover:shadow-2xl hover:border-red-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-600 transition-transform">
                        <Play size={24} className="fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-md bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-white flex items-center gap-1">
                      <Clock size={11} /> {video.duration}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                        {video.category || "Video"}
                      </span>
                      <h3 className="mt-1 font-bold text-white text-base leading-snug group-hover:text-red-300 transition-colors">
                        {video.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span>{video.date}</span>
                      <span className="font-bold text-red-400 group-hover:underline">
                        Videoyu İzle →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      <Footer />
    </div>
  );
}
