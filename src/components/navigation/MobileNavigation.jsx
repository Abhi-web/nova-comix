import React, { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { X, Compass, Library, Grid, Trophy, LogIn, UserPlus, Sliders } from "lucide-react";
import { BRAND_CONFIG } from "../../utils/brand";
import { useSettings } from "../../context/SettingsContext";
import Logo from "./Logo";

/**
 * MobileNavigation Drawer Component for NOVA PANEL
 * Provides accessible mobile navigation overlay and menu list.
 */
export default function MobileNavigation({ isOpen, onClose }) {
  const { openSettings } = useSettings();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navIcons = {
    "/": <Compass className="w-4 h-4 text-accent" />,
    "/manga": <Library className="w-4 h-4 text-accent" />,
    "/genres": <Grid className="w-4 h-4 text-accent" />,
    "/rankings": <Trophy className="w-4 h-4 text-accent" />,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 md:hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-background-secondary border-l border-border-subtle p-6 flex flex-col justify-between shadow-2xl animate-fadeIn">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
            <Logo compact={false} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/5 border border-border-subtle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile navigation links">
            {BRAND_CONFIG.navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent bg-accent-muted/40 font-semibold"
                      : "text-content-secondary hover:text-content-primary hover:bg-background-card"
                  }`
                }
              >
                {navIcons[item.path] || <Compass className="w-4 h-4" />}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Settings & Auth Quick Actions */}
        <div className="pt-6 border-t border-border-subtle flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              openSettings();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-background-card text-content-primary hover:bg-background-cardHover border border-border-subtle text-sm font-medium transition-colors"
          >
            <Sliders className="w-4 h-4 text-accent" />
            <span>Settings</span>
          </button>
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-background-card text-content-primary hover:bg-background-cardHover border border-border-subtle text-sm font-medium transition-colors"
          >
            <LogIn className="w-4 h-4 text-accent" />
            <span>Sign In</span>
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-accent text-background-primary hover:bg-accent-hover text-sm font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
