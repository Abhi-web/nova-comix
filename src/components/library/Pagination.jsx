import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination Component for NOVA PANEL Library
 * Displays Previous, Page numbers (1 2 3 ...), and Next controls.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Library pagination navigation"
      className={`flex items-center justify-center gap-2 pt-6 ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background-card hover:bg-background-cardHover text-xs font-semibold text-content-primary disabled:opacity-30 disabled:cursor-not-allowed border border-border-subtle hover:border-border-strong transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4 text-accent" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Numbered Page Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? "page" : undefined}
              className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? "bg-accent text-background-primary shadow-glow-accent/30 font-extrabold"
                  : "bg-background-card hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:border-border-strong hover:scale-105"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-background-card hover:bg-background-cardHover text-xs font-semibold text-content-primary disabled:opacity-30 disabled:cursor-not-allowed border border-border-subtle hover:border-border-strong transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4 text-accent" />
      </button>
    </nav>
  );
}
