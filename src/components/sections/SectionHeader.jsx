import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * SectionHeader Component for NOVA PANEL
 * Provides clean editorial headers with optional badge, subtitle, and action link.
 */
export default function SectionHeader({
  title,
  subtitle = null,
  badge = null,
  icon = null,
  viewAllHref = null,
  viewAllLabel = "View All",
  className = "",
  children = null,
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 ${className}`}
    >
      <div>
        {(icon || badge) && (
          <div className="flex items-center gap-2.5 mb-2">
            {icon && <span className="text-accent">{icon}</span>}
            {badge && (
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 shadow-glow-sm">
                {badge}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-accent rounded-full inline-block shadow-glow-sm" />
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-content-primary">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5 ml-4.5 max-w-xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
        {children}
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-content-secondary hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg px-2.5 py-1.5 hover:bg-white/[0.04]"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-accent" />
          </Link>
        )}
      </div>
    </div>
  );
}
