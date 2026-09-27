import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "./Footer";

/**
 * Main Application Shell Layout
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-content-primary selection:bg-accent/20 selection:text-accent relative isolate">
      {/* Cinematic Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-accent/[0.03] blur-[140px] pointer-events-none -z-10 rounded-full" />

      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
