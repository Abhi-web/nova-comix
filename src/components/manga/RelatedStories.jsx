import React from "react";
import MangaCard from "../cards/MangaCard";
import { mangaService } from "../../services/mangaService";
import { Sparkles } from "lucide-react";

/**
 * RelatedStories Component
 * Displays 4-6 recommended titles sharing genres with current manga
 */
export default function RelatedStories({ currentManga, className = "" }) {
  if (!currentManga) return null;

  const related = mangaService.getRelated(currentManga, 6);

  if (!related || related.length === 0) return null;

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="related-stories-heading">
      <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
        <span className="w-1.5 h-6 bg-accent rounded-full inline-block shadow-glow-accent/40" />
        <div>
          <h2
            id="related-stories-heading"
            className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight"
          >
            More Like This
          </h2>
          <p className="text-xs sm:text-sm text-content-muted">
            Stories sharing similar themes, format, and narrative discipline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {related.map((item) => (
          <MangaCard key={item.id} manga={item} />
        ))}
      </div>
    </section>
  );
}
