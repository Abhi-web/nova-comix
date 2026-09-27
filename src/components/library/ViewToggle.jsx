import React from "react";
import { LayoutGrid, List } from "lucide-react";

/**
 * ViewToggle Component for NOVA PANEL Library
 * Toggles between Grid (▦) and List (☷) view modes.
 */
export default function ViewToggle({
  mode = "grid",
  onChange,
  className = "",
}) {
  return (
    <div
      role="group"
      aria-label="View layout mode"
      className={`inline-flex items-center p-1 rounded-xl bg-background-card border border-border-subtle ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view mode"
        aria-pressed={mode === "grid"}
        className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
          mode === "grid"
            ? "bg-accent text-background-primary shadow-glow-accent/25 font-bold"
            : "text-content-secondary hover:text-content-primary"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view mode"
        aria-pressed={mode === "list"}
        className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
          mode === "list"
            ? "bg-accent text-background-primary shadow-glow-accent/25 font-bold"
            : "text-content-secondary hover:text-content-primary"
        }`}
      >
        <List className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
}
