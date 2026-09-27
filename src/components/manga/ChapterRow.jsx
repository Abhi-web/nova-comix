import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import Badge from "../common/Badge";

/**
 * ChapterRow Component
 * Displays a single chapter in the chapter table with title, timestamp, new badge, reading progress, and navigation link.
 */
export default function ChapterRow({ chapter, readingProgress, className = "" }) {
  if (!chapter) return null;

  // Check if reading progress applies to this chapter
  const hasProgress =
    readingProgress &&
    readingProgress.chapterId === chapter.id &&
    typeof readingProgress.progress === "number";

  const percent = hasProgress
    ? Math.min(100, Math.max(0, readingProgress.progress))
    : 0;

  const isCompleted = percent >= 100;

  return (
    <Link
      to={`/read/${chapter.id}`}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-background-card/60 hover:bg-background-card border border-border-subtle/70 hover:border-accent/40 shadow-card hover:shadow-card-hover transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      aria-label={`Read Chapter ${chapter.number}: ${chapter.subTitle || chapter.title}`}
    >
      {/* Chapter Information */}
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-bold text-sm text-content-primary group-hover:text-accent transition-colors">
            {chapter.shortTitle || `Chapter ${chapter.number}`}
          </span>

          {chapter.isNew && (
            <Badge variant="accentSubtle" size="xs">
              NEW
            </Badge>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              READ
            </span>
          )}
        </div>

        {/* Chapter Subtitle / Name */}
        <p className="text-xs sm:text-sm text-content-secondary group-hover:text-content-primary transition-colors truncate">
          {chapter.subTitle || chapter.title}
        </p>

        {/* Progress Bar (if reading progress exists for this chapter) */}
        {hasProgress && !isCompleted && (
          <div className="mt-2.5 flex items-center gap-2">
            <div className="w-28 sm:w-36 h-1.5 bg-background-primary rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-accent rounded-full transition-all duration-200"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-accent">
              {percent}% read
            </span>
          </div>
        )}
      </div>

      {/* Timestamp & Navigation Arrow */}
      <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 shrink-0 text-content-muted">
        <span className="flex items-center gap-1.5 text-xs text-content-muted font-medium">
          <Clock className="w-3.5 h-3.5" />
          {chapter.publishedAt || "Recently"}
        </span>

        <span className="w-8 h-8 rounded-xl bg-background-secondary flex items-center justify-center text-content-muted group-hover:text-accent group-hover:bg-accent/15 group-hover:translate-x-1 transition-all duration-200 border border-transparent group-hover:border-accent/25">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
