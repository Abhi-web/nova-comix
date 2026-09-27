import React from "react";
import { Link } from "react-router-dom";
import { Compass, BookOpen } from "lucide-react";
import Button from "../common/Button";

/**
 * FinalCta Component for NOVA PANEL
 * Premium bottom call-to-action before the footer.
 */
export default function FinalCta({ className = "" }) {
  return (
    <section
      aria-label="Discovery Call to Action"
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-background-card/90 to-background-secondary border border-border-card p-8 sm:p-14 lg:p-16 text-center shadow-2xl ${className}`}
    >
      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/[0.07] blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest shadow-glow-sm">
          <BookOpen className="w-3.5 h-3.5 text-accent" />
          <span>EXPAND YOUR READING LIST</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-primary tracking-tight leading-tight">
          Find your next story.
        </h2>

        <p className="text-sm sm:text-base text-content-secondary max-w-lg mx-auto leading-relaxed font-normal">
          Explore thousands of fictional worlds, rich sequential art, and epic adventures.
        </p>

        <div className="pt-2 flex justify-center">
          <Link to="/manga">
            <Button
              variant="primary"
              size="lg"
              icon={<Compass className="w-4 h-4" />}
              className="font-bold tracking-wider uppercase px-8 shadow-glow-sm hover:shadow-glow-accent"
            >
              EXPLORE LIBRARY
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
