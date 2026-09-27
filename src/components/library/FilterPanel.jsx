import React from "react";
import { GENRES_DATA } from "../../data/genresData";
import { Filter, RotateCcw, Check, Star } from "lucide-react";

/**
 * FilterPanel Component for NOVA PANEL Library
 * Advanced filtering panel for Desktop sidebar and Mobile drawer.
 */
export default function FilterPanel({
  selectedType = "all",
  onTypeChange,
  selectedGenres = [],
  onToggleGenre,
  selectedStatuses = [],
  onToggleStatus,
  selectedRating = 0,
  onRatingChange,
  onResetFilters,
  activeFilterCount = 0,
  className = "",
}) {
  const types = [
    { id: "all", label: "All Formats" },
    { id: "manga", label: "Manga" },
    { id: "manhwa", label: "Manhwa" },
    { id: "manhua", label: "Manhua" },
    { id: "webtoon", label: "Webtoon" },
  ];

  const statuses = [
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "hiatus", label: "Hiatus" },
  ];

  const ratingOptions = [
    { value: 0, label: "All Ratings" },
    { value: 8, label: "8+ Rating" },
    { value: 7, label: "7+ Rating" },
    { value: 6, label: "6+ Rating" },
  ];

  return (
    <aside
      aria-label="Library story filters"
      className={`space-y-6 ${className}`}
    >
      {/* Filter Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-content-primary">
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-accent text-background-primary">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-content-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1.5 py-0.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. RELEASE TYPE (Synchronized with TypeTabs) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
          Release Format
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          {types.map((t) => {
            const isSelected = selectedType.toLowerCase() === t.id.toLowerCase();
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTypeChange(t.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-left ${
                  isSelected
                    ? "bg-accent/15 text-accent font-semibold border border-accent/40 shadow-glow-accent/10"
                    : "text-content-secondary hover:text-content-primary hover:bg-background-card border border-transparent hover:border-border-subtle"
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. GENRES (Multiple selection) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
            Genres
          </h3>
          {selectedGenres.length > 0 && (
            <span className="text-[10px] font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              {selectedGenres.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
          {GENRES_DATA.map((genre) => {
            const isChecked = selectedGenres.some(
              (g) => g.toLowerCase() === genre.name.toLowerCase()
            );

            return (
              <label
                key={genre.id}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer select-none transition-all duration-200 border ${
                  isChecked
                    ? "bg-accent/15 border-accent/50 text-accent font-semibold shadow-glow-accent/10"
                    : "bg-background-card/60 hover:bg-background-card border-border-subtle/70 text-content-secondary hover:text-content-primary"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleGenre(genre.name)}
                  className="sr-only"
                />
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                    isChecked
                      ? "bg-accent border-accent text-background-primary"
                      : "border-border-strong bg-background-elevated"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{genre.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. STATUS (Multiple selection) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
          Publication Status
        </h3>
        <div className="space-y-1.5">
          {statuses.map((st) => {
            const isChecked = selectedStatuses.some(
              (s) => s.toLowerCase() === st.id.toLowerCase()
            );

            return (
              <label
                key={st.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer select-none transition-all duration-200 border ${
                  isChecked
                    ? "bg-accent/15 border-accent/50 text-accent font-semibold shadow-glow-accent/10"
                    : "bg-background-card/60 hover:bg-background-card border-border-subtle/70 text-content-secondary hover:text-content-primary"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleStatus(st.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      isChecked
                        ? "bg-accent border-accent text-background-primary"
                        : "border-border-strong bg-background-elevated"
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{st.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. RATING THRESHOLD */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
          Minimum Rating
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onRatingChange(opt.value)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isSelected
                    ? "bg-accent text-background-primary border-accent shadow-glow-accent/25"
                    : "bg-background-card/60 hover:bg-background-card border-border-subtle text-content-secondary hover:text-content-primary"
                }`}
              >
                {opt.value > 0 && <Star className="w-3 h-3 fill-current" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
