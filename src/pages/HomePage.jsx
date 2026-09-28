import React, { useState, useEffect, useMemo } from "react";
import { mangaService } from "../services/mangaService";
import HeroDiscovery from "../components/sections/HeroDiscovery";
import QuickBrowse from "../components/sections/QuickBrowse";
import TrendingSection from "../components/sections/TrendingSection";
import RecentlyUpdatedSection from "../components/sections/RecentlyUpdatedSection";
import GenreTilesGrid from "../components/sections/GenreTilesGrid";
import SectionHeader from "../components/sections/SectionHeader";
import MangaCard from "../components/cards/MangaCard";
import RankingsSidebarPanel from "../components/sections/RankingsSidebarPanel";
import FinalCta from "../components/sections/FinalCta";
import { Compass, CheckCircle } from "lucide-react";

/**
 * Production-Quality HomePage Component for NOVA PANEL
 * 
 * Composition:
 * 1. Large Cinematic Hero (Alternating Dual Animation Slider ~70% + Right Popular Series Leaderboard ~30%)
 * 2. Quick Browse Format Bar
 * 3. Horizontal Trending Showcase with Ranked Badges #01 - #10
 * 4. Split Editorial Canvas:
 *    - Left/Main Column (~68%):
 *      - Recently Updated (with interactive format filters)
 *      - Browse by Genre (horizontal cards with rich cover artwork & counts)
 *      - Completed Bingeable Stories
 *    - Right Sidebar Column (~32% on desktop xl):
 *      - Top Rated Leaderboard & Popular This Week Panels
 * 5. Final Platform CTA
 */
export default function HomePage() {
  const [stories, setStories] = useState(() => mangaService.getAll());

  useEffect(() => {
    async function loadApiData() {
      try {
        const result = await mangaService.fetchList({ limit: 50 });
        if (result && result.items && result.items.length > 0) {
          setStories(result.items);
        }
      } catch {
        // Handled silently by service fallback
      }
    }
    loadApiData();
  }, []);

  // Featured Stories for Hero Slider (3 to 6 stories from catalog)
  const featuredStories = useMemo(() => {
    const featured = stories.filter((item) => item.featured);
    if (featured.length >= 3) return featured.slice(0, 6);
    const nonFeatured = stories.filter((item) => !item.featured);
    const combined = [...featured, ...nonFeatured];
    return combined.slice(0, Math.min(6, combined.length));
  }, [stories]);

  // Hero Story fallback
  const heroStory = useMemo(() => {
    return featuredStories[0] || stories[0] || mangaService.getFeatured()[0];
  }, [featuredStories, stories]);

  // Trending Stories (Top 10 ranked)
  const trendingStories = useMemo(() => {
    return stories.slice(0, 10);
  }, [stories]);

  // Recently Updated Stories (12 items)
  const recentlyUpdated = useMemo(() => {
    return stories.slice(0, 12);
  }, [stories]);

  // Popular This Week (Ranked by views)
  const popularWeek = useMemo(() => {
    const sorted = [...stories].sort((a, b) => (b.views || 0) - (a.views || 0));
    return sorted.slice(0, 10).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [stories]);

  // Top Rated Stories (Ranked by rating)
  const topRatedStories = useMemo(() => {
    const sorted = [...stories].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted.slice(0, 10).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [stories]);

  // Completed Stories
  const completedStories = useMemo(() => {
    const completed = stories.filter((m) => m.status?.toLowerCase() === "completed");
    return (completed.length > 0 ? completed : stories).slice(0, 6);
  }, [stories]);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 animate-fadeIn pb-8">
      {/* 1. CINEMATIC SPLIT HERO SLIDER (DUAL ANIMATION SYSTEM + RIGHT POPULAR PANEL) */}
      <HeroDiscovery
        featuredStories={featuredStories}
        popularStories={popularWeek}
        allStories={stories}
        story={heroStory}
      />

      {/* 2. QUICK BROWSE BAR */}
      <QuickBrowse activeType="all" />

      {/* 3. TRENDING STORIES (HORIZONTAL SCROLLER WITH RANKING BADGES) */}
      <TrendingSection stories={trendingStories} />

      {/* 4. MAIN EDITORIAL DISCOVERY CANVAS (MAIN FEED + RIGHT LEADERBOARD PANELS) */}
      <div className="flex flex-col xl:flex-row items-start gap-8 lg:gap-10">
        {/* Main Feed Column */}
        <div className="flex-1 w-full min-w-0 space-y-12 sm:space-y-16">
          {/* Recently Updated with Format Filter Tabs */}
          <RecentlyUpdatedSection stories={recentlyUpdated} />

          {/* Browse by Genre (Horizontal Scroller with Artwork) */}
          <section aria-labelledby="genres-heading" className="space-y-4">
            <SectionHeader
              title="Browse by Genre"
              subtitle="Explore distinct storytelling disciplines across our archive."
              icon={<Compass className="w-5 h-5 text-accent" />}
              viewAllHref="/genres"
              viewAllLabel="All 12 Disciplines"
            />
            <GenreTilesGrid />
          </section>

          {/* Completed Stories (Bingeable Grid) */}
          <section aria-labelledby="completed-heading" className="space-y-4">
            <SectionHeader
              title="Completed Stories"
              subtitle="Start a story from chapter one and read continuously without waiting."
              icon={<CheckCircle className="w-5 h-5 text-accent" />}
              badge="BINGEABLE"
              viewAllHref="/manga?status=completed"
              viewAllLabel="View All Completed"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {completedStories.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar Leaderboard Column (Visible on Desktop XL) */}
        <div className="hidden xl:block w-80 shrink-0 sticky top-24 self-start">
          <RankingsSidebarPanel
            topRated={topRatedStories}
            popular={popularWeek}
          />
        </div>
      </div>

      {/* 5. FINAL EDITORIAL PLATFORM CTA */}
      <FinalCta />
    </div>
  );
}
