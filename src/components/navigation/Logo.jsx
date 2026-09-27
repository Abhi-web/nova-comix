import React from "react";
import { Link } from "react-router-dom";
import { BRAND_CONFIG } from "../../utils/brand";

/**
 * Logo Component for NOVA PANEL
 * Encapsulates the visual identity mark and brand typography.
 */
export default function Logo({ className = "", compact = false }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl py-1 px-1.5 transition-transform duration-200 active:scale-95 ${className}`}
      aria-label={`${BRAND_CONFIG.name} Home`}
    >
      {/* Brand Geometric Emblem */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-accent/20 to-background-card border border-accent/30 group-hover:border-accent/70 shadow-sm transition-all duration-300 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-accent transition-transform duration-300 group-hover:rotate-45"
        >
          <path
            d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {!compact && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="text-base font-extrabold tracking-tight text-content-primary">
              NOVA
            </span>
            <span className="text-base font-extrabold tracking-tight text-accent">
              PANEL
            </span>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-content-muted mt-0.5">
            DIGITAL PUBLISHING
          </span>
        </div>
      )}
    </Link>
  );
}
