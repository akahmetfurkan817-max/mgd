"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, Quote, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLeaders, usePresident } from "@/hooks/useSiteData";
import { slugify } from "@/lib/slug";

export default function BaskanlikDivaniUyeDetayPage() {
  const params = useParams();
  const slugParam = decodeURIComponent(String(params?.id || ""));
  const { data: leaders } = useLeaders();
  const { data: president } = usePresident();

  const isPresident =
    president &&
    (slugParam === slugify(president.name) ||
      slugParam === "genel-baskan" ||
      slugParam === president.id);

  const person = isPresident
    ? {
        name: president.name,
        title: president.title || "Milli Gençlik Derneği Genel Başkanı",
        photo: president.photo || "/images/ahmet-ozvatan.jpg",
        bio: president.bio,
        message: president.message,
        email: president.email || "baskan@milligenclik.org.tr",
        xUrl: president.xUrl || "https://x.com/milligenclikmgd",
        instagramUrl: president.instagramUrl || "https://www.instagram.com/milligenclikmgd/",
        isPresident: true,
      }
    : (() => {
        const found =
          leaders.find((l) => slugify(l.name) === slugParam || l.id === slugParam) || leaders[0];
        if (!found) return null;
        return {
          name: found.name,
          title: found.title,
          photo: found.photo,
          bio: found.bio,
          message: "",
          email: found.email || "iletisim@milligenclik.org.tr",
          xUrl: found.xUrl || "https://x.com/milligenclikmgd",
          instagramUrl: found.instagramUrl || "https://www.instagram.com/milligenclikmgd/",
          isPresident: false,
        };
      })();

  if (!person) return null;

  const bioParagraphs = (person.bio || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#071A34] text-white flex flex-col">
      <Header />

      <main className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          <ScrollReveal y={22} duration={700}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Sol: Renkli Portre (4 sütun) */}
              <div className="lg:col-span-4">
                <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0C254A] shadow-2xl">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      className="object-cover object-top"
                      priority
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#10305E] to-[#071A34]">
                      <User size={72} className="text-white/20" />
                    </div>
                  )}
                </div>
              </div>

              {/* Sağ: Gradyanlı Biyografi Kartı (8 sütun) */}
              <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-br from-[#103468] via-[#0B264E] to-[#071A36] p-7 sm:p-11 shadow-2xl">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-tight">
                    {person.name}
                  </h1>
                  <p className="mt-1.5 text-base sm:text-lg italic font-medium text-blue-200/90">
                    {person.title}
                  </p>

                  {person.isPresident && person.message && (
                    <blockquote className="mt-6 rounded-2xl border-l-4 border-blue-400 bg-white/[0.06] p-5 text-sm sm:text-base italic leading-relaxed text-blue-50/95 whitespace-pre-line">
                      <Quote size={18} className="inline mr-2 text-blue-300" />
                      {person.message}
                    </blockquote>
                  )}

                  <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-blue-50/90">
                    {bioParagraphs.length > 0 ? (
                      bioParagraphs.map((para, idx) => <p key={idx}>{para}</p>)
                    ) : (
                      <p>
                        Milli Gençlik Derneği Başkanlık Divanı bünyesinde gençliğimizin ahlaki, ilmi ve fikri gelişimi için çalışmalarını sürdürmektedir.
                      </p>
                    )}
                  </div>

                  {/* Sosyal Medya İkonları */}
                  <div className="mt-8 flex items-center gap-3">
                    <a
                      href={person.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B264E] hover:bg-blue-100 transition shadow"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${person.email}`}
                      aria-label="E-Posta"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B264E] hover:bg-blue-100 transition shadow"
                    >
                      <Mail size={17} />
                    </a>
                    <a
                      href={person.xUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="X"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B264E] hover:bg-blue-100 transition shadow"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Sağ Altta Geri Dön Butonu */}
                <div className="mt-10 flex justify-end">
                  <Link
                    href="/baskanlik-divani"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary hover:bg-blue-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
                  >
                    <ArrowLeft size={15} />
                    <span>Başkanlık Divanı Sayfasına Dön</span>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
