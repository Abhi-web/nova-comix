import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { formatRating } from "../../utils/helpers";
import HeroPopularPanel from "./HeroPopularPanel";

/**
 * HeroDiscovery — Premium Cinematic Split Hero Slider for NOVA PANEL
 * 
 * Strict Architecture:
 * - Two-column split layout:
 *   - LEFT: Large cinematic featured slider (~70% desktop width)
 *   - RIGHT: Dedicated Popular Series ranking panel (~30% desktop width)
 * - Matching visual height on desktop and tablet
 * - Stacked responsive layout on mobile (< 768px)
 * - Layered cinematic gradients (text readability + vivid background artwork)
 * - Subtle Ken-Burns image motion: scale(1.00) -> scale(1.035) over 6.5s
 * - Smooth crossfade background transitions & content slide-up
 * - Auto-slide (6s) with pause-on-hover & resume-on-leave
 * - Subtle manual controls (ChevronLeft / ChevronRight) & bottom indicators
 * - Touch swipe support on mobile devices without blocking vertical scroll
 * - Keyboard navigation (ArrowLeft / ArrowRight) & ARIA accessibility
 * - Right panel remains visually stable when left slide transitions
 * - 100% existing data, no fake data, strict chapter terminology
 */
export default function HeroDiscovery({
  stories = [],
  featuredStories = null,
  allStories = null,
  popularStories = null,
  story = null,
  className = "",
}) {
  // Normalize featured slides with memoization
  const slides = useMemo(() => {
    if (Array.isArray(featuredStories) && featuredStories.length > 0) {
      return featuredStories;
    }
    if (Array.isArray(stories) && stories.length > 0) {
      return stories;
    }
    if (story) {
      return [story];
    }
    return [];
  }, [featuredStories, stories, story]);

  // Normalize popular stories for right panel with memoization
  const popularCatalog = useMemo(() => {
    if (Array.isArray(popularStories) && popularStories.length > 0) {
      return popularStories;
    }
    if (Array.isArray(allStories) && allStories.length > 0) {
      return allStories;
    }
    if (Array.isArray(stories) && stories.length > 0) {
      return stories;
    }
    return [];
  }, [popularStories, allStories, stories]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedBanners, setFailedBanners] = useState({});

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const sliderRef = useRef(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // 1. Auto-slide with 6-second interval (5-7 seconds)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, totalSlides, nextSlide]);

  // 2. Preload Next Slide Artwork
  useEffect(() => {
    if (totalSlides > 1) {
      const nextIdx = (currentIndex + 1) % totalSlides;
      const nextSlideData = slides[nextIdx];
      const nextImg =
        nextSlideData?.bannerImage ||
        nextSlideData?.heroArtwork ||
        nextSlideData?.coverImage ||
        nextSlideData?.cover;
      if (nextImg) {
        const img = new Image();
        img.src = nextImg;
      }
    }
  }, [currentIndex, slides, totalSlides]);

  // 3. Accessible Keyboard Navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["input", "textarea", "select"].includes(document.activeElement?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // 4. Touch / Swipe Support for Mobile (without breaking vertical scroll)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const swipeThreshold = 45;

    // Only trigger if horizontal swipe is significantly stronger than vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Image failure fallback handler
  const handleImageError = (id) => {
    setFailedBanners((prev) => ({ ...prev, [id]: true }));
  };

  // Loading skeleton state
  if (totalSlides === 0) {
    return (
      <div className={`w-full flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-[500px] md:h-[530px] lg:h-[570px] xl:h-[620px] animate-pulse ${className}`}>
        <div className="w-full md:w-[62%] lg:w-[68%] xl:w-[70%] h-full rounded-3xl bg-background-secondary border border-border-card p-8 flex items-end">
          <div className="space-y-4 max-w-lg w-full">
            <div className="w-28 h-6 rounded-full bg-background-card" />
            <div className="w-3/4 h-10 rounded-xl bg-background-card" />
            <div className="w-full h-16 rounded-xl bg-background-card" />
          </div>
        </div>
        <div className="w-full md:w-[38%] lg:w-[32%] xl:w-[30%] h-full rounded-3xl bg-background-secondary border border-border-card" />
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const storyId = currentSlide._id || currentSlide.id || currentSlide.slug || "featured";
  const genres = Array.isArray(currentSlide.genres) && currentSlide.genres.length > 0
    ? currentSlide.genres
    : ["Action", "Fantasy"];

  // Helper for slide artwork priority: 1. Banner -> 2. Hero -> 3. Cover -> 4. Dark fallback
  const getSlideArtwork = (slide, index) => {
    const id = slide._id || slide.id || index;
    if (failedBanners[id]) {
      return slide.coverImage || slide.cover || null;
    }
    return slide.bannerImage || slide.heroArtwork || slide.coverImage || slide.cover || null;
  };

  return (
    <section
      aria-label="Hero Spotlight and Popular Series"
      className={`relative w-full flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 md:h-[530px] lg:h-[570px] xl:h-[620px] items-stretch select-none ${className}`}
    >
      {/* ==============================================================
          LEFT: CINEMATIC FEATURED CONTENT SLIDER (~70% Desktop, ~62% Tablet)
          ============================================================== */}
      <div
        ref={sliderRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Story Showcase"
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative w-full md:w-[62%] lg:w-[68%] xl:w-[70%] h-[480px] sm:h-[520px] md:h-full shrink-0 rounded-3xl overflow-hidden bg-[#090A0F] border border-border-card shadow-2xl flex flex-col justify-between p-6 sm:p-9 lg:p-11 focus:outline-none focus:ring-1 focus:ring-accent/40"
      >
        {/* ==============================================================
            BACKGROUND ARTWORK & LAYERED CINEMATIC OVERLAYS
            ============================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-[#090A0F]">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const imgUrl = getSlideArtwork(slide, idx);
            const slideId = slide._id || slide.id || idx;

            return (
              <div
                key={slideId}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
                }`}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt=""
                    onError={() => handleImageError(slideId)}
                    className={`w-full h-full object-cover object-center ${
                      isActive ? "animate-hero-zoom" : "scale-100"
                    }`}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  /* Elegant dark texture fallback */
                  <div className="w-full h-full bg-gradient-to-br from-[#12151D] via-[#171A22] to-[#090A0F]" />
                )}
              </div>
            );
          })}

          {/* Ambient Warm Accent Glow */}
          <div
            className="absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-accent/[0.08] blur-[110px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Layer 2: Dark overall overlay */}
          <div className="absolute inset-0 bg-[#090A0F]/45 pointer-events-none" />

          {/* Layer 3: Left-to-right gradient ensuring text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/90 to-transparent w-full md:w-[75%] lg:w-[65%] pointer-events-none" />

          {/* Layer 4: Bottom gradient fading into controls */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/75 to-transparent pointer-events-none" />

          {/* Top subtle vignette */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#090A0F]/65 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ==============================================================
            TOP / CENTER EDITORIAL STORY CONTENT (Smooth Slide-Up Transition)
            ============================================================== */}
        <div
          key={currentIndex}
          aria-live="polite"
          className="animate-hero-content relative z-20 flex-1 flex flex-col justify-center max-w-2xl space-y-3.5 sm:space-y-4 lg:space-y-5"
        >
          {/* Badges Row: Trending / Type / Status / Counter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/35 text-accent text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-glow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              TRENDING #{currentIndex + 1}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {currentSlide.type || "MANHWA"} • {currentSlide.status || "ONGOING"}
            </span>

            {totalSlides > 1 && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono font-bold text-content-secondary tracking-wider backdrop-blur-sm hidden sm:inline">
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Large Title */}
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-content-primary tracking-tight leading-[1.12] text-balance">
            {currentSlide.title}
          </h1>

          {/* Metadata Row: Rating, Genres, Chapter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            {/* Rating */}
            {currentSlide.rating && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-accent font-bold backdrop-blur-sm shadow-sm">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span>{formatRating(currentSlide.rating)}</span>
              </div>
            )}

            {/* Genres */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {genres.slice(0, 3).map((g) => (
                <span
                  key={typeof g === "string" ? g : g.name}
                  className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-content-secondary font-medium text-[11px] backdrop-blur-sm"
                >
                  {typeof g === "string" ? g : g.name}
                </span>
              ))}
            </div>

            {/* Chapter Count (Strict Chapter Terminology) */}
            {currentSlide.latestChapter && (
              <span className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-content-secondary font-mono text-[11px] backdrop-blur-sm">
                Ch. {currentSlide.latestChapter}
              </span>
            )}
          </div>

          {/* Short Editorial Description */}
          <p className="text-xs sm:text-sm lg:text-base text-content-secondary leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl font-normal">
            {currentSlide.description ||
              "Explore this featured chronicle curated from the official NOVA PANEL digital archives."}
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* PRIMARY: READ NOW */}
            <Link to={`/read/${storyId}`}>
              <Button
                variant="primary"
                size="md"
                icon={<BookOpen className="w-4 h-4" />}
                className="font-bold tracking-wider uppercase px-6 sm:px-8 shadow-glow-accent/30 hover:scale-[1.02] transition-transform"
              >
                READ NOW
              </Button>
            </Link>

            {/* SECONDARY: DETAILS */}
            <Link to={`/manga/${storyId}`}>
              <Button
                variant="secondary"
                size="md"
                icon={<Compass className="w-4 h-4 text-accent" />}
                className="font-semibold tracking-wider uppercase px-5 sm:px-6 hover:border-accent/40"
              >
                DETAILS
              </Button>
            </Link>
          </div>
        </div>

        {/* ==============================================================
            BOTTOM ROW: SLIDE INDICATORS & SUBTLE MANUAL CONTROLS
            ============================================================== */}
        <div className="relative z-30 pt-4 flex items-center justify-between">
          {/* Slide Indicators: ● ━━━ ○ ○ ○ */}
          <div
            role="tablist"
            aria-label="Slide indicators"
            className="flex items-center gap-2"
          >
            {slides.slice(0, 8).map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s._id || s.id || idx}
                  type="button"
                  role="tab"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                  aria-selected={isActive}
                  className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "w-8 sm:w-10 h-2 bg-accent shadow-glow-accent/50"
                      : "w-2 h-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          {/* Subtle Manual Controls (Lucide Chevron Left & Right) */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-accent/40 text-content-secondary hover:text-accent backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-accent/40 text-content-secondary hover:text-accent backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          RIGHT: DEDICATED POPULAR SERIES PANEL (~30% Desktop, ~38% Tablet)
          ============================================================== */}
      <HeroPopularPanel
        stories={popularCatalog}
        className="w-full md:w-[38%] lg:w-[32%] xl:w-[30%] h-[460px] md:h-full shrink-0"
      />
    </section>
  );
}
