import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Star, ChevronRight, Flame } from "lucide-react";
import { formatRating, formatCompactNumber } from "../../utils/helpers";

/**
 * RankingsSidebarPanel for NOVA PANEL
 * Displays compact Top Rated and Popular Leaderboard panels
 */
export default function RankingsSidebarPanel({ topRated = [], popular = [], className = "" }) {
  return (
    <aside aria-label="Curated Leaderboard Panels" className={`space-y-6 ${className}`}>
      {/* Top Rated Showcase Panel */}
      <div className="rounded-3xl bg-[#0D1016] border border-border-subtle p-5 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow-sm">
              <Trophy className="w-4 h-4 text-accent fill-accent/20" />
            </span>
            <h3 className="text-sm font-black uppercase tracking-wider text-content-primary">
              Top Rated
            </h3>
          </div>

          <Link
            to="/rankings"
            className="group flex items-center gap-0.5 text-[11px] font-semibold text-content-muted hover:text-accent transition-colors"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* List of 5 items */}
        <div className="space-y-2.5">
          {topRated.slice(0, 5).map((manga, idx) => {
            const rank = idx + 1;
            const coverImg = manga.coverImage || manga.cover;
            const mangaId = manga._id || manga.id || manga.slug;

            return (
              <Link
                key={mangaId}
                to={`/manga/${mangaId}`}
                className="group flex items-center gap-3 p-2 rounded-2xl bg-[#131720]/80 hover:bg-[#171C25] border border-border-card/60 hover:border-accent/40 transition-colors"
              >
                {/* Rank */}
                <div className="w-6 text-center shrink-0">
                  <span
                    className={`text-xs font-mono font-black ${
                      rank === 1
                        ? "text-accent"
                        : rank === 2
                        ? "text-white"
                        : rank === 3
                        ? "text-amber-400"
                        : "text-content-muted"
                    }`}
                  >
                    {String(rank).padStart(2, "0")}
                  </span>
                </div>

                {/* Cover */}
                <div className="relative w-10 aspect-[3/4.2] rounded-xl overflow-hidden bg-background-secondary shrink-0 border border-white/5">
                  {coverImg && (
                    <img
                      src={coverImg}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs font-bold text-content-primary truncate group-hover:text-accent transition-colors">
                    {manga.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className="flex items-center gap-0.5 font-bold text-accent">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      ★ {formatRating(manga.rating)}
                    </span>
                    <span className="text-content-muted">•</span>
                    <span className="text-content-muted font-mono text-[10px]">
                      Ch. {manga.latestChapter || 1}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-content-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Popular Leaderboard Panel */}
      <div className="rounded-3xl bg-[#0D1016] border border-border-subtle p-5 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow-sm">
              <Flame className="w-4 h-4 text-accent fill-accent/20" />
            </span>
            <h3 className="text-sm font-black uppercase tracking-wider text-content-primary">
              Popular This Week
            </h3>
          </div>

          <Link
            to="/rankings"
            className="group flex items-center gap-0.5 text-[11px] font-semibold text-content-muted hover:text-accent transition-colors"
          >
            <span>Top</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* List of 5 items */}
        <div className="space-y-2.5">
          {popular.slice(0, 5).map((manga, idx) => {
            const rank = idx + 1;
            const coverImg = manga.coverImage || manga.cover;
            const mangaId = manga._id || manga.id || manga.slug;

            return (
              <Link
                key={mangaId}
                to={`/manga/${mangaId}`}
                className="group flex items-center gap-3 p-2 rounded-2xl bg-[#131720]/80 hover:bg-[#171C25] border border-border-card/60 hover:border-accent/40 transition-colors"
              >
                {/* Rank */}
                <div className="w-6 text-center shrink-0">
                  <span
                    className={`text-xs font-mono font-black ${
                      rank === 1
                        ? "text-accent"
                        : rank === 2
                        ? "text-white"
                        : rank === 3
                        ? "text-amber-400"
                        : "text-content-muted"
                    }`}
                  >
                    {String(rank).padStart(2, "0")}
                  </span>
                </div>

                {/* Cover */}
                <div className="relative w-10 aspect-[3/4.2] rounded-xl overflow-hidden bg-background-secondary shrink-0 border border-white/5">
                  {coverImg && (
                    <img
                      src={coverImg}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs font-bold text-content-primary truncate group-hover:text-accent transition-colors">
                    {manga.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className="text-content-muted text-[10px] font-mono">
                      {formatCompactNumber(manga.views || 0)} reads
                    </span>
                    <span className="text-content-muted">•</span>
                    <span className="text-content-muted font-mono text-[10px]">
                      Ch. {manga.latestChapter || 1}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-content-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
