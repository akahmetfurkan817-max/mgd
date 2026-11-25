"use client";

import type { ReactNode } from "react";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import BasindaBizSection from "@/components/home/BasindaBizSection";
import VisionSection from "@/components/home/VisionSection";
import ErbakanSection from "@/components/home/ErbakanSection";
import PresidentSection from "@/components/home/PresidentSection";
import TeamGrid from "@/components/home/TeamGrid";
import LeadershipCompact from "@/components/home/LeadershipCompact";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import TurkeyMap from "@/components/home/TurkeyMap";
import NewsShowcase from "@/components/home/NewsShowcase";
import HomeSlider from "@/components/home/HomeSlider";
import OncuSahsiyetlerSection from "@/components/home/OncuSahsiyetlerSection";
import ReportsSection from "@/components/home/ReportsSection";
import CalendarEventsSection from "@/components/home/CalendarEventsSection";
import VideoGallerySection from "@/components/home/VideoGallerySection";
import PublicationsSection from "@/components/home/PublicationsSection";
import GallerySection from "@/components/home/GallerySection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useSiteSettings } from "@/hooks/useSiteData";
import { DEFAULT_SECTIONS } from "@/data/site-settings";
import type { HomeSectionId } from "@/types";

const SECTION_COMPONENTS: Record<HomeSectionId, () => ReactNode> = {
  hero: () => <Hero key="hero" />,
  sliderNews: () => <HomeSlider key="sliderNews" />,
  stats: () => <StatsBar key="stats" />,
  basindaBiz: () => <BasindaBizSection key="basindaBiz" />,
  principles: () => <OncuSahsiyetlerSection key="oncuSahsiyetler" />,
  reports: () => <ReportsSection key="reports" />,
  events: () => <CalendarEventsSection key="events" />,
  videos: () => <VideoGallerySection key="videos" />,
  vision: () => <VisionSection key="vision" />,
  erbakan: () => <ErbakanSection key="erbakan" />,
  president: () => <PresidentSection key="president" />,
  team: () => <LeadershipCompact key="team" />,
  social: () => <SocialMediaSection key="social" />,
  map: () => <TurkeyMap key="map" />,
  news: () => <NewsShowcase key="news" />,
  publications: () => <PublicationsSection key="publications" />,
  gallery: () => <GallerySection key="gallery" />,
};

export default function DynamicHomeSections() {
  const { data: settings } = useSiteSettings();
  const remoteSections = settings.sections || [];
  const enabledCount = remoteSections.filter((s) => s.enabled).length;
  const baseSections =
    remoteSections.length > 0 && enabledCount <= 9
      ? remoteSections
      : DEFAULT_SECTIONS;

  const activeSections = baseSections.filter((sec) => sec.enabled);

  // Yönetim (team) bölümü aktifse ve takvim (events) eski Firestore kaydında kapalı kaldıysa hemen altına yerleştir
  if (!activeSections.some((s) => s.id === "events")) {
    const teamIdx = activeSections.findIndex((s) => s.id === "team");
    const defaultEvents = DEFAULT_SECTIONS.find((s) => s.id === "events");
    if (defaultEvents) {
      if (teamIdx >= 0) {
        activeSections.splice(teamIdx + 1, 0, defaultEvents);
      } else {
        activeSections.push(defaultEvents);
      }
    }
  }

  return (
    <>
      {activeSections.map((sec, idx) => {
        const renderFn = SECTION_COMPONENTS[sec.id];
        if (!renderFn) return null;
        if (idx === 0 && sec.id === "sliderNews") {
          return renderFn();
        }
        return (
          <ScrollReveal key={sec.id} delay={40} y={32} duration={800}>
            {renderFn()}
          </ScrollReveal>
        );
      })}
    </>
  );
}
