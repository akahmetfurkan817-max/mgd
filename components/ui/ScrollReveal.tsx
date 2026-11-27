"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  once?: boolean;
}

/**
 * Yumuşak (premium) aşağı kaydırma görünürlük animasyonu.
 * IntersectionObserver ile ekranın görünür alanına giren her bölümü / kartı
 * GPU hızlandırmalı opacity + translateY geçişiyle akıcı biçimde sahneye alır.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 820,
  y = 32,
  scale = 0.985,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setVisible(true);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        setVisible(true);
        if (once) return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px -36px 0px",
      },
    );

    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        setVisible(true);
        if (once) {
          observer.unobserve(el);
          window.removeEventListener("scroll", onScroll);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [once]);

  return (
    <div
      ref={ref}
      data-scroll-reveal="true"
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0) scale(1)" : `translate3d(0, ${y}px, 0) scale(${scale})`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
