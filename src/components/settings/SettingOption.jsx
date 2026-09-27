import React from "react";
import { Check } from "lucide-react";

/**
 * SettingOption Component for NOVA PANEL
 * Visual selectable card for options (Theme, Reader Width, Spacing, etc.)
 */
export default function SettingOption({
  selected,
  onClick,
  title,
  description = null,
  icon = null,
  badge = null,
  className = "",
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        selected
          ? "bg-accent/10 border-accent text-content-primary shadow-glow-sm"
          : "bg-[#11131A] border-[#262A35] text-content-secondary hover:text-content-primary hover:border-white/20 hover:bg-white/[0.03]"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className={`shrink-0 transition-colors ${
                selected ? "text-accent" : "text-content-muted group-hover:text-content-secondary"
              }`}
            >
              {icon}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {title}
          </span>
        </div>

        {selected ? (
          <div className="w-4 h-4 rounded-full bg-accent text-background-primary flex items-center justify-center shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 group-hover:border-white/40" />
        )}
      </div>

      {(description || badge) && (
        <div className="mt-2 flex items-center justify-between gap-2 w-full text-[11px] text-content-muted">
          {description && <span className="truncate">{description}</span>}
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-accent">
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
