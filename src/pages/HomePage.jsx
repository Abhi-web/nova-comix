import React, { useState, useEffect, useMemo } from "react";
import { mangaService } from "../services/mangaService";
import HeroDiscovery from "../components/sections/HeroDiscovery";
import QuickBrowse from "../components/sections/QuickBrowse";
import MangaCard from "../components/cards/MangaCard";
import RecentUpdateCard from "../components/cards/RecentUpdateCard";
import CompactMangaCard from "../components/cards/CompactMangaCard";
import GenreTilesGrid from "../components/sections/GenreTilesGrid";
import SectionHeader from "../components/sections/SectionHeader";
import FinalCta from "../components/sections/FinalCta";
import EmptyState from "../components/common/EmptyState";
import { TrendingUp, Clock, Flame, CheckCircle, Compass } from "lucide-react";

/**
 * Production-Quality HomePage Component for NOVA PANEL
 * Connected to live REST API data with graceful offline dataset fallback.
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

  // Featured Stories for Hero Slider (3 to 6 stories from existing catalog)
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

  // Trending Stories (6 items)
  const trendingStories = useMemo(() => {
    return stories.slice(0, 6);
  }, [stories]);

  // Recently Updated Stories (6 items)
  const recentlyUpdated = useMemo(() => {
    return stories.slice(0, 6);
  }, [stories]);

  // Popular This Week (Ranked 01-05)
  const popularWeek = useMemo(() => {
    const sorted = [...stories].sort((a, b) => (b.views || 0) - (a.views || 0));
    return sorted.slice(0, 5).map((item, index) => ({
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
    <div className="space-y-16 sm:space-y-20 lg:space-y-24 animate-fadeIn pb-6">
      {/* 2. CINEMATIC SPLIT HERO SLIDER */}
      <HeroDiscovery
        featuredStories={featuredStories}
        popularStories={popularWeek}
        allStories={stories}
        story={heroStory}
      />

      {/* 3. QUICK BROWSE (Immediately below hero) */}
      <QuickBrowse activeType="all" />

      {/* 4. TRENDING STORIES */}
      <section aria-labelledby="trending-heading">
        <SectionHeader
          title="Trending Now"
          subtitle="Stories readers are discovering right now."
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          badge="HOT"
          viewAllHref="/manga"
          viewAllLabel="Explore All Trending"
        />

        {trendingStories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {trendingStories.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No trending stories in this format"
            description="There are currently no featured titles matching this format."
            action={
              <button
                type="button"
                onClick={() => setActiveFormat("all")}
                className="px-4 py-2 rounded-lg bg-accent text-background-primary text-xs font-semibold"
              >
                Reset to All Formats
              </button>
            }
          />
        )}
      </section>

      {/* 5. RECENTLY UPDATED */}
      <section aria-labelledby="recent-updates-heading">
        <SectionHeader
          title="Recently Updated"
          subtitle="Fresh serialization released within the last 24 hours."
          icon={<Clock className="w-5 h-5 text-accent" />}
          viewAllHref="/manga"
          viewAllLabel="Full Release Schedule"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {recentlyUpdated.map((manga) => (
            <RecentUpdateCard key={manga.id} manga={manga} />
          ))}
        </div>
      </section>

      {/* 6. POPULAR THIS WEEK (Ranked Leaderboard) */}
      <section aria-labelledby="popular-week-heading">
        <SectionHeader
          title="Popular This Week"
          subtitle="Top-ranked stories by total readership and bookmarks."
          icon={<Flame className="w-5 h-5 text-accent" />}
          viewAllHref="/rankings"
          viewAllLabel="View Full Rankings"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {popularWeek.map((manga, index) => (
            <CompactMangaCard
              key={manga.id}
              manga={manga}
              rank={index + 1}
            />
          ))}
        </div>
      </section>

      {/* 7. BROWSE BY GENRE */}
      <section aria-labelledby="genres-heading">
        <SectionHeader
          title="Browse by Genre"
          subtitle="Explore distinct storytelling disciplines across our archive."
          icon={<Compass className="w-5 h-5 text-accent" />}
          viewAllHref="/genres"
          viewAllLabel="All 12 Disciplines"
        />

        <GenreTilesGrid />
      </section>

      {/* 8. COMPLETED STORIES */}
      <section aria-labelledby="completed-heading">
        <SectionHeader
          title="Completed Stories"
          subtitle="Start a story from chapter one and read without waiting."
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

      {/* 9. FINAL CTA */}
      <FinalCta />
    </div>
  );
}
