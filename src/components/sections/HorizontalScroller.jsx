import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * HorizontalScroller Component for NOVA PANEL
 * Enables smooth, touch-friendly, keyboard-accessible horizontal scrolling with navigation arrows.
 */
export default function HorizontalScroller({
  children,
  className = "",
  itemClassName = "",
  gap = "gap-4",
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    window.addEventListener("resize", checkScroll);
    el.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      el.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, children]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Scroll Controls (Desktop visible on hover) */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background-card/90 hover:bg-background-card text-content-primary border border-border-subtle hover:border-accent shadow-card flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent opacity-0 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5 text-accent" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background-card/90 hover:bg-background-card text-content-primary border border-border-subtle hover:border-accent shadow-card flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent opacity-0 group-hover:opacity-100 hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5 text-accent" />
        </button>
      )}

      {/* Horizontal Container */}
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 ${gap} ${itemClassName}`}
        tabIndex={0}
        role="region"
        aria-label="Horizontal scrollable content"
      >
        {children}
      </div>
    </div>
  );
}
