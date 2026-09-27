import React from "react";
import { NavLink } from "react-router-dom";
import { BRAND_CONFIG } from "../../utils/brand";

/**
 * DesktopNavigation Component for NOVA PANEL
 * Clean horizontal navigation links with subtle active states.
 */
export default function DesktopNavigation({ className = "" }) {
  return (
    <nav
      aria-label="Desktop Main Navigation"
      className={`hidden md:flex items-center gap-1.5 ${className}`}
    >
      {BRAND_CONFIG.navLinks.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? "text-accent bg-accent/10 border border-accent/30 shadow-glow-sm"
                : "text-content-secondary hover:text-content-primary hover:bg-white/[0.04] border border-transparent"
            }`
          }
        >
          {({ isActive }) => (
            <span className="flex items-center gap-1.5">
              {item.label}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulseSubtle" />
              )}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
