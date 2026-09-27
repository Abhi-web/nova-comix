import React from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar Component for NOVA PANEL Library
 * Large search field matching title, alternative titles, author, artist, and genres.
 */
export default function SearchBar({
  value = "",
  onChange,
  onClear,
  placeholder = "Search stories, authors, or artists...",
  className = "",
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <Search className="absolute left-4 w-5 h-5 text-accent pointer-events-none shrink-0" />

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && value) {
              onClear();
            }
          }}
          placeholder={placeholder}
          aria-label="Search stories, authors, or artists"
          className="w-full pl-12 pr-11 py-3.5 sm:py-4 rounded-2xl bg-background-secondary/90 backdrop-blur-sm border border-border-subtle hover:border-border-strong text-content-primary placeholder:text-content-muted text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent shadow-card"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search input"
            className="absolute right-3.5 p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
