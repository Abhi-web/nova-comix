import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * SortDropdown Component for NOVA PANEL Library
 * Options: Latest Updated, Recently Added, Highest Rated, Most Popular, A-Z, Z-A
 */
export default function SortDropdown({
  value = "latest_updated",
  onChange,
  className = "",
}) {
  const options = [
    { id: "latest_updated", label: "Latest Updated" },
    { id: "recently_added", label: "Recently Added" },
    { id: "highest_rated", label: "Highest Rated" },
    { id: "most_popular", label: "Most Popular" },
    { id: "title_asc", label: "A-Z (Title)" },
    { id: "title_desc", label: "Z-A (Title)" },
  ];

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <label htmlFor="sort-dropdown-select" className="text-xs text-content-muted font-medium hidden sm:inline">
        Sort by:
      </label>

      <div className="relative">
        <select
          id="sort-dropdown-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sort stories by"
          className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-background-card/90 hover:bg-background-card border border-border-subtle hover:border-border-strong text-xs font-semibold text-content-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent cursor-pointer shadow-sm"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-background-secondary text-content-primary">
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent pointer-events-none" />
      </div>
    </div>
  );
}
