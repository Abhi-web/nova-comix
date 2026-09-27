import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { mangaService } from "../services/mangaService";
import { Star, BookOpen, Bookmark, Eye, ArrowUpRight } from "lucide-react";
import { formatRating, formatCompactNumber } from "../utils/helpers";
import Badge from "../components/common/Badge";

/**
 * RankingsPage (/rankings) Component for NOVA PANEL
 * Authoritative reader rankings sorted by community scores and engagement.
 */
export default function RankingsPage() {
  const [filterType, setFilterType] = useState("all");

  const rankedData = useMemo(() => {
    return mangaService.getRankings(filterType);
  }, [filterType]);

  const tabs = [
    { id: "all", label: "Global Top Chart" },
    { id: "manhwa", label: "Top Manhwa" },
    { id: "manga", label: "Top Manga" },
    { id: "manhua", label: "Top Manhua" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Archival Rankings
          </h1>
        </div>
        <p className="text-sm text-content-secondary max-w-xl">
          The highest-rated works on NOVA PANEL calculated through reader reviews, bookmarks, and engagement volume.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 shrink-0 ${
              filterType === tab.id
                ? "bg-accent text-background-primary shadow-glow-accent/30 font-extrabold"
                : "text-content-secondary hover:text-content-primary hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ranked Table / List View */}
      <div className="space-y-3.5">
        {rankedData.map((manga) => (
          <article
            key={manga.id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-background-card/80 border border-border-subtle hover:border-accent/40 hover:bg-background-card shadow-card hover:shadow-card-hover transition-all duration-300 gap-4"
          >
            {/* Left: Rank + Thumbnail + Info */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Rank Marker */}
              <div className="w-10 text-center shrink-0">
                <span
                  className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                    manga.rank === 1
                      ? "text-accent drop-shadow-[0_0_12px_rgba(229,169,60,0.5)]"
                      : manga.rank === 2
                      ? "text-content-primary"
                      : manga.rank === 3
                      ? "text-amber-200/90"
                      : "text-content-muted"
                  }`}
                >
                  {String(manga.rank).padStart(2, "0")}
                </span>
              </div>

              {/* Cover */}
              <Link to={`/manga/${manga.id}`} className="shrink-0">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-16 h-22 sm:w-18 sm:h-24 rounded-xl object-cover bg-background-card group-hover:scale-105 transition-transform duration-500 border border-white/5 shadow-card"
                />
              </Link>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider">
                    {manga.type}
                  </span>
                  {manga.badge && (
                    <Badge variant="accent" size="xs">
                      {manga.badge}
                    </Badge>
                  )}
                  <span className="text-xs text-content-muted">
                    by {manga.author}
                  </span>
                </div>

                <Link
                  to={`/manga/${manga.id}`}
                  className="text-base sm:text-lg font-bold text-content-primary group-hover:text-accent transition-colors block truncate tracking-tight"
                >
                  {manga.title}
                </Link>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-content-secondary">
                  <span className="flex items-center gap-1 font-bold text-accent bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-accent" />
                    {formatRating(manga.rating)}
                  </span>
                  <span className="text-content-muted">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-content-muted" />
                    Ch. {manga.latestChapter}
                  </span>
                  <span className="text-content-muted hidden md:inline">•</span>
                  <span className="hidden md:flex items-center gap-1 text-content-muted">
                    <Eye className="w-3.5 h-3.5" />
                    {formatCompactNumber(manga.views)} views
                  </span>
                  <span className="text-content-muted hidden md:inline">•</span>
                  <span className="hidden md:flex items-center gap-1 text-content-muted">
                    <Bookmark className="w-3.5 h-3.5" />
                    {formatCompactNumber(manga.bookmarks)} saves
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Link */}
            <div className="flex items-center justify-end gap-2 shrink-0 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
              <Link
                to={`/read/${manga.id}-ch-1`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-accent/15 text-accent hover:bg-accent hover:text-background-primary transition-all duration-200 flex items-center gap-1.5 shadow-glow-accent/10 hover:shadow-glow-accent/30"
              >
                <span>Read Ch. 1</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
