import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import LeftSidebar from "../components/navigation/LeftSidebar";
import Footer from "./Footer";

/**
 * Main Application Shell Layout for NOVA PANEL
 * 
 * Features:
 * - Left Navigation Sidebar is HIDDEN by default.
 * - Replaced with top-left hamburger menu.
 * - On desktop: smoothly slides open/closed, keeping main content full-width when hidden.
 * - On mobile: operates as an overlay drawer with a backdrop.
 * - Closes smoothly on navigation, clicking backdrop, or pressing Escape.
 */
export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar drawer on route navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname, location.search]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen flex bg-background-primary text-content-primary selection:bg-accent/20 selection:text-accent relative isolate overflow-x-hidden">
      {/* Cinematic Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[360px] bg-accent/[0.035] blur-[150px] pointer-events-none -z-10 rounded-full" />

      {/* Left Navigation Sidebar (Hidden by default, desktop docked slide + mobile overlay drawer) */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Core Content Canvas (Full-width on desktop when sidebar is hidden) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 w-full max-w-[1680px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
