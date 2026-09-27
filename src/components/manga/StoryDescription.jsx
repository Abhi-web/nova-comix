import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * StoryDescription Component
 * Displays manga description with expandable Read More / Show Less toggle
 */
export default function StoryDescription({ description, synopsis, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = synopsis || description || "No description provided for this title.";
  // Decide whether truncation is necessary (e.g. text longer than 220 chars)
  const isLong = fullText.length > 220;

  return (
    <section className={`space-y-3 ${className}`} aria-labelledby="about-heading">
      <h2
        id="about-heading"
        className="text-lg sm:text-xl font-bold text-content-primary tracking-tight"
      >
        About this story
      </h2>

      <div className="relative">
        <p
          className={`text-sm sm:text-base leading-relaxed text-content-secondary transition-all ${
            !isExpanded && isLong ? "line-clamp-3" : ""
          }`}
        >
          {fullText}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent hover:text-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md py-0.5"
            aria-expanded={isExpanded}
            aria-controls="story-description-content"
          >
            <span>{isExpanded ? "Show less" : "Read more"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
