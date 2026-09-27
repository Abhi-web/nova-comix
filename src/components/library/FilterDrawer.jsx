import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import FilterPanel from "./FilterPanel";
import Button from "../common/Button";

/**
 * FilterDrawer Component for NOVA PANEL Library (Mobile View)
 * Accessible slide-over drawer containing the FilterPanel.
 */
export default function FilterDrawer({
  isOpen = false,
  onClose,
  totalResultsCount = 0,
  ...filterProps
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter Options Drawer"
      className="fixed inset-0 z-50 lg:hidden flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-sm h-full bg-background-secondary border-l border-border-subtle shadow-2xl flex flex-col z-10 animate-fadeIn">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-background-card/50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-content-primary">
              Filter Stories
            </h2>
            {filterProps.activeFilterCount > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-accent text-background-primary">
                {filterProps.activeFilterCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters drawer"
            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/5 border border-border-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <FilterPanel {...filterProps} />
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 border-t border-border-subtle bg-background-card/80 flex items-center gap-3">
          {filterProps.activeFilterCount > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={filterProps.onResetFilters}
              className="flex-1 text-xs"
            >
              Clear All
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            icon={<Check className="w-4 h-4" />}
            className="flex-1 text-xs font-bold"
          >
            Show {totalResultsCount} Results
          </Button>
        </div>
      </div>
    </div>
  );
}
