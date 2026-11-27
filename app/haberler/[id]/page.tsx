"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Newspaper, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import LinkifiedText from "@/components/ui/LinkifiedText";
import { useNews } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function HaberDetayPage() {
  const params = useParams();
  const slugParam = decodeURIComponent(String(params?.id || ""));
  const { data: allNews } = useNews();

  const item =
    allNews.find((n) => slugify(n.title) === slugParam || n.id === slugParam) || allNews[0];
  const related = allNews.filter((n) => n.id !== item?.id).slice(0, 5);

  const paragraphs = item?.content
    ? item.content
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [
        item?.summary || "",
        "Milli Gençlik Derneği Genel Merkezi koordinasyonunda; 81 il teşkilatımız, ilçe temsilciliklerimiz, ortaöğretim ve üniversite komisyonlarımızla gençliğimizin ahlaki, ilmi ve fikri gelişimi için çalışmalarımızı kararlılıkla sürdürüyoruz.",
        "“Önce Ahlak ve Maneviyat” düsturuyla çıktığımız bu kutlu yolda, ülkemizin yarınlarını inşa edecek şuurlu nesiller yetiştirmek adına tüm faaliyetlerimiz kamuoyunun bilgisine açık şekilde devam etmektedir.",
      ].filter(Boolean);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({ title: item?.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        window.alert("Haber bağlantısı kopyalandı.");
      }
    } catch {}
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sol: Ana Haber İçeriği (8 sütun) */}
            <article className="lg:col-span-8">
              <ScrollReveal y={20} duration={650}>
                <Link
                  href="/haberler"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition mb-6"
                >
                  <ArrowLeft size={14} /> Haberlere Dön
                </Link>

                <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-ink leading-[1.18] tracking-tight">
                  {item.title}
                </h1>

                {/* Meta Bilgi Şeridi */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                      <CalendarDays size={14} className="text-primary" />
                      {formatDate(item.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                      <Clock size={14} className="text-primary" />
                      MGD Genel Merkez
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary">
                      {item.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-white hover:text-primary transition"
                  >
                    <Share2 size={13} /> Paylaş
                  </button>
                </div>

                {/* Kapak Görseli */}
                <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
                  <Image
                    src={item.image || "/images/mgd/haydi-milli-genclik.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>

                {/* Haber Metni (Metin içi tüm bağlantılar otomatik mavi tıklanabilir linke dönüşür) */}
                <div className="mt-8 space-y-5 text-[15px] sm:text-base leading-[1.85] text-slate-700">
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className={idx === 0 ? "font-semibold text-ink text-base sm:text-lg leading-relaxed" : ""}>
                      <LinkifiedText text={p} />
                    </p>
                  ))}
                </div>

                {/* Yazı Altı Özel Bağlantı (Admin panelinden eklendiyse mavi tıklanabilir link olarak görünür) */}
                {item.linkUrl?.trim() && (() => {
                  const raw = item.linkUrl.trim();
                  const isExternal = !raw.startsWith("/") && !raw.startsWith("#");
                  const href = isExternal && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
                  const label = item.linkText?.trim() || raw;
                  return (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      {isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-base font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-4 transition-colors break-all"
                        >
                          <span>{label}</span>
                          <ExternalLink size={16} className="shrink-0" />
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 text-base font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-400 underline-offset-4 transition-colors break-all"
                        >
                          <span>{label}</span>
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </ScrollReveal>
            </article>

            {/* Sağ: İlgili Haberler Kartı (4 sütun) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <ScrollReveal delay={120} y={24} duration={750}>
                <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6">
                  <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200/80">
                    <Newspaper size={18} className="text-primary" />
                    <h2 className="font-display text-base font-extrabold text-ink">
                      İlgili Haberler
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/haberler/${slugify(rel.title) || rel.id}`}
                        className="group flex items-start gap-3.5 rounded-2xl p-2 -mx-2 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                          <Image
                            src={rel.image || "/images/mgd/nicin-milli-genclik.jpg"}
                            alt={rel.title}
                            fill
                            sizes="80px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-[13px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {rel.title}
                          </h3>
                          <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                            <CalendarDays size={11} />
                            {formatDate(rel.date)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
