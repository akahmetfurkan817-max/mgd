"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { CORPORATE_DOCS, type CorporateDoc, type CorporatePage } from "@/data/corporate";
import { useSiteSettings } from "@/hooks/useSiteData";

// Web Audio API ile gerçekçi kağıt / sayfa çevirme sesi sentezleyici
function playPageFlipSound(soundEnabled = true) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.28));
      data[i] = (Math.random() * 2 - 1) * decay * 0.35;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.14);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {}
}

interface PdfCanvasFlipbookProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

/**
 * Yüklenen herhangi bir PDF dosyasını otomatik olarak sayfa sayfa çevrilebilir
 * (sesli ve animasyonlu) interaktif okuyucuya dönüştürür.
 * PDF.js CORS/ağ nedeniyle yüklenemezse sorunsuz şekilde gömülü PDF okuyucuya düşer.
 */
function PdfCanvasFlipbook({ pdfUrl, title, onClose }: PdfCanvasFlipbookProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fallbackIframe, setFallbackIframe] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<{
    numPages: number;
    getPage: (n: number) => Promise<{
      getViewport: (opts: { scale: number }) => { width: number; height: number };
      render: (opts: {
        canvasContext: CanvasRenderingContext2D;
        viewport: { width: number; height: number };
      }) => { promise: Promise<void>; cancel?: () => void };
    }>;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFallbackIframe(false);
    setPageNum(1);

    async function loadPdf() {
      try {
        const pdfjsUrl = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";
        const dynamicImport = new Function("u", "return import(u)") as (u: string) => Promise<{
          GlobalWorkerOptions: { workerSrc: string };
          getDocument: (opts: { url: string; withCredentials: boolean }) => {
            promise: Promise<NonNullable<typeof pdfDocRef.current>>;
          };
        }>;
        const pdfjsLib = await dynamicImport(pdfjsUrl);
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl, withCredentials: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setFallbackIframe(true);
          setLoading(false);
        }
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDocRef.current || fallbackIframe || loading) return;
    let renderTask: { cancel?: () => void } | null = null;
    let cancelled = false;

    async function renderPage() {
      try {
        const pdf = pdfDocRef.current;
        if (!pdf) return;
        const page = await pdf.getPage(pageNum);
        if (cancelled || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(820, window.innerWidth - 90);
        const scale = (targetWidth / baseViewport.width) * dpr;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        renderTask = page.render({ canvasContext: ctx, viewport });
        await (renderTask as unknown as { promise: Promise<void> }).promise;
      } catch {}
    }

    renderPage();
    return () => {
      cancelled = true;
      try {
        renderTask?.cancel?.();
      } catch {}
    };
  }, [pageNum, fallbackIframe, loading]);

  const goNext = useCallback(() => {
    if (pageNum < numPages && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound(soundEnabled);
      setTimeout(() => {
        setPageNum((p) => p + 1);
        setIsFlipping(false);
      }, 180);
    }
  }, [pageNum, numPages, isFlipping, soundEnabled]);

  const goPrev = useCallback(() => {
    if (pageNum > 1 && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound(soundEnabled);
      setTimeout(() => {
        setPageNum((p) => p - 1);
        setIsFlipping(false);
      }, 180);
    }
  }, [pageNum, isFlipping, soundEnabled]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [goNext, goPrev, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col bg-slate-900 rounded-3xl shadow-2xl border border-blue-900/40 overflow-hidden transition-all duration-300 ${
          isFullscreen ? "w-screen h-screen rounded-none" : "w-full max-w-5xl h-[92vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#060e20] via-primary-dark to-[#0f214a] border-b border-blue-900/50 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen size={18} className="shrink-0 text-blue-300" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold truncate">{title}</h2>
              <p className="text-[11px] text-blue-200/80 truncate">
                İnteraktif PDF Dergi Okuyucu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!fallbackIframe && (
              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition"
                title={soundEnabled ? "Sayfa çevirme sesini kapat" : "Sayfa çevirme sesini aç"}
              >
                {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} className="text-red-400" />}
              </button>
            )}
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition"
            >
              <Download size={14} /> <span className="hidden sm:inline">PDF İndir</span>
            </a>
            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="p-2 rounded-xl hover:bg-white/15 text-white transition hidden md:block"
              aria-label="Tam Ekran"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-500/20 hover:text-red-300 text-white transition"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Gövde */}
        {fallbackIframe ? (
          <iframe src={pdfUrl} title={title} className="w-full flex-1 border-0 bg-slate-100" />
        ) : (
          <>
            <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center gap-3 text-blue-200">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-xs font-semibold">PDF sayfaları hazırlanıyor...</span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={pageNum <= 1 || isFlipping}
                    className="fixed sm:absolute left-3 sm:left-5 z-20 h-11 w-11 rounded-full bg-slate-900/90 text-white border border-white/20 shadow-2xl flex items-center justify-center hover:bg-secondary transition disabled:opacity-20"
                    aria-label="Önceki Sayfa"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <div
                    className={`rounded-2xl bg-white p-2 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] transition-all duration-200 ${
                      isFlipping ? "scale-[0.97] opacity-80" : "scale-100 opacity-100"
                    }`}
                  >
                    <canvas ref={canvasRef} className="block max-w-full h-auto rounded-lg" />
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={pageNum >= numPages || isFlipping}
                    className="fixed sm:absolute right-3 sm:right-5 z-20 h-11 w-11 rounded-full bg-slate-900/90 text-white border border-white/20 shadow-2xl flex items-center justify-center hover:bg-secondary transition disabled:opacity-20"
                    aria-label="Sonraki Sayfa"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Alt Kontrol Barı */}
            {numPages > 0 && (
              <div className="px-6 py-3 bg-[#060e20] border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-blue-200">
                    Sayfa <strong>{pageNum}</strong> / {numPages}
                  </span>
                  <div className="w-36 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-300 rounded-full"
                      style={{ width: `${(pageNum / numPages) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={pageNum <= 1 || isFlipping}
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition disabled:opacity-30 flex items-center gap-1"
                  >
                    <ChevronLeft size={15} /> Önceki
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={pageNum >= numPages || isFlipping}
                    className="px-4 py-1.5 rounded-lg bg-secondary hover:bg-blue-600 text-white font-bold transition disabled:opacity-30 flex items-center gap-1"
                  >
                    Sonraki <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface FlipbookModalProps {
  docKey: string | null;
  customPdfUrl?: string;
  customTitle?: string;
  onClose: () => void;
}

export default function FlipbookModal({ docKey, customPdfUrl, customTitle, onClose }: FlipbookModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: settings } = useSiteSettings();
  const doc: CorporateDoc | null = docKey ? CORPORATE_DOCS[docKey] || null : null;
  const totalPages = doc?.pages?.length || 1;

  const uploadedPdf =
    customPdfUrl ||
    (docKey && settings.corporatePdfs
      ? (settings.corporatePdfs as Record<string, string | undefined>)[docKey]
      : undefined);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages && !isFlipping) {
      setFlipDirection("next");
      setIsFlipping(true);
      playPageFlipSound(soundEnabled);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
      }, 260);
    }
  }, [currentPage, totalPages, isFlipping, soundEnabled]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1 && !isFlipping) {
      setFlipDirection("prev");
      setIsFlipping(true);
      playPageFlipSound(soundEnabled);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
      }, 260);
    }
  }, [currentPage, isFlipping, soundEnabled]);

  useEffect(() => {
    setCurrentPage(1);
  }, [docKey]);

  useEffect(() => {
    if (uploadedPdf) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNextPage();
      if (e.key === "ArrowLeft") handlePrevPage();
    };
    if (docKey) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [docKey, uploadedPdf, handleNextPage, handlePrevPage, onClose]);

  // PDF yüklendiyse (Tüzük, Protokol, Kitap vb.) otomatik olarak sayfa çevirmeli PDF okuyucuda aç!
  if (uploadedPdf) {
    return (
      <PdfCanvasFlipbook
        pdfUrl={uploadedPdf}
        title={customTitle || doc?.title || "Resmî Belge"}
        onClose={onClose}
      />
    );
  }

  if (!docKey || !doc) return null;

  const activePage: CorporatePage = doc.pages[currentPage - 1] || doc.pages[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col bg-slate-900 rounded-3xl shadow-2xl border border-blue-900/40 overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "w-screen h-screen rounded-none max-w-none max-h-none"
            : "w-full max-w-5xl max-h-[94vh] h-[820px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#060e20] via-primary-dark to-[#0f214a] border-b border-blue-900/50 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <BookOpen size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {doc.badge}
                </span>
                <span className="text-[11px] text-blue-200/80 hidden sm:inline">{doc.date}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">{doc.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition"
              title={soundEnabled ? "Sayfa çevirme sesini kapat" : "Sayfa çevirme sesini aç"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-red-400" />}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <Download size={14} />
              <span className="hidden sm:inline">PDF İndir</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition hidden md:block"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-red-500/20 hover:text-red-400 transition"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || isFlipping}
            className="absolute left-2 sm:left-4 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-900/90 text-white border border-white/20 shadow-2xl flex items-center justify-center hover:bg-secondary transition-all disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Önceki Sayfa"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isFlipping}
            className="absolute right-2 sm:right-4 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-900/90 text-white border border-white/20 shadow-2xl flex items-center justify-center hover:bg-secondary transition-all disabled:opacity-20 disabled:pointer-events-none"
            aria-label="Sonraki Sayfa"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className={`relative w-full max-w-4xl h-full flex flex-col md:flex-row bg-[#FBFBFA] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-300/80 overflow-hidden transition-transform duration-300 ${
              isFlipping
                ? flipDirection === "next"
                  ? "scale-[0.98] -rotate-1 opacity-90"
                  : "scale-[0.98] rotate-1 opacity-90"
                : "scale-100 rotate-0 opacity-100"
            }`}
          >
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-400/25 to-transparent pointer-events-none z-10" />

            <div className="hidden md:flex md:w-1/2 flex-col justify-between p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-r border-slate-200/90 relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 pointer-events-none select-none">
                <Image src="/images/logo-symbol.png" alt="MGD Amblem" width={256} height={256} className="object-contain" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Image src="/images/mgd-logo.png" alt="MGD Logo" width={150} height={40} className="h-8 w-auto object-contain" />
                </div>
                <div className="inline-block px-3 py-1 rounded-md bg-blue-100/80 text-primary font-bold text-xs uppercase tracking-wider mb-3">
                  {activePage.chapterTitle || doc.title}
                </div>
                <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activePage.heading}
                </h3>
                {activePage.subheading && (
                  <p className="mt-2 text-xs font-semibold text-secondary leading-relaxed">{activePage.subheading}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Resmî Kurumsal Nüsha</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">MGD / {currentPage * 2 - 1}</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-10 bg-white overflow-y-auto relative">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Milli Gençlik Derneği Resmî Neşriyatı
                  </span>
                  <span className="text-xs font-extrabold text-primary font-mono bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Sayfa {currentPage} / {totalPages}
                  </span>
                </div>

                <div className="md:hidden mb-4">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                    {activePage.chapterTitle}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{activePage.heading}</h3>
                </div>

                <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {activePage.body.map((paragraph, idx) => (
                    <p key={idx} className="text-justify indent-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>{activePage.notes && <p className="text-[10px] text-slate-400 italic">{activePage.notes}</p>}</div>
                {activePage.showSeal && (
                  <div className="relative flex items-center gap-2 p-2 rounded-xl bg-emerald-50/80 border border-emerald-300/80 text-emerald-800">
                    <div className="h-7 w-7 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center font-bold text-[9px] rotate-12">
                      MGD
                    </div>
                    <div className="text-[9px] font-bold leading-tight uppercase">
                      <span>GENEL MERKEZ</span>
                      <br />
                      <span className="text-emerald-600 font-extrabold">RESMÎ MÜHÜR</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-gradient-to-r from-[#060e20] to-[#0A192F] border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200">
              Sayfa <strong>{currentPage}</strong> / {totalPages}
            </span>
            <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300 rounded-full"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isFlipping}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Önceki Sayfa
            </button>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isFlipping}
              className="px-4 py-1.5 rounded-lg bg-secondary hover:bg-blue-600 text-white font-bold shadow transition disabled:opacity-30 flex items-center gap-1"
            >
              Sonraki Sayfa <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
