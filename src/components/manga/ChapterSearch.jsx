import React from "react";
import { Search, X } from "lucide-react";

/**
 * ChapterSearch Component
 * Accessible search input for chapter number or title
 */
export default function ChapterSearch({ value, onChange, placeholder = "Search chapters...", className = "" }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-content-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm bg-background-card/90 border border-border-subtle rounded-xl text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        aria-label="Search chapters by number or title"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 p-1 text-content-muted hover:text-content-primary rounded transition-colors"
          aria-label="Clear chapter search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
