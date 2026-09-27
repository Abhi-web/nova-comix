import React from "react";
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
  ChevronRight,
} from "lucide-react";
import { GENRES_DATA } from "../../data/genresData";

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
 * 12 clean, interactive tiles with subtle visual variations and smooth micro-interactions.
 */
export default function GenreTilesGrid({ className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 ${className}`}
    >
      {GENRES_DATA.map((genre) => {
        const IconComponent = GENRE_ICONS[genre.icon] || Sparkles;

        return (
          <Link
            key={genre.id}
            to={`/manga?genre=${encodeURIComponent(genre.name.toLowerCase())}`}
            className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-background-card/90 hover:bg-background-cardHover border border-border-card hover:border-accent/40 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={`Explore ${genre.name} genre with ${genre.count} stories`}
          >
            {/* Ambient Background Glow on Hover */}
            <div
              className="absolute top-0 right-0 w-24 h-24 bg-accent/[0.04] group-hover:bg-accent/[0.12] rounded-full blur-2xl pointer-events-none transition-colors duration-300"
              aria-hidden="true"
            />

            {/* Top row: Icon and Counter */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-background-elevated border border-border-subtle group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors duration-200">
                <IconComponent className="w-5 h-5 text-accent transition-transform duration-300 group-hover:scale-110" />
              </div>

              <span className="text-[11px] font-mono font-bold text-content-muted group-hover:text-accent transition-colors">
                {genre.count}
              </span>
            </div>

            {/* Bottom row: Genre Name & Arrow */}
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-content-primary group-hover:text-accent transition-colors duration-200 tracking-tight">
                {genre.name}
              </h3>
              <p className="text-[11px] text-content-muted line-clamp-1 mt-0.5 group-hover:text-content-secondary transition-colors font-medium">
                {genre.description}
              </p>

              <div className="mt-3 flex items-center text-xs font-bold text-content-muted group-hover:text-accent transition-colors pt-2 border-t border-border-subtle/50">
                <span>Explore titles</span>
                <ChevronRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform duration-200 text-accent" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
