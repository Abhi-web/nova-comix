import React from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Clock } from "lucide-react";
import { formatRating } from "../../utils/helpers";
import Skeleton from "../common/Skeleton";

/**
 * MangaList Component for NOVA PANEL Library
 * Displays stories in List view mode with:
 * Cover, Title, Type, Genres, Rating, Status, Latest Chapter, and Last Updated.
 */
export default function MangaList({
  stories = [],
  isLoading = false,
  className = "",
}) {
  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`} aria-busy="true" aria-label="Loading stories list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-background-card border border-border-subtle">
            <Skeleton variant="rect" className="w-16 h-22 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-1/3 h-4" />
              <Skeleton variant="text" className="w-1/4 h-3" />
              <Skeleton variant="text" className="w-2/3 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {stories.map((manga) => (
        <article
          key={manga.id}
          className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-background-card/80 hover:bg-background-card border border-border-subtle hover:border-accent/40 shadow-card hover:shadow-card-hover transition-all duration-300 gap-4"
        >
          {/* Left: Thumbnail & Details */}
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
            {/* Cover */}
            <Link
              to={`/manga/${manga.id}`}
              className="relative w-16 sm:w-20 aspect-[3/4.2] rounded-xl overflow-hidden bg-background-secondary shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent border border-white/5"
              aria-label={`View ${manga.title}`}
            >
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </Link>

            {/* Info details */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/25 uppercase tracking-wider">
                  {manga.type}
                </span>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    manga.status?.toLowerCase() === "completed"
                      ? "text-sky-400 bg-sky-950/40 border border-sky-800/40"
                      : manga.status?.toLowerCase() === "hiatus"
                      ? "text-amber-400 bg-amber-950/40 border border-amber-800/40"
                      : "text-emerald-400 bg-emerald-950/40 border border-emerald-800/40"
                  }`}
                >
                  {manga.status}
                </span>

                {manga.author && (
                  <span className="text-xs text-content-muted">
                    by {manga.author}
                  </span>
                )}
              </div>

              {/* Title */}
              <Link
                to={`/manga/${manga.id}`}
                className="text-base sm:text-lg font-bold text-content-primary group-hover:text-accent transition-colors block truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded tracking-tight"
              >
                {manga.title}
              </Link>

              {/* Genres */}
              <p className="text-xs text-content-muted mt-1 line-clamp-1">
                {manga.genres?.join(" • ")}
              </p>

              {manga.description && (
                <p className="text-xs text-content-secondary line-clamp-1 mt-1 hidden md:block leading-relaxed">
                  {manga.description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Metadata Stack & Action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle text-xs">
            <div className="flex items-center gap-3 sm:gap-2">
              <div className="flex items-center gap-1 font-bold text-accent bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-accent" />
                <span>{formatRating(manga.rating)}</span>
              </div>

              <span className="text-content-muted hidden sm:inline">•</span>

              <div className="flex items-center gap-1 font-semibold text-content-primary">
                <BookOpen className="w-3.5 h-3.5 text-content-muted" />
                <span>Ch. {manga.latestChapter}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-content-muted">
              <Clock className="w-3 h-3" />
              <span>{manga.updatedTime || "Recently updated"}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
