import React, { useState, useMemo } from "react";
import ChapterSearch from "./ChapterSearch";
import ChapterSort from "./ChapterSort";
import ChapterRow from "./ChapterRow";
import Button from "../common/Button";
import { BookOpen } from "lucide-react";

/**
 * ChapterList Component
 * Orchestrates chapter searching, sorting (Newest/Oldest), and list rendering
 */
export default function ChapterList({ chapters = [], readingProgress, className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [visibleCount, setVisibleCount] = useState(25);

  // Filter and sort chapters
  const filteredChapters = useMemo(() => {
    let result = [...chapters];

    // Filter by search query (number or title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((ch) => {
        const numStr = (ch.number || "").toString();
        const titleStr = (ch.title || "").toLowerCase();
        const subTitleStr = (ch.subTitle || "").toLowerCase();
        return (
          numStr.includes(q) ||
          titleStr.includes(q) ||
          subTitleStr.includes(q)
        );
      });
    }

    // Sort chapters
    result.sort((a, b) => {
      const numA = Number(a.number) || 0;
      const numB = Number(b.number) || 0;
      return sortOrder === "newest" ? numB - numA : numA - numB;
    });

    return result;
  }, [chapters, searchQuery, sortOrder]);

  const displayedChapters = filteredChapters.slice(0, visibleCount);
  const hasMore = visibleCount < filteredChapters.length;

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="chapters-heading">
      {/* Header with Title and Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <h2
            id="chapters-heading"
            className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight"
          >
            Chapters
          </h2>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            {chapters.length} chapters available
          </p>
        </div>

        {/* Controls: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <ChapterSearch
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setVisibleCount(25);
            }}
            className="w-full sm:w-56"
          />
          <ChapterSort
            sortOrder={sortOrder}
            onSortChange={(order) => setSortOrder(order)}
          />
        </div>
      </div>

      {/* Chapters Table */}
      {filteredChapters.length === 0 ? (
        <div className="py-12 text-center rounded-xl bg-background-card/40 border border-border-subtle">
          <BookOpen className="w-10 h-10 text-content-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-sm font-semibold text-content-primary">
            No chapters match your search
          </h3>
          <p className="text-xs text-content-muted mt-1">
            Try searching for a different chapter number or title keyword.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-3 text-xs font-semibold text-accent hover:underline"
          >
            Clear chapter search
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedChapters.map((chapter) => (
            <ChapterRow
              key={chapter.id}
              chapter={chapter}
              readingProgress={readingProgress}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-2 text-center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setVisibleCount((prev) => prev + 25)}
            className="w-full sm:w-auto"
          >
            Load More Chapters ({filteredChapters.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </section>
  );
}
