import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Compass, BookOpen, Layers, Flame, Sparkles } from "lucide-react";

/**
 * QuickBrowse Component for NOVA PANEL
 * Compact interactive discovery row below the Hero section.
 * Options: ALL, MANGA, MANHWA, MANHUA, WEBTOON
 */
export default function QuickBrowse({
  activeType = null,
  className = "",
}) {
  const [searchParams] = useSearchParams();
  const currentType = activeType || searchParams.get("type") || "all";

  const options = [
    { id: "all", label: "ALL", path: "/manga", icon: Compass },
    { id: "manga", label: "MANGA", path: "/manga?type=manga", icon: BookOpen },
    { id: "manhwa", label: "MANHWA", path: "/manga?type=manhwa", icon: Layers },
    { id: "manhua", label: "MANHUA", path: "/manga?type=manhua", icon: Flame },
    { id: "webtoon", label: "WEBTOON", path: "/manga?type=webtoon", icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Quick format discovery"
      className={`w-full p-2.5 sm:p-3 rounded-2xl bg-background-card/90 border border-border-card shadow-card ${className}`}
    >
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-widest text-content-muted px-2.5 hidden lg:inline select-none">
            Format:
          </span>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = currentType.toLowerCase() === opt.id.toLowerCase();

            return (
              <Link
                key={opt.id}
                to={opt.path}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 select-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive
                    ? "bg-accent text-background-primary shadow-glow-sm hover:bg-accent-hover"
                    : "bg-background-elevated hover:bg-background-elevated/80 text-content-secondary hover:text-content-primary border border-border-subtle hover:border-accent/40"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-background-primary" : "text-accent"}`} />
                <span>{opt.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Catalog shortcut link */}
        <Link
          to="/manga"
          className="text-xs font-bold text-content-secondary hover:text-accent transition-colors px-3.5 py-2 shrink-0 hidden sm:inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl hover:bg-white/[0.04]"
        >
          <span>Explore All Stories</span>
          <span aria-hidden="true" className="text-accent">→</span>
        </Link>
      </div>
    </nav>
  );
}
