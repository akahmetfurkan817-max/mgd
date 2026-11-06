"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Heart,
  Instagram,
  MessageCircle,
  Repeat2,
  Share2,
  Sparkles,
  X as CloseIcon,
} from "lucide-react";
import { useSocialPosts } from "@/hooks/useSiteData";
import type { SocialPost } from "@/types";

function XLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SocialMediaSection() {
  const { data: posts } = useSocialPosts();
  const [platformFilter, setPlatformFilter] = useState<"all" | "x" | "instagram">("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (platformFilter === "all") return true;
    return p.platform === platformFilter;
  });

  const countX = posts.filter((p) => p.platform === "x").length;
  const countInsta = posts.filter((p) => p.platform === "instagram").length;

  return (
    <section id="sosyal-medya" className="py-24 bg-white relative overflow-hidden border-t border-slate-200/60">
      {/* Arka plan yumuşak aydınlatması */}
      <div className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-pink-500/5 blur-3xl" />

      <div className="container-x relative">
        {/* Üst Başlık & Sosyal Hesap Linkleri */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-3">
              <Sparkles size={13} className="text-secondary" /> @milligenclikmgd
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Sosyal Medyada Milli Gençlik
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
              X (Twitter) ve Instagram resmi hesaplarımızdan en güncel paylaşımlar, faaliyetler ve video-fotoğraf kareleri.
            </p>
          </div>

          {/* Resmi Hesapları Takip Et Butonları */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://x.com/milligenclikmgd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-95"
            >
              <XLogo className="h-3.5 w-3.5" />
              <span>X&apos;te Takip Et</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>

            <a
              href="https://www.instagram.com/milligenclikmgd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition active:scale-95"
            >
              <Instagram size={15} />
              <span>Instagram&apos;da Takip Et</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>
          </div>
        </div>

        {/* Platform Filtre Sekmeleri */}
        <div className="mb-10 flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => setPlatformFilter("all")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                platformFilter === "all"
                  ? "bg-white text-slate-900 shadow-md scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tümü ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter("x")}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                platformFilter === "x"
                  ? "bg-slate-900 text-white shadow-md scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <XLogo className="h-3 w-3" /> X (Twitter) ({countX})
            </button>
            <button
              type="button"
              onClick={() => setPlatformFilter("instagram")}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                platformFilter === "instagram"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Instagram size={14} /> Instagram ({countInsta})
            </button>
          </div>
        </div>

        {/* 3 Kolonlu Kart Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                {/* Gönderi Üst Başlık (Yazar Bilgisi & Platform İkonu) */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      <Image
                        src={post.authorAvatar || "/images/ahmet-ozvatan.jpg"}
                        alt={post.authorName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-sm text-slate-900 leading-tight">
                          {post.authorName}
                        </span>
                        <span className="text-secondary text-xs">✓</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <span>{post.authorHandle}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Platform Rozeti */}
                  {post.platform === "x" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
                      <XLogo className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-sm">
                      <Instagram size={14} />
                    </div>
                  )}
                </div>

                {/* Gönderi Metni */}
                <p className="text-sm leading-relaxed text-slate-800 mb-4 whitespace-pre-line line-clamp-4">
                  {post.content}
                </p>

                {/* Varsa Görsel */}
                {post.imageUrl && (
                  <div
                    onClick={() => setSelectedImage(post.imageUrl || null)}
                    className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-4 border border-slate-100 cursor-pointer group/img"
                  >
                    <Image
                      src={post.imageUrl}
                      alt="Sosyal Medya Görseli"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        Büyüt
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Alt Bilgi & Etkileşim Butonları */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-semibold text-slate-600 hover:text-red-500 transition cursor-default">
                    <Heart size={14} className="text-red-500 fill-red-500/20" />
                    {post.likes ? post.likes.toLocaleString("tr-TR") : "Beğeni"}
                  </span>
                  {post.platform === "x" ? (
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Repeat2 size={15} className="text-emerald-600" />
                      {post.shares || 0}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <MessageCircle size={14} className="text-secondary" />
                      {post.comments || 0}
                    </span>
                  )}
                </div>

                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:text-secondary hover:underline transition"
                >
                  <span>{post.platform === "x" ? "X'te İncele" : "Instagram'da Aç"}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Görsel Büyütme Modalı (Lightbox) */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-2xl bg-black animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition"
            >
              <CloseIcon size={22} />
            </button>
            <div className="relative aspect-video w-full h-[70vh]">
              <Image
                src={selectedImage}
                alt="Büyük Görsel"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
