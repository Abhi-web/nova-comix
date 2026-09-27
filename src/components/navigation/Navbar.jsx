import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import SearchButton from "./SearchButton";
import ProfileButton from "./ProfileButton";
import SettingsButton from "./SettingsButton";
import SearchModal from "./SearchModal";

/**
 * Global Navbar Component for NOVA PANEL
 * Sticky responsive header with desktop links, search trigger, mobile drawer, and profile shortcuts.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Logo />
            <DesktopNavigation />
          </div>

          {/* Right: Search, Profile, Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <SearchButton
              onClick={() => setIsSearchOpen(true)}
              className="w-36 md:w-56"
            />

            {/* Settings Trigger */}
            <SettingsButton />

            {/* Profile Entry */}
            <ProfileButton />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl bg-background-card hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Drawer Menu */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
