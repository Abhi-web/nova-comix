import React from "react";
import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";
import { Filter } from "lucide-react";

/**
 * ResultsHeader Component for NOVA PANEL Library
 * Displays total count of filtered stories, mobile filter trigger, sorting, and view toggle.
 */
export default function ResultsHeader({
  count = 0,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount = 0,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-border-subtle ${className}`}
    >
      {/* Left: Total Stories Count & Mobile Filter Button */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <span className="text-sm font-semibold text-content-primary">
          <strong className="text-accent font-extrabold">{count}</strong>{" "}
          {count === 1 ? "story" : "stories"} found
        </span>

        {/* Mobile Filters Trigger Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background-card hover:bg-background-cardHover border border-border-subtle hover:border-accent/40 text-xs font-semibold text-content-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Filter className="w-3.5 h-3.5 text-accent" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-accent text-background-primary font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Right: Sort Dropdown & View Mode Toggle */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <SortDropdown value={sortBy} onChange={onSortChange} />
        <ViewToggle mode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}
