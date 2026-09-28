import React, { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  Compass,
  Library,
  Grid,
  Trophy,
  Sparkles,
  Bookmark,
  Clock,
  Sliders,
  Shield,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { getLibrary } from "../../utils/storage";

/**
 * LeftSidebar — Cinematic Navigation Sidebar for NOVA PANEL
 * 
 * Features:
 * - Hidden by default, toggled via top-left hamburger menu
 * - Smooth desktop transition: smoothly docks/collapses (w-0 to w-64)
 * - Keeps main content full-width when hidden
 * - Mobile: Functions as a smooth sliding overlay drawer with backdrop
 * - Syncs live bookmarks count and active route indicators
 * - Close button in header + closes on Escape key
 */
export default function LeftSidebar({
  isOpen = false,
  onClose = () => {},
  className = "",
}) {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { openSettings } = useSettings();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // Sync real bookmark count from client storage
  useEffect(() => {
    const updateCount = () => {
      const list = getLibrary();
      setBookmarkCount(Array.isArray(list) ? list.length : 0);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, [location.pathname]);

  // Lock body scroll on mobile when overlay drawer is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Primary navigation entries mapping strictly to real routes
  const mainNavItems = [
    {
      to: "/",
      label: "Discover",
      icon: Compass,
      end: true,
      description: "Spotlight & Curated Feeds",
    },
    {
      to: "/manga",
      label: "Catalog",
      icon: Library,
      end: true,
      description: "Full Manga & Webtoon Archive",
    },
    {
      to: "/manga?sort=latest_updated",
      label: "Latest",
      icon: Sparkles,
      end: false,
      badge: "NEW",
      matchQuery: "latest_updated",
      description: "Fresh serialization chapters",
    },
    {
      to: "/genres",
      label: "Genres",
      icon: Grid,
      end: false,
      description: "12 Curated Disciplines",
    },
    {
      to: "/rankings",
      label: "Rankings",
      icon: Trophy,
      end: false,
      badge: "TOP",
      description: "Popularity Leaderboards",
    },
  ];

  // Shared sidebar inner content
  const renderSidebarBody = (isMobile = false) => (
    <div className="w-full h-full flex flex-col justify-between bg-[#0D1016]">
      {/* Header: Brand + Close Button */}
      <div className="h-16 shrink-0 px-4 sm:px-5 flex items-center justify-between border-b border-border-subtle/80">
        <Link
          to="/"
          onClick={() => {
            if (isMobile) onClose();
          }}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/35 flex items-center justify-center text-accent shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
            <span className="font-black text-sm tracking-wider">NP</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-content-primary">
                NOVA<span className="text-accent">PANEL</span>
              </span>
            </div>
            <span className="text-[10px] text-content-muted tracking-widest uppercase font-semibold block">
              Digital Archives
            </span>
          </div>
        </Link>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar navigation"
          title="Close sidebar"
          className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-white/5 border border-transparent hover:border-border-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-5 px-3.5 space-y-6">
        {/* Core Discovery Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-content-muted">
            Explore
          </div>
          <nav className="space-y-1.5" aria-label="Main Discovery Routes">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isMatch = item.matchQuery
                ? location.pathname === "/manga" && location.search.includes(item.matchQuery)
                : item.end
                ? location.pathname === item.to && !location.search.includes("latest_updated")
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  onClick={() => {
                    if (isMobile) onClose();
                  }}
                  className={`group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isMatch
                      ? "bg-accent/15 text-accent border border-accent/35 shadow-glow-sm"
                      : "text-content-secondary hover:text-content-primary hover:bg-[#131720] border border-transparent"
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isMatch && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-accent shadow-glow-accent"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isMatch ? "text-accent fill-accent/20" : "text-content-muted group-hover:text-content-primary"
                    }`}
                  />

                  {/* Label */}
                  <span className="truncate font-semibold">{item.label}</span>

                  {/* Optional Badge */}
                  {item.badge && (
                    <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-accent/20 text-accent border border-accent/30 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Library / Collection Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-content-muted">
            My Reading
          </div>
          <nav className="space-y-1.5" aria-label="Library Routes">
            <Link
              to="/manga"
              title="Bookmarks & Saved Titles"
              onClick={() => {
                if (isMobile) onClose();
              }}
              className="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary hover:bg-[#131720] border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Bookmark className="w-4 h-4 shrink-0 text-content-muted group-hover:text-accent group-hover:scale-110 transition-all duration-200" />
              <span className="truncate">Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                  {bookmarkCount}
                </span>
              )}
            </Link>

            <Link
              to="/manga?sort=latest_updated"
              title="Recent Serialization Releases"
              onClick={() => {
                if (isMobile) onClose();
              }}
              className="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-primary hover:bg-[#131720] border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Clock className="w-4 h-4 shrink-0 text-content-muted group-hover:text-accent group-hover:scale-110 transition-all duration-200" />
              <span className="truncate">Recent Chapters</span>
            </Link>
          </nav>
        </div>

        {/* Admin Shortcut if authenticated as Administrator */}
        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-content-muted">
              Management
            </div>
            <Link
              to="/admin"
              title="Open Admin Console"
              onClick={() => {
                if (isMobile) onClose();
              }}
              className="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-content-secondary hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-all duration-200"
            >
              <Shield className="w-4 h-4 shrink-0 text-accent" />
              <span className="truncate font-bold text-accent">Admin Console</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Controls / Settings */}
      <div className="shrink-0 p-3.5 border-t border-border-subtle/80 bg-[#07090D]/50">
        <button
          type="button"
          onClick={() => {
            if (isMobile) onClose();
            openSettings();
          }}
          title="Reader & Display Preferences"
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#131720] hover:bg-[#171C25] border border-border-card text-content-secondary hover:text-content-primary text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-accent shrink-0" />
            <span>Preferences</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-content-muted" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP DOCKED SIDEBAR (Hidden by default, smooth width/opacity transition) */}
      <aside
        aria-label="Primary Navigation Sidebar"
        aria-hidden={!isOpen}
        className={`hidden md:flex flex-col shrink-0 transition-[width,opacity] duration-300 ease-in-out overflow-hidden sticky top-0 h-screen z-30 select-none ${
          isOpen
            ? "w-64 border-r border-border-subtle opacity-100"
            : "w-0 border-r-0 opacity-0 pointer-events-none"
        } ${className}`}
      >
        <div className="w-64 h-full flex flex-col shrink-0">
          {renderSidebarBody(false)}
        </div>
      </aside>

      {/* 2. MOBILE OVERLAY DRAWER (Slide-in drawer with darkened backdrop) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Darkened Backdrop */}
        <div
          onClick={onClose}
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Sliding Drawer Container */}
        <div
          className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r border-border-subtle shadow-2xl transition-transform duration-300 ease-in-out z-10 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarBody(true)}
        </div>
      </div>
    </>
  );
}
