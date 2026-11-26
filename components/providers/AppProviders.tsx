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
        {children}
      </VolunteerProvider>
    </DonateProvider>
  );
}
