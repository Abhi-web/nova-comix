import React from "react";
import { X, RotateCcw } from "lucide-react";

/**
 * ActiveFilters Component for NOVA PANEL Library
 * Displays removable filter chips and a Clear All button.
 */
export default function ActiveFilters({
  searchQuery = "",
  onClearSearch,
  selectedType = "all",
  onClearType,
  selectedGenres = [],
  onRemoveGenre,
  selectedStatuses = [],
  onRemoveStatus,
  selectedRating = 0,
  onClearRating,
  onClearAll,
  className = "",
}) {
  const chips = [];

  if (searchQuery.trim()) {
    chips.push({
      id: "search",
      label: `Search: "${searchQuery}"`,
      onRemove: onClearSearch,
    });
  }

  if (selectedType && selectedType.toLowerCase() !== "all") {
    chips.push({
      id: "type",
      label: `Format: ${selectedType.toUpperCase()}`,
      onRemove: onClearType,
    });
  }

  selectedGenres.forEach((genre) => {
    chips.push({
      id: `genre-${genre}`,
      label: genre,
      onRemove: () => onRemoveGenre(genre),
    });
  });

  selectedStatuses.forEach((status) => {
    chips.push({
      id: `status-${status}`,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      onRemove: () => onRemoveStatus(status),
    });
  });

  if (selectedRating > 0) {
    chips.push({
      id: "rating",
      label: `★ ${selectedRating}+ Rating`,
      onRemove: onClearRating,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      aria-label="Active Filters"
      className={`flex flex-wrap items-center gap-2 pt-1 ${className}`}
    >
      <span className="text-xs font-semibold text-content-muted uppercase tracking-wider mr-1">
        Active:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/40 select-none shadow-glow-accent/10 animate-fadeIn"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="p-0.5 rounded-full hover:bg-accent hover:text-background-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </span>
      ))}

      {chips.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-content-muted hover:text-accent transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-lg ml-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}
