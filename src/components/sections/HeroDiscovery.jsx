import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, BookOpen, Compass, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../common/Button";
import { formatRating } from "../../utils/helpers";
import HeroPopularPanel from "./HeroPopularPanel";

/**
 * HeroDiscovery — Premium Cinematic Split Hero Slider for NOVA PANEL
 * 
 * Strict Dual Animation System Architecture:
 * - Alternating Slider Transitions:
 *   - Slide 1: Animation Type A (Cinematic Zoom + Crossfade)
 *   - Slide 2: Animation Type B (Directional Parallax Slide)
 *   - Slide 3: Animation Type A
 *   - Slide 4: Animation Type B
 *   - Strictly alternating (A -> B -> A -> B...)
 * 
 * Layout & Dimensions:
 * - Desktop: Split ~70% Featured Slider / ~30% Popular Ranking Panel
 * - Responsive: Full width on mobile, right panel moves below
 * - Stable dimensions: ZERO height jumping, ZERO reflow, ZERO layout shift
 * - Strict chapter terminology: "Chapter", "Ch.", "Read Now", "View Details"
 * - Layered cinematic gradients ensuring high readability and rich artwork visibility
 * - Touch swipe (mobile), keyboard (ArrowLeft/Right), autoplay (6s) with pause-on-hover
 */
export default function HeroDiscovery({
  stories = [],
  featuredStories = null,
  allStories = null,
  popularStories = null,
  story = null,
  className = "",
}) {
  // Normalize featured slides
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

  // Normalize popular catalog for right panel
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
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = next, -1 = prev
  const [currentAnimType, setCurrentAnimType] = useState("A"); // "A" or "B"
  const [isPaused, setIsPaused] = useState(false);
  const [failedBanners, setFailedBanners] = useState({});

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const transitionTimerRef = useRef(null);

  const totalSlides = slides.length;

  // Cleanup any pending transition timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  /**
   * Core transition handler with STRICT DUAL ANIMATION ALTERNATION:
   * Slide 1 (idx 0) -> Type A
   * Slide 2 (idx 1) -> Type B
   * Slide 3 (idx 2) -> Type A
   * Slide 4 (idx 3) -> Type B
   */
  const triggerTransition = useCallback(
    (targetIndex, direction = 1) => {
      if (totalSlides <= 1 || targetIndex === currentIndex) return;

      // Determine animation type based on target slide index
      const animType = targetIndex % 2 === 0 ? "A" : "B";

      setPrevIndex(currentIndex);
      setCurrentIndex(targetIndex);
      setSlideDirection(direction);
      setCurrentAnimType(animType);
      setIsTransitioning(true);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      // Transition animation completes in 750ms
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
    },
    [currentIndex, totalSlides]
  );

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    const nextIdx = (currentIndex + 1) % totalSlides;
    triggerTransition(nextIdx, 1);
  }, [currentIndex, totalSlides, triggerTransition]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    const prevIdx = (currentIndex - 1 + totalSlides) % totalSlides;
    triggerTransition(prevIdx, -1);
  }, [currentIndex, totalSlides, triggerTransition]);

  const goToSlide = (idx) => {
    if (idx === currentIndex) return;
    const dir = idx > currentIndex ? 1 : -1;
    triggerTransition(idx, dir);
  };

  // 1. Autoplay: 6 seconds interval, paused on hover
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
      if (
        ["input", "textarea", "select"].includes(
          document.activeElement?.tagName?.toLowerCase()
        )
      ) {
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

  // 4. Touch / Swipe Support for Mobile (without interfering with vertical scrolling)
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

  // Helper for slide artwork priority: 1. Banner -> 2. Hero -> 3. Cover -> 4. Dark fallback
  const getSlideArtwork = (slide, index) => {
    if (!slide) return null;
    const id = slide._id || slide.id || index;
    if (failedBanners[id]) {
      return slide.coverImage || slide.cover || null;
    }
    return (
      slide.bannerImage ||
      slide.heroArtwork ||
      slide.coverImage ||
      slide.cover ||
      null
    );
  };

  // Loading skeleton state
  if (totalSlides === 0) {
    return (
      <div
        className={`w-full flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-[500px] md:h-[530px] lg:h-[570px] xl:h-[620px] animate-pulse ${className}`}
      >
        <div className="w-full md:w-[65%] lg:w-[70%] h-full rounded-3xl bg-background-secondary border border-border-card p-8 flex items-end">
          <div className="space-y-4 max-w-lg w-full">
            <div className="w-28 h-6 rounded-full bg-background-card" />
            <div className="w-3/4 h-10 rounded-xl bg-background-card" />
            <div className="w-full h-16 rounded-xl bg-background-card" />
          </div>
        </div>
        <div className="w-full md:w-[35%] lg:w-[30%] h-full rounded-3xl bg-background-secondary border border-border-card" />
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const storyId = currentSlide._id || currentSlide.id || currentSlide.slug || "featured";
  const genres =
    Array.isArray(currentSlide.genres) && currentSlide.genres.length > 0
      ? currentSlide.genres
      : ["Action", "Fantasy"];

  return (
    <section
      aria-label="Hero Spotlight and Popular Series"
      className={`relative w-full flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 md:h-[530px] lg:h-[570px] xl:h-[620px] items-stretch select-none ${className}`}
    >
      {/* ==============================================================
          LEFT: CINEMATIC FEATURED CONTENT SLIDER (~70% Desktop, ~65% Tablet)
          ============================================================== */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured Story Showcase"
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative w-full md:w-[65%] lg:w-[70%] h-[490px] sm:h-[530px] md:h-full shrink-0 rounded-3xl overflow-hidden bg-[#07090D] border border-border-subtle shadow-2xl flex flex-col justify-between p-6 sm:p-9 lg:p-11 focus:outline-none focus:ring-1 focus:ring-accent/40"
      >
        {/* ==============================================================
            BACKGROUND ARTWORK & LAYERED CINEMATIC OVERLAYS
            Layer 1: Background image
            Layer 2: Cinematic dark overlay
            Layer 3: Left gradient
            Layer 4: Bottom gradient
            Layer 5: Ambient accent glow
            ============================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentIndex;
            const isPrevious = isTransitioning && idx === prevIndex;

            // Only render slides involved in current state or transition
            if (!isCurrent && !isPrevious) return null;

            const imgUrl = getSlideArtwork(slide, idx);
            const slideId = slide._id || slide.id || idx;

            // Compute precise animation class based on active animation type
            let animClass = "";
            if (isTransitioning) {
              if (isPrevious) {
                // Exit animation
                if (currentAnimType === "A") {
                  animClass = "hero-exit-a";
                } else {
                  animClass =
                    slideDirection > 0
                      ? "hero-exit-b-next"
                      : "hero-exit-b-prev";
                }
              } else if (isCurrent) {
                // Enter animation
                if (currentAnimType === "A") {
                  animClass = "hero-enter-a";
                } else {
                  animClass =
                    slideDirection > 0
                      ? "hero-enter-b-next"
                      : "hero-enter-b-prev";
                }
              }
            } else if (isCurrent) {
              // Idle state: Type A continues slow Ken-Burns subtle zoom
              animClass =
                currentAnimType === "A" ? "hero-kenburns" : "scale-100";
            }

            return (
              <div
                key={slideId}
                aria-hidden={!isCurrent}
                className={`absolute inset-0 ${
                  isCurrent ? "z-10" : "z-0"
                }`}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt=""
                    onError={() => handleImageError(slideId)}
                    className={`w-full h-full object-cover object-center ${animClass}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  /* Elegant dark cinematic fallback texture */
                  <div className="w-full h-full bg-gradient-to-br from-[#0D1016] via-[#131720] to-[#07090D]" />
                )}
              </div>
            );
          })}

          {/* Layer 2: Cinematic dark overall overlay */}
          <div className="absolute inset-0 bg-[#07090D]/40 pointer-events-none z-20" />

          {/* Layer 3: Left-to-right gradient ensuring exceptional text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090D] via-[#07090D]/90 to-transparent w-full md:w-[75%] lg:w-[65%] pointer-events-none z-20" />

          {/* Layer 4: Bottom gradient fading into controls */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#07090D] via-[#07090D]/80 to-transparent pointer-events-none z-20" />

          {/* Top subtle vignette */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#07090D]/70 via-transparent to-transparent pointer-events-none z-20" />

          {/* Ambient Warm Gold Accent Glow */}
          <div
            className="absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-accent/[0.08] blur-[120px] pointer-events-none z-20"
            aria-hidden="true"
          />
        </div>

        {/* ==============================================================
            LAYER 5: EDITORIAL HERO CONTENT
            Animates with Dual Slider Animation System:
            - Animation Type A: Content opacity 0 + translateY(12px) -> translateY(0)
            - Animation Type B: Directional parallax slide with distinct speed
            ============================================================== */}
        <div
          key={currentIndex}
          aria-live="polite"
          className={`relative z-30 flex-1 flex flex-col justify-center max-w-2xl space-y-3.5 sm:space-y-4 lg:space-y-5 ${
            currentAnimType === "A"
              ? "hero-content-a"
              : slideDirection > 0
              ? "hero-content-b-next"
              : "hero-content-b-prev"
          }`}
        >
          {/* Badges Row: Featured Badge / Type / Status / Counter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/35 text-accent text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-glow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              FEATURED SERIES #{currentIndex + 1}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {currentSlide.type || "MANHWA"} • {currentSlide.status || "ONGOING"}
            </span>

            {totalSlides > 1 && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono font-bold text-content-secondary tracking-wider backdrop-blur-sm hidden sm:inline">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(totalSlides).padStart(2, "0")}
              </span>
            )}
          </div>

          {/* Large Title */}
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-content-primary tracking-tight leading-[1.12] text-balance">
            {currentSlide.title}
          </h1>

          {/* Metadata Row: Rating, Genres, Chapter Information */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
            {/* Rating */}
            {currentSlide.rating && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-accent font-bold backdrop-blur-sm shadow-sm">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span>★ {formatRating(currentSlide.rating)}</span>
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

            {/* SECONDARY: VIEW DETAILS */}
            <Link to={`/manga/${storyId}`}>
              <Button
                variant="secondary"
                size="md"
                icon={<Compass className="w-4 h-4 text-accent" />}
                className="font-semibold tracking-wider uppercase px-5 sm:px-6 hover:border-accent/40"
              >
                VIEW DETAILS
              </Button>
            </Link>
          </div>
        </div>

        {/* ==============================================================
            LAYER 6: BOTTOM CONTROLS & SLIDE INDICATORS
            Slide Indicators: ● ━━━ ○ ○ ○
            ============================================================== */}
        <div className="relative z-30 pt-4 flex items-center justify-between">
          {/* Slide Indicators: ● ━━━ ○ ○ ○ */}
          <div
            role="tablist"
            aria-label="Featured Story Slider Indicators"
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
                      ? "w-8 sm:w-11 h-2 bg-accent shadow-glow-accent/50"
                      : "w-2 h-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          {/* Circular Dark Translucent Manual Controls */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-accent/40 text-content-secondary hover:text-accent backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-accent/40 text-content-secondary hover:text-accent backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          RIGHT: DEDICATED POPULAR SERIES RANKING PANEL (~30% Desktop, ~35% Tablet)
          ============================================================== */}
      <HeroPopularPanel
        stories={popularCatalog}
        className="w-full md:w-[35%] lg:w-[30%] h-[470px] md:h-full shrink-0"
      />
    </section>
  );
}
