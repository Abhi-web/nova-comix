import React, { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import SectionHeader from "./SectionHeader";
import RecentUpdateCard from "../cards/RecentUpdateCard";

/**
 * RecentlyUpdatedSection for NOVA PANEL
 * Displays latest serialized chapters with existing format filters (All, Manhwa, Manga, Manhua, Webtoon)
 */
export default function RecentlyUpdatedSection({ stories = [], className = "" }) {
  const [activeFormat, setActiveFormat] = useState("all");

  const formats = [
    { id: "all", label: "All Releases" },
    { id: "manhwa", label: "Manhwa" },
    { id: "manga", label: "Manga" },
    { id: "manhua", label: "Manhua" },
    { id: "webtoon", label: "Webtoon" },
  ];

  // Filter recently updated stories based on format
  const filteredStories = useMemo(() => {
    if (!stories || stories.length === 0) return [];
    if (activeFormat === "all") return stories.slice(0, 6);

    const filtered = stories.filter(
      (item) => item.type?.toLowerCase() === activeFormat.toLowerCase()
    );
    return filtered.length > 0 ? filtered.slice(0, 6) : stories.slice(0, 6);
  }, [stories, activeFormat]);

  return (
    <section aria-labelledby="recent-updates-heading" className={`space-y-4 ${className}`}>
      {/* Section Header with format filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SectionHeader
          title="Recently Updated"
          subtitle="Fresh serialization released within the last 24 hours."
          icon={<Clock className="w-5 h-5 text-accent" />}
          viewAllHref="/manga?sort=latest_updated"
          viewAllLabel="Full Release Schedule"
        />

        {/* Format Filter Tabs */}
        <div
          role="tablist"
          aria-label="Format filter tabs"
          className="flex items-center gap-1 p-1 rounded-xl bg-background-secondary border border-border-card self-start sm:self-auto overflow-x-auto no-scrollbar"
        >
          {formats.map((tab) => {
            const isActive = activeFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormat(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                  isActive
                    ? "bg-accent text-background-primary font-bold shadow-glow-sm"
                    : "text-content-secondary hover:text-content-primary hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Update Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredStories.map((manga) => (
          <RecentUpdateCard key={manga.id} manga={manga} />
        ))}
      </div>
    </section>
  );
}
