"use client";

import { useEffect, type ReactNode } from "react";
import { DonateProvider } from "@/components/donate/DonateProvider";
import { VolunteerProvider } from "@/components/volunteer/VolunteerProvider";
import { useSiteSettings } from "@/hooks/useSiteData";

function ThemeSync() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme?.primaryColor && /^#[0-9a-fA-F]{6}$/.test(settings.theme.primaryColor)) {
      root.style.setProperty("--mgd-primary", settings.theme.primaryColor);
    }
    if (settings.theme?.secondaryColor && /^#[0-9a-fA-F]{6}$/.test(settings.theme.secondaryColor)) {
      root.style.setProperty("--mgd-secondary", settings.theme.secondaryColor);
    }
  }, [settings.theme?.primaryColor, settings.theme?.secondaryColor]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <DonateProvider>
      <VolunteerProvider>
        <ThemeSync />
        {/* Tüm site boyunca sağ ve sol kenarlarda içeriye doğru yumuşakça yayılan İslami geometrik motif */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 left-0 z-[15] hidden lg:block w-56 xl:w-80 2xl:w-[440px] islamic-pattern-light"
          style={{
            maskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 right-0 z-[15] hidden lg:block w-56 xl:w-80 2xl:w-[440px] islamic-pattern-light"
          style={{
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          }}
        />
        {children}
      </VolunteerProvider>
    </DonateProvider>
  );
}
