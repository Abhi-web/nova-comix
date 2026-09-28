import React, { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Swords,
  Compass,
  Smile,
  Film,
  Sparkles,
  Heart,
  Search,
  Rocket,
  Skull,
  Activity,
  Landmark,
  Ghost,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GENRES_DATA } from "../../data/genresData";
import { mangaService } from "../../services/mangaService";

/**
 * Genre icon mapping dictionary
 */
const GENRE_ICONS = {
  Swords,
  Compass,
  Smile,
  Theater: Film,
  Sparkles,
  Heart,
  Search,
  Rocket,
  Skull,
  Activity,
  Landmark,
  Ghost,
};

/**
 * GenreTilesGrid Component for NOVA PANEL
 * Premium horizontal genre browsing section with rich artwork presentation,
 * subtle micro-interactions, title counts, and accessible scroll controls.
 */
export default function GenreTilesGrid({ className = "" }) {
  const scrollerRef = useRef(null);

  // Map each genre to a real cover image from the catalog
  const genreArtMap = useMemo(() => {
    const allManga = mangaService.getAll();
    const map = {};

    GENRES_DATA.forEach((genre) => {
      const match = allManga.find(
        (m) =>
          Array.isArray(m.genres) &&
          m.genres.some(
            (g) =>
              (typeof g === "string" ? g : g.name || "").toLowerCase() ===
              genre.name.toLowerCase()
          )
      );
      if (match) {
        map[genre.id] = match.coverImage || match.cover || match.bannerImage;
      }
    });

    return map;
  }, []);

  const scrollLeft = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative group/container ${className}`}>
      {/* Scroll Navigation Buttons (Desktop) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-12 right-0 z-10">
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll genres left"
          className="w-8 h-8 rounded-full bg-background-card hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-content-secondary hover:text-accent transition-all flex items-center justify-center shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll genres right"
          className="w-8 h-8 rounded-full bg-background-card hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-content-secondary hover:text-accent transition-all flex items-center justify-center shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Scroller Container */}
      <div
        ref={scrollerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-0.5 scroll-smooth snap-x snap-mandatory"
        tabIndex={0}
        aria-label="Horizontal genre catalog scroller"
      >
        {GENRES_DATA.map((genre) => {
          const IconComponent = GENRE_ICONS[genre.icon] || Sparkles;
          const bgImage = genreArtMap[genre.id];

          return (
            <Link
              key={genre.id}
              to={`/manga?genre=${encodeURIComponent(genre.name.toLowerCase())}`}
              className="group relative flex-none w-[170px] sm:w-[200px] h-[130px] sm:h-[145px] rounded-2xl overflow-hidden border border-border-card hover:border-accent/50 shadow-card hover:shadow-card-hover transition-all duration-300 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Explore ${genre.name} genre with ${genre.count} stories`}
            >
              {/* Background Cover Artwork with subtle Zoom on hover */}
              {bgImage ? (
                <img
                  src={bgImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#131720] to-[#07090D]" />
              )}

              {/* Layered Cinematic Scrim for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/80 to-[#07090D]/40 pointer-events-none group-hover:via-[#07090D]/70 transition-colors duration-300" />

              {/* Ambient Accent Glow on Hover */}
              <div
                className="absolute inset-0 bg-accent/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                aria-hidden="true"
              />

              {/* Card Content */}
              <div className="relative z-10 p-3.5 sm:p-4 h-full flex flex-col justify-between">
                {/* Top Row: Icon & Count */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/10 group-hover:border-accent/40 group-hover:bg-accent/15 flex items-center justify-center transition-colors duration-200 backdrop-blur-md">
                    <IconComponent className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                  </div>

                  {genre.count ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-content-muted group-hover:text-accent group-hover:border-accent/30 transition-colors backdrop-blur-md">
                      {genre.count}
                    </span>
                  ) : null}
                </div>

                {/* Bottom Row: Genre Name */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary group-hover:text-accent transition-colors duration-200 tracking-tight flex items-center justify-between">
                    <span>{genre.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-content-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[10px] text-content-muted line-clamp-1 mt-0.5 group-hover:text-content-secondary transition-colors font-medium">
                    {genre.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
