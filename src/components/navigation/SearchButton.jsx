import React from "react";
import { Search } from "lucide-react";

/**
 * SearchButton Component for NOVA PANEL
 * Provides quick trigger for global search modal with keyboard hint.
 */
export default function SearchButton({ onClick, className = "", compact = false }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Search stories"
        className={`p-2 rounded-xl text-content-secondary hover:text-content-primary hover:bg-white/5 border border-transparent hover:border-border-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 ${className}`}
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search stories, authors, or genres"
      className={`group flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-background-card/90 hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-xs text-content-secondary hover:text-content-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm active:scale-[0.99] ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Search className="w-4 h-4 text-content-muted group-hover:text-accent transition-colors shrink-0" />
        <span className="hidden sm:inline font-medium truncate">Search archive...</span>
        <span className="sm:hidden font-medium">Search</span>
      </div>
      <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-background-secondary border border-border-subtle text-[10px] font-mono text-content-muted group-hover:text-content-secondary group-hover:border-border-strong transition-colors">
        ⌘K
      </kbd>
    </button>
  );
}
