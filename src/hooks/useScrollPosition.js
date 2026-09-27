import { useState, useEffect } from "react";

/**
 * Custom hook to track window scroll position
 * @returns {{ scrollY: number, scrollX: number, isScrolled: boolean }}
 */
export function useScrollPosition(threshold = 10) {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollX: 0,
    isScrolled: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        isScrolled: window.scrollY > threshold,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrollPosition;
}
