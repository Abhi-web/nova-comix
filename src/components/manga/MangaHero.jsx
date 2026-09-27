import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bookmark, Check, Share2, Star } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { formatRating } from "../../utils/helpers";

/**
 * MangaHero Component for NOVA PANEL
 * Cinematic story hero section with backdrop blur, cover art, title, metadata, and action buttons.
 */
export default function MangaHero({
  manga,
  latestChapterId,
  isBookmarked,
  onToggleLibrary,
}) {
  const [copied, setCopied] = useState(false);

  if (!manga) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: manga.title,
          text: `Check out ${manga.title} on NOVA PANEL`,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or unsupported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const status = manga.status || "Ongoing";
  const type = manga.type || "Manga";
  const altTitles = Array.isArray(manga.alternativeTitles) && manga.alternativeTitles.length > 0
    ? manga.alternativeTitles.slice(0, 3).join(" • ")
    : null;

  const readTarget = latestChapterId || `${manga.id}-ch-${manga.latestChapter || 1}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-background-card/60 backdrop-blur-xl border border-border-subtle p-6 sm:p-8 lg:p-10 mb-8 shadow-card">
      {/* Cinematic Layered Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <img
          src={manga.cover}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter blur-3xl scale-125 opacity-25"
        />
        <div className="absolute inset-0 bg-background-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-card via-background-card/70 to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10">
        {/* Cover Artwork Container */}
        <div className="w-52 sm:w-64 lg:w-72 shrink-0">
          <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-background-secondary group">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Top Overlay Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="accent" size="xs">
                {type}
              </Badge>
            </div>
            {manga.badge && (
              <div className="absolute top-3 right-3">
                <Badge variant="warning" size="xs">
                  {manga.badge}
                </Badge>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Story Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between text-center md:text-left">
          <div>
            {/* Badges / Rating Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
              <Badge
                variant={status.toLowerCase() === "completed" ? "info" : "success"}
                size="sm"
              >
                {status}
              </Badge>

              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold shadow-glow-accent/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{formatRating(manga.rating)}</span>
              </div>

              {manga.latestChapter && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-content-secondary">
                  Chapter {manga.latestChapter}
                </span>
              )}
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-primary tracking-tight leading-tight">
              {manga.title}
            </h1>

            {/* Alternative Titles */}
            {altTitles && (
              <p className="text-xs sm:text-sm text-content-muted mt-2 font-medium line-clamp-2">
                <span className="text-content-secondary font-semibold">Also known as: </span>
                {altTitles}
              </p>
            )}

            {/* Quick Metadata Snippet */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center md:justify-start gap-y-1 gap-x-3 text-xs text-content-secondary font-medium">
              <span>By <strong className="text-content-primary font-semibold">{manga.author || "Unknown"}</strong></span>
              <span>•</span>
              <span>Art by <strong className="text-content-primary font-semibold">{manga.artist || "Unknown"}</strong></span>
              {manga.releaseYear && (
                <>
                  <span>•</span>
                  <span>{manga.releaseYear}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3.5">
            {/* PRIMARY: READ NOW */}
            <Link to={`/read/${readTarget}`} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={<BookOpen className="w-5 h-5" />}
                className="w-full sm:w-auto font-bold tracking-wider shadow-glow-accent/30"
              >
                READ NOW
              </Button>
            </Link>

            {/* SECONDARY: ADD TO LIBRARY / IN LIBRARY */}
            <Button
              variant={isBookmarked ? "secondary" : "outline"}
              size="lg"
              icon={
                isBookmarked ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )
              }
              onClick={onToggleLibrary}
              className={`w-full sm:w-auto font-semibold transition-all ${
                isBookmarked
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
                  : ""
              }`}
              aria-label={isBookmarked ? "Remove from library" : "Add to library"}
            >
              {isBookmarked ? "✓ IN LIBRARY" : "+ ADD TO LIBRARY"}
            </Button>

            {/* OPTIONAL: SHARE */}
            <Button
              variant="ghost"
              size="lg"
              icon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
              className="text-content-secondary hover:text-content-primary relative"
              aria-label="Share this story"
            >
              {copied ? "Link Copied!" : "SHARE"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
