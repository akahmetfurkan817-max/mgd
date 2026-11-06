"use client";

import { useEffect } from "react";
import { Share2, Video, X } from "lucide-react";
import type { VideoItem } from "@/types";

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (video) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: video.title, text: video.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Video bağlantısı panoya kopyalandı!");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-900/40 flex flex-col animate-scaleUp text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
              {video.category}
            </span>
            <span className="text-xs text-slate-400">Süre: {video.duration}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId || "dQw4w9WgXcQ"}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Details */}
        <div className="p-6 space-y-3 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">{video.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Yayın Tarihi: {video.date}</span>
                {video.views && <span>• {video.views} izlenme</span>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition self-start border border-slate-700"
            >
              <Share2 size={13} /> Paylaş
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
}
