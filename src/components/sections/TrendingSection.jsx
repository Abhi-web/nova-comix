import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Star, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { formatRating } from "../../utils/helpers";

/**
 * TrendingSection — Horizontal Trending Showcase for NOVA PANEL
 * 
 * Features:
 * - Ranked badges (01-10) with special gold/silver/amber styling for top 3
 * - Subtle cover image zoom on hover
 * - High density metadata: title, rating, chapter, type, status
 * - Smooth horizontal scroll with touch support and desktop arrow controls
 * - 100% real catalog data
 */
export default function TrendingSection({ stories = [], className = "" }) {
  const scrollerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (!stories || stories.length === 0) return null;

  return (
    <section aria-labelledby="trending-heading" className={`relative ${className}`}>
      {/* Section Header with View All */}
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="Trending Now"
          subtitle="Top titles readers are actively engaging with this week."
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          badge="HOT"
          viewAllHref="/manga"
          viewAllLabel="View All Trending"
        />

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-2 self-start pt-1">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll trending titles left"
            className="w-8 h-8 rounded-full bg-background-card hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-content-secondary hover:text-accent transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll trending titles right"
            className="w-8 h-8 rounded-full bg-background-card hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-content-secondary hover:text-accent transition-all flex items-center justify-center shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller Container */}
      <div
        ref={scrollerRef}
        tabIndex={0}
        aria-label="Horizontal trending manga list"
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth snap-x snap-mandatory"
      >
        {stories.map((manga, index) => {
          const rank = index + 1;
          const mangaId = manga._id || manga.id || manga.slug;
          const coverImg = manga.coverImage || manga.cover;

          return (
            <article
              key={mangaId}
              className="group relative flex-none w-[170px] sm:w-[195px] flex flex-col rounded-2xl overflow-hidden bg-background-card border border-border-card hover:border-accent/50 hover:shadow-card-hover transition-all duration-300 snap-start"
            >
              <Link
                to={`/manga/${mangaId}`}
                className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                aria-label={`Rank ${rank}: ${manga.title}, Chapter ${manga.latestChapter}, Rating ${manga.rating}`}
              >
                {/* Media Container with Cover Artwork */}
                <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-background-secondary">
                  {coverImg ? (
                    <img
                      src={coverImg}
                      alt={manga.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-content-muted">
                      NOVA
                    </div>
                  )}

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-black/30 pointer-events-none" />

                  {/* Rank Badge in Top-Left */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg select-none shadow-md backdrop-blur-md ${
                        rank === 1
                          ? "bg-accent text-background-primary font-extrabold shadow-glow-sm"
                          : rank === 2
                          ? "bg-white/90 text-black font-extrabold"
                          : rank === 3
                          ? "bg-amber-500/90 text-black font-extrabold"
                          : "bg-black/75 text-content-secondary border border-white/10"
                      }`}
                    >
                      #{String(rank).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Format/Type Pill in Top-Right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-content-primary border border-white/10 uppercase tracking-wider shadow-sm">
                      {manga.type || "MANGA"}
                    </span>
                  </div>

                  {/* Rating on Cover Bottom-Left */}
                  {manga.rating && (
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-accent shadow-sm">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span>{formatRating(manga.rating)}</span>
                    </div>
                  )}

                  {/* Status Indicator Bottom-Right */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-content-secondary shadow-sm">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        manga.status?.toLowerCase() === "completed"
                          ? "bg-sky-400"
                          : "bg-emerald-400 animate-pulseSubtle"
                      }`}
                    />
                    <span className="capitalize">{manga.status || "Ongoing"}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-content-primary line-clamp-1 group-hover:text-accent transition-colors duration-200 tracking-tight">
                      {manga.title}
                    </h3>
                    {Array.isArray(manga.genres) && manga.genres.length > 0 && (
                      <p className="text-[11px] text-content-muted mt-0.5 line-clamp-1 font-medium">
                        {manga.genres.slice(0, 2).join(" • ")}
                      </p>
                    )}
                  </div>

                  {/* Chapter Metadata */}
                  <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-xs text-content-secondary">
                    <div className="flex items-center gap-1.5 font-semibold text-content-primary group-hover:text-accent transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-accent/80 group-hover:text-accent transition-colors" />
                      <span>Ch. {manga.latestChapter || 1}</span>
                    </div>

                    {manga.updatedTime && (
                      <span className="text-[10px] text-content-muted">
                        {manga.updatedTime}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
