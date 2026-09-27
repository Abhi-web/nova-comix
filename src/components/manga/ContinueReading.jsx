import React from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import Button from "../common/Button";
import { getReadingProgress } from "../../utils/storage";

/**
 * ContinueReading Component
 * Renders a reading banner when user has existing progress in localStorage
 */
export default function ContinueReading({ mangaId, className = "" }) {
  if (!mangaId) return null;

  const progressData = getReadingProgress(mangaId);

  // If no saved progress, return null (do not show section)
  if (!progressData || !progressData.chapterId) {
    return null;
  }

  const percent = Math.min(100, Math.max(0, Number(progressData.progress) || 0));

  return (
    <section
      className={`rounded-3xl border border-accent/40 bg-gradient-to-r from-accent/15 via-background-card/90 to-background-card p-5 sm:p-6 shadow-glow-accent/15 relative overflow-hidden backdrop-blur-sm ${className}`}
      aria-label="Continue reading saved progress"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow-accent/50" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Continue Reading
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-content-primary truncate">
            {progressData.chapterTitle || `Chapter ${progressData.chapterNumber || ""}`}
          </h3>

          <div className="mt-3 flex items-center gap-3">
            <div className="w-44 sm:w-64 h-2 bg-background-primary rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-accent font-mono">
              {percent}% complete
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <Link to={`/read/${progressData.chapterId}`}>
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4 fill-current" />}
              className="shadow-glow-accent/25 font-bold"
            >
              CONTINUE
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
