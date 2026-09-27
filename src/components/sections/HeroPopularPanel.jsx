import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flame, Star, ChevronRight } from "lucide-react";
import { formatRating, formatCompactNumber } from "../../utils/helpers";

/**
 * HeroPopularPanel — Right-hand Popular Series ranking panel for NOVA PANEL
 * 
 * Features:
 * - Dedicated visual container aligned with the left hero slider height
 * - Interactive period tabs: [ Weekly ] [ Monthly ] [ All ]
 * - Ranked list with custom 01-05+ rank styling (#1 primary accent, #2/#3 secondary, #4+ neutral)
 * - Compact cards with thumbnail, title, type, genres, rating, and latest chapter
 * - Clean subtle internal scrollbar keeping layout height locked
 * - Hover animations (cover scale, title accent transition, background glow) without jumping
 * - Purely client-side period sorting using existing data fields (views, bookmarks, rating)
 */
export default function HeroPopularPanel({
  stories = [],
  className = "",
}) {
  const [activePeriod, setActivePeriod] = useState("weekly");

  // Derive ranked stories from existing catalog data
  const rankedStories = useMemo(() => {
    if (!Array.isArray(stories) || stories.length === 0) return [];

    const cloned = [...stories];
    if (activePeriod === "weekly") {
      // Sort by views descending
      cloned.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (activePeriod === "monthly") {
      // Sort by bookmarks descending
      cloned.sort((a, b) => (b.bookmarks || 0) - (a.bookmarks || 0));
    } else {
      // Sort by rating descending
      cloned.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return cloned.slice(0, 10).map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  }, [stories, activePeriod]);

  const tabs = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "all", label: "All" },
  ];

  return (
    <aside
      aria-label="Popular Series Leaderboard"
      className={`relative rounded-3xl bg-[#11131A] border border-border-card shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Top Header & Tabs Section */}
      <div className="shrink-0 space-y-3 pb-3 border-b border-border-subtle/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow-sm">
              <Flame className="w-4 h-4 text-accent fill-accent/20" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-content-primary">
                Popular Series
              </h2>
            </div>
          </div>

          <Link
            to="/rankings"
            className="group flex items-center gap-0.5 text-[11px] font-semibold text-content-muted hover:text-accent transition-colors"
            aria-label="View complete rankings leaderboard"
          >
            <span>Top Chart</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Period Selector Tabs */}
        <div
          role="tablist"
          aria-label="Popularity timeframes"
          className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#090A0F]/80 border border-white/5"
        >
          {tabs.map((tab) => {
            const isActive = activePeriod === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActivePeriod(tab.id)}
                className={`py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  isActive
                    ? "bg-accent text-background-primary shadow-glow-sm"
                    : "text-content-secondary hover:text-content-primary hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ranked Story List (Scrollable inside panel) */}
      <div
        tabIndex={0}
        aria-label="Ranked stories list"
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-3 pr-1 space-y-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-xl"
      >
        {rankedStories.map((manga) => {
          const rank = manga.rank;
          const coverImg = manga.coverImage || manga.cover;
          const genres = Array.isArray(manga.genres) ? manga.genres : [];
          const genreDisplay = genres.slice(0, 2).join(", ");
          const mangaId = manga._id || manga.id || manga.slug;

          return (
            <Link
              key={mangaId}
              to={`/manga/${mangaId}`}
              className="group relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#151821]/70 hover:bg-[#1A1D26] border border-border-card/60 hover:border-accent/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              aria-label={`Rank ${rank}: ${manga.title}`}
            >
              {/* Rank Number Badge */}
              <div className="w-6 sm:w-7 text-center shrink-0 flex items-center justify-center">
                <span
                  className={`text-xs sm:text-sm font-mono font-black px-1.5 py-0.5 rounded-lg select-none transition-colors ${
                    rank === 1
                      ? "bg-accent/20 text-accent border border-accent/50 shadow-glow-sm"
                      : rank === 2
                      ? "bg-white/10 text-white/95 border border-white/20"
                      : rank === 3
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : "text-content-muted"
                  }`}
                >
                  {String(rank).padStart(2, "0")}
                </span>
              </div>

              {/* Small Story Thumbnail */}
              <div className="relative w-10 sm:w-11 aspect-[3/4.2] rounded-xl overflow-hidden bg-background-secondary shrink-0 border border-white/5">
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt=""
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-background-card flex items-center justify-center text-[10px] text-content-muted">
                    NP
                  </div>
                )}
              </div>

              {/* Story Details */}
              <div className="flex-1 min-w-0 pr-1">
                {/* Type & Genres */}
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-content-muted mb-0.5 truncate">
                  <span className="font-bold text-accent">
                    {manga.type || "MANGA"}
                  </span>
                  {genreDisplay && (
                    <>
                      <span>•</span>
                      <span className="truncate">{genreDisplay}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-content-primary truncate group-hover:text-accent transition-colors duration-200 tracking-tight">
                  {manga.title}
                </h3>

                {/* Rating & Latest Chapter Metadata */}
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  {manga.rating && (
                    <span className="flex items-center gap-0.5 font-bold text-accent">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {formatRating(manga.rating)}
                    </span>
                  )}

                  {manga.latestChapter && (
                    <>
                      <span className="text-content-muted">•</span>
                      <span className="text-content-secondary font-mono text-[10px]">
                        Ch. {manga.latestChapter}
                      </span>
                    </>
                  )}

                  {manga.views > 0 && (
                    <>
                      <span className="text-content-muted hidden sm:inline">•</span>
                      <span className="text-content-muted font-mono text-[10px] hidden sm:inline">
                        {formatCompactNumber(manga.views)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Chevron */}
              <div className="shrink-0 pr-1 text-content-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Subtle Quick Link */}
      <div className="shrink-0 pt-3 mt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px] text-content-muted">
        <span>Updated continuously</span>
        <Link
          to="/rankings"
          className="text-accent hover:underline font-semibold flex items-center gap-1"
        >
          View all 28 series
        </Link>
      </div>
    </aside>
  );
}
