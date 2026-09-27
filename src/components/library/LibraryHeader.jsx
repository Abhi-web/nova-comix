import React from "react";
import { Sparkles } from "lucide-react";

/**
 * LibraryHeader Component for NOVA PANEL Explore / Library Page
 * Title: "Explore Stories"
 * Subtitle: "Discover new worlds, follow your favorites, and find your next read."
 */
export default function LibraryHeader({ className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Curated Archive</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-8 bg-gradient-to-b from-accent to-accent-hover rounded-full inline-block shadow-glow-accent/40" />
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
          Explore Stories
        </h1>
      </div>
      <p className="text-sm sm:text-base text-content-secondary max-w-2xl leading-relaxed ml-4.5">
        Discover new worlds, follow your favorites, and explore thousands of chapters across our comprehensive digital archive.
      </p>
    </div>
  );
}

