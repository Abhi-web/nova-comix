import React from "react";
import { Compass, BookOpen, Layers, Flame, Sparkles } from "lucide-react";

/**
 * TypeTabs Component for NOVA PANEL Library
 * Prominent horizontal filter for ALL, MANGA, MANHWA, MANHUA, WEBTOON
 */
export default function TypeTabs({
  activeType = "all",
  onTypeChange,
  className = "",
}) {
  const types = [
    { id: "all", label: "ALL", icon: Compass },
    { id: "manga", label: "MANGA", icon: BookOpen },
    { id: "manhwa", label: "MANHWA", icon: Layers },
    { id: "manhua", label: "MANHUA", icon: Flame },
    { id: "webtoon", label: "WEBTOON", icon: Sparkles },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter stories by release format"
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {types.map((t) => {
        const Icon = t.icon;
        const isActive = activeType.toLowerCase() === t.id.toLowerCase();

        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onTypeChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 select-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? "bg-accent text-background-primary shadow-glow-accent/30 font-extrabold"
                : "bg-background-card/80 hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:border-border-strong hover:scale-[1.02]"
            }`}
          >
            <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-background-primary scale-110" : "text-accent"}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
