import React from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";

/**
 * RecentUpdateCard Component for NOVA PANEL
 * Displays compact horizontal card with cover thumbnail, title, latest chapter, previous chapter, and update timestamp.
 */
export default function RecentUpdateCard({ manga, className = "" }) {
  if (!manga) return null;

  const prevChapter = manga.previousChapter || (manga.latestChapter > 1 ? manga.latestChapter - 1 : null);

  return (
    <article
      className={`group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-background-card/90 hover:bg-background-cardHover border border-border-card hover:border-accent/40 shadow-card hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      {/* Cover Thumbnail */}
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
        <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-content-primary uppercase tracking-wider">
          {manga.type}
        </span>
      </Link>

      {/* Story & Chapter Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* Title */}
        <div>
          <Link
            to={`/manga/${manga.id}`}
            className="text-sm font-bold text-content-primary group-hover:text-accent transition-colors block truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded tracking-tight"
          >
            {manga.title}
          </Link>
          <p className="text-[11px] text-content-muted truncate mt-0.5 font-medium">
            {manga.genres?.slice(0, 2).join(" • ") || "Sequential Fiction"}
          </p>
        </div>

        {/* Chapters Stack */}
        <div className="mt-2 space-y-1">
          {/* Latest Chapter Link */}
          <Link
            to={`/read/${manga.id}-ch-${manga.latestChapter}`}
            className="inline-flex items-center justify-between w-full text-xs px-2.5 py-1 rounded-lg bg-background-secondary/90 hover:bg-accent-muted hover:text-accent border border-border-subtle/70 hover:border-accent/40 transition-all group/ch"
          >
            <span className="font-semibold text-content-primary group-hover/ch:text-accent flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Chapter {manga.latestChapter}</span>
            </span>
            <span className="text-[10px] font-bold text-accent shrink-0 uppercase tracking-wider ml-1">
              Latest
            </span>
          </Link>

          {/* Previous Chapter Link */}
          {prevChapter && (
            <Link
              to={`/read/${manga.id}-ch-${prevChapter}`}
              className="inline-flex items-center justify-between w-full text-[11px] px-2.5 py-0.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/5 transition-colors font-medium"
            >
              <span className="truncate">Chapter {prevChapter}</span>
              <span className="text-[10px] text-content-muted shrink-0">Previous</span>
            </Link>
          )}
        </div>

        {/* Metadata Bottom Row */}
        <div className="mt-2 pt-1.5 border-t border-border-subtle/50 flex items-center justify-between text-[11px] text-content-muted">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-content-tertiary" />
            <span>Updated {manga.updatedTime}</span>
          </span>

          <span
            className={`font-semibold capitalize ${
              manga.status?.toLowerCase() === "completed"
                ? "text-sky-400"
                : "text-emerald-400"
            }`}
          >
            {manga.status}
          </span>
        </div>
      </div>
    </article>
  );
}
