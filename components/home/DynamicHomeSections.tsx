"use client";

import type { ReactNode } from "react";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import BasindaBizSection from "@/components/home/BasindaBizSection";
import VisionSection from "@/components/home/VisionSection";
import ErbakanSection from "@/components/home/ErbakanSection";
import PresidentSection from "@/components/home/PresidentSection";
import TeamGrid from "@/components/home/TeamGrid";
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
import { useSiteSettings } from "@/hooks/useSiteData";
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
  team: () => <TeamGrid key="team" />,
  social: () => <SocialMediaSection key="social" />,
  map: () => <TurkeyMap key="map" />,
  news: () => <NewsShowcase key="news" />,
  publications: () => <PublicationsSection key="publications" />,
  gallery: () => <GallerySection key="gallery" />,
};

export default function DynamicHomeSections() {
  const { data: settings } = useSiteSettings();
  const sections = settings.sections || [];

  return (
    <>
      {sections
        .filter((sec) => sec.enabled)
        .map((sec) => {
          const renderFn = SECTION_COMPONENTS[sec.id];
          return renderFn ? renderFn() : null;
        })}
    </>
  );
}
