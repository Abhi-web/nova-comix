import React from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Clock } from "lucide-react";
import Badge from "../common/Badge";
import { formatRating } from "../../utils/helpers";

/**
 * Primary MangaCard Component for NOVA PANEL
 * Displays cover, title, metadata, rating, and latest chapter with subtle hover dynamics.
 */
export default function MangaCard({ manga, className = "", priority = false }) {
  if (!manga) return null;

  return (
    <article
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-background-card border border-border-card hover:border-accent/40 hover:shadow-card-hover transition-all duration-300 ${className}`}
    >
      <Link
        to={`/manga/${manga.id}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
        aria-label={`View ${manga.title}, Chapter ${manga.latestChapter}, Rated ${manga.rating}`}
      >
        {/* Cover Media Container */}
        <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-background-secondary">
          <img
            src={manga.cover}
            alt={manga.title}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />

          {/* Cinematic Gradient Scrim for Contrast & Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-black/30 opacity-90 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-1.5">
            {manga.status?.toLowerCase() === "completed" ? (
              <Badge variant="info" size="xs" className="shadow-md">
                COMPLETED
              </Badge>
            ) : manga.badge ? (
              <Badge variant="accent" size="xs" className="shadow-md">
                {manga.badge}
              </Badge>
            ) : (
              <span />
            )}

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-content-primary border border-white/10 uppercase tracking-wider shadow-sm">
              {manga.type}
            </span>
          </div>

          {/* Rating Badge on Cover */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-accent shadow-sm">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span>{formatRating(manga.rating)}</span>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-content-secondary shadow-sm">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                manga.status?.toLowerCase() === "completed"
                  ? "bg-sky-400"
                  : "bg-emerald-400 animate-pulseSubtle"
              }`}
            />
            <span className="capitalize">{manga.status}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
          {/* Title & Genre */}
          <div>
            <h3 className="text-sm font-bold text-content-primary line-clamp-1 group-hover:text-accent transition-colors duration-200 tracking-tight">
              {manga.title}
            </h3>
            {manga.genres && manga.genres.length > 0 && (
              <p className="text-[11px] text-content-muted mt-0.5 line-clamp-1 font-medium">
                {manga.genres.slice(0, 2).join(" • ")}
              </p>
            )}
          </div>

          {/* Chapter Metadata & Recency */}
          <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-xs text-content-secondary">
            <div className="flex items-center gap-1.5 font-semibold text-content-primary group-hover:text-accent transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-accent/80 group-hover:text-accent transition-colors" />
              <span>Ch. {manga.latestChapter}</span>
            </div>

            {manga.updatedTime && (
              <div className="flex items-center gap-1 text-[11px] text-content-muted font-medium">
                <Clock className="w-3 h-3" />
                <span>{manga.updatedTime}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
