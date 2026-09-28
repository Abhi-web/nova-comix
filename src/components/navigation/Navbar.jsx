import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import SearchButton from "./SearchButton";
import ProfileButton from "./ProfileButton";
import SettingsButton from "./SettingsButton";
import SearchModal from "./SearchModal";

/**
 * Global Navbar Component for NOVA PANEL
 * Sticky responsive header with top-left hamburger toggle for the sidebar,
 * desktop navigation pills, global search trigger, settings, and profile shortcuts.
 */
export default function Navbar({
  isSidebarOpen = false,
  onToggleSidebar = () => {},
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K / slash)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-background-header backdrop-blur-xl border-border-subtle shadow-header"
            : "bg-background-primary/80 backdrop-blur-md border-border-subtle/50"
        }`}
      >
        <div className="w-full px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Top-Left Hamburger Toggle Button + Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Top-Left Hamburger Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar navigation" : "Open sidebar navigation"}
              title={isSidebarOpen ? "Close sidebar (Esc)" : "Open sidebar"}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-background-card/80 hover:bg-background-cardHover text-content-secondary hover:text-accent border border-border-subtle hover:border-accent/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0 group shadow-sm active:scale-95"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-accent transition-transform duration-200 group-hover:scale-110" />
              ) : (
                <Menu className="w-5 h-5 text-content-secondary group-hover:text-accent transition-transform duration-200 group-hover:scale-110" />
              )}
            </button>

            <Logo />

            <div className="hidden lg:block ml-2">
              <DesktopNavigation />
            </div>
          </div>

          {/* Right: Search, Settings, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <SearchButton
              onClick={() => setIsSearchOpen(true)}
              className="w-32 sm:w-44 md:w-56"
            />

            {/* Settings Trigger */}
            <SettingsButton />

            {/* Profile Entry */}
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
