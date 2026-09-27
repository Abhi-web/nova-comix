import React from "react";
import { Link } from "react-router-dom";
import { Star, Eye } from "lucide-react";
import { formatRating, formatCompactNumber } from "../../utils/helpers";

/**
 * CompactMangaCard Component for NOVA PANEL
 * Ranking-style item displaying Rank, Cover, Title, Rating, Views, and Genre.
 */
export default function CompactMangaCard({
  manga,
  rank = null,
  className = "",
}) {
  if (!manga) return null;

  return (
    <article
      className={`group relative flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-background-card/90 hover:bg-background-cardHover border border-border-card hover:border-accent/40 shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      <Link
        to={`/manga/${manga.id}`}
        className="flex items-center gap-3 sm:gap-4 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
      >
        {/* Ranking Number */}
        {rank !== null && (
          <div className="w-8 sm:w-9 text-center shrink-0 flex items-center justify-center">
            <span
              className={`text-sm sm:text-base font-extrabold font-mono px-2 py-1 rounded-lg ${
                rank === 1
                  ? "bg-accent/20 text-accent border border-accent/40 shadow-glow-sm"
                  : rank === 2
                  ? "bg-white/10 text-content-primary border border-white/20"
                  : rank === 3
                  ? "bg-amber-950/40 text-amber-300 border border-amber-500/30"
                  : "bg-background-elevated text-content-muted border border-border-subtle"
              }`}
            >
              {String(rank).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-12 sm:w-14 aspect-[3/4.2] rounded-xl overflow-hidden bg-background-secondary shrink-0 border border-white/5">
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
              {manga.type}
            </span>
            <span className="text-[10px] text-content-muted">•</span>
            <span className="text-[10px] text-content-muted font-medium truncate">
              {manga.genres?.[0] || "Serial"}
            </span>
          </div>

          <h4 className="text-sm font-bold text-content-primary truncate group-hover:text-accent transition-colors tracking-tight">
            {manga.title}
          </h4>

          {/* Rating, Views, Genre stats */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-content-secondary">
            <div className="flex items-center gap-1 text-accent font-bold">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span>{formatRating(manga.rating)}</span>
            </div>

            <span className="text-content-muted text-[10px]">•</span>

            <div className="flex items-center gap-1 text-content-muted text-xs font-medium">
              <Eye className="w-3 h-3 text-content-tertiary" />
              <span>{formatCompactNumber(manga.views)} reads</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
