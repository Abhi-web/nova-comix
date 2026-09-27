import React from "react";
import { FolderX } from "lucide-react";

/**
 * Reusable EmptyState component when lists or search results are empty.
 */
export default function EmptyState({
  icon = <FolderX className="w-12 h-12 text-content-muted" />,
  title = "No stories found",
  description = "We couldn't find any titles matching your query. Try broadening your criteria or explore other categories.",
  action = null,
  className = "",
}) {
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-background-card/60 border border-border-subtle/80 backdrop-blur-sm ${className}`}
    >
      {/* Subtle top glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-accent/[0.04] blur-2xl rounded-full pointer-events-none" />

      <div className="p-4 mb-4 rounded-2xl bg-background-elevated/80 border border-border-subtle shadow-sm flex items-center justify-center text-accent/80">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-content-primary mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-content-secondary max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="relative z-10">{action}</div>}
    </div>
  );
}
