"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "main section, main article, main .grid > *, footer";

function shouldSkip(el: HTMLElement): boolean {
  if (el.dataset.mgdReveal) return true;
  if (el.closest("header, [role='dialog'], #manset-slider, [data-no-reveal]")) return true;
  if (el.tagName === "SECTION" && el.closest("[data-scroll-reveal='true']")) return true;
  const style = window.getComputedStyle(el);
  if (style.position === "fixed" || style.position === "sticky" || style.display === "none") return true;
  const rect = el.getBoundingClientRect();
  if (rect.height < 48 || rect.width < 80) return true;
  return false;
}

export default function GlobalScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observed = new Set<HTMLElement>();

    const reveal = (el: HTMLElement) => {
      if (el.dataset.mgdReveal === "visible") return;
      el.dataset.mgdReveal = "visible";
      observed.delete(el);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            reveal(target);
            observer.unobserve(target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -36px 0px",
      },
    );

    const scan = () => {
      const vh = window.innerHeight || 800;
      const nodes = document.querySelectorAll<HTMLElement>(SELECTOR);
      const gridCounters = new WeakMap<Element, number>();

      nodes.forEach((el) => {
        if (shouldSkip(el)) return;
        const rect = el.getBoundingClientRect();

        // Halihazırda ekranda olan öğeleri gizleme, sadece aşağıda bekleyenleri animasyona al
        if (rect.top < vh * 0.92) {
          el.dataset.mgdReveal = "visible";
          return;
        }

        // Aynı grid içindeki kartlara zarif kademeli gecikme (stagger) uygula
        const parent = el.parentElement;
        if (parent && parent.classList.contains("grid")) {
          const idx = gridCounters.get(parent) ?? 0;
          gridCounters.set(parent, idx + 1);
          const delayMs = (idx % 4) * 75;
          el.style.setProperty("--mgd-reveal-delay", `${delayMs}ms`);
        } else {
          el.style.setProperty("--mgd-reveal-delay", "0ms");
        }

        el.dataset.mgdReveal = "pending";
        observed.add(el);
        observer.observe(el);
      });
    };

    // İlk tarama (render oturduktan hemen sonra)
    const rafId = window.requestAnimationFrame(scan);
    const lateTimer = window.setTimeout(scan, 350);

    // Hızlı kaydırmada hiçbir öğenin gizli kalmaması için güvenlik kontrolü
    const onScrollCheck = () => {
      if (observed.size === 0) return;
      const vh = window.innerHeight || 800;
      observed.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.96) {
          reveal(el);
          observer.unobserve(el);
        }
      });
    };

    window.addEventListener("scroll", onScrollCheck, { passive: true });

    let mutTimer: number | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (mutTimer !== null) window.clearTimeout(mutTimer);
      mutTimer = window.setTimeout(scan, 180);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(lateTimer);
      if (mutTimer !== null) window.clearTimeout(mutTimer);
      window.removeEventListener("scroll", onScrollCheck);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
