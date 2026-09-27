import React from "react";
import MangaCard from "../cards/MangaCard";
import Skeleton from "../common/Skeleton";

/**
 * MangaGrid Component for NOVA PANEL Library
 * Displays stories in responsive grid mode:
 * Desktop: 5-6 cards per row
 * Tablet: 3-4 cards
 * Mobile: 2 cards
 */
export default function MangaGrid({
  stories = [],
  isLoading = false,
  className = "",
}) {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5 ${className}`}
        aria-busy="true"
        aria-label="Loading stories grid"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-2 p-2 rounded-xl bg-background-card border border-border-subtle">
            <Skeleton variant="card" className="w-full" />
            <Skeleton variant="text" className="w-3/4 h-3.5" />
            <Skeleton variant="text" className="w-1/2 h-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5 ${className}`}
    >
      {stories.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
}
