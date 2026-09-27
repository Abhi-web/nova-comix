import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * ChapterSort Component
 * Allows toggling between 'newest' (Newest First) and 'oldest' (Oldest First)
 */
export default function ChapterSort({ sortOrder = "newest", onSortChange, className = "" }) {
  return (
    <div
      className={`inline-flex items-center rounded-xl bg-background-card/90 border border-border-subtle p-1 shrink-0 ${className}`}
      role="group"
      aria-label="Sort chapters order"
    >
      <button
        type="button"
        onClick={() => onSortChange("newest")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
          sortOrder === "newest"
            ? "bg-accent text-background-primary shadow-sm"
            : "text-content-secondary hover:text-content-primary hover:bg-white/5"
        }`}
        aria-pressed={sortOrder === "newest"}
      >
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Newest First</span>
      </button>

      <button
        type="button"
        onClick={() => onSortChange("oldest")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
          sortOrder === "oldest"
            ? "bg-accent text-background-primary shadow-sm"
            : "text-content-secondary hover:text-content-primary hover:bg-white/5"
        }`}
        aria-pressed={sortOrder === "oldest"}
      >
        <ArrowUp className="w-3.5 h-3.5" />
        <span>Oldest First</span>
      </button>
    </div>
  );
}
