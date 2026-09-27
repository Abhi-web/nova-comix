import React from "react";
import { Star, Eye, BookOpen, Bookmark } from "lucide-react";
import { formatRating, formatCompactNumber } from "../../utils/helpers";

/**
 * MangaStats Component
 * Displays compact statistics row (Rating, Views, Chapters, Bookmarks)
 */
export default function MangaStats({ manga, totalChapters, className = "" }) {
  if (!manga) return null;

  const stats = [
    {
      id: "rating",
      label: "Rating",
      value: formatRating(manga.rating),
      icon: Star,
      iconColor: "text-amber-400 fill-amber-400",
      highlight: true,
    },
    {
      id: "views",
      label: "Views",
      value: formatCompactNumber(manga.views || 0),
      icon: Eye,
      iconColor: "text-sky-400",
    },
    {
      id: "chapters",
      label: "Chapters",
      value: (totalChapters || manga.latestChapter || 0).toString(),
      icon: BookOpen,
      iconColor: "text-accent",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      value: formatCompactNumber(manga.bookmarks || 0),
      icon: Bookmark,
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-3.5 ${className}`}
      aria-label="Story statistics"
    >
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-background-card/80 border border-border-subtle backdrop-blur-sm transition-all duration-200 hover:border-accent/30 hover:bg-background-card shadow-card"
          >
            <div className="w-11 h-11 rounded-xl bg-background-secondary flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold text-content-primary tracking-tight truncate flex items-center gap-1">
                {item.value}
                {item.id === "rating" && (
                  <span className="text-[11px] font-normal text-content-muted">/10</span>
                )}
              </div>
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">
                {item.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
