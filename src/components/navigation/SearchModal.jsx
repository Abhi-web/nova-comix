import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Star, ArrowRight } from "lucide-react";
import { mangaService } from "../../services/mangaService";
import { formatRating } from "../../utils/helpers";

/**
 * Global SearchModal Component for NOVA PANEL
 * Instant search across titles, genres, and authors with keyboard navigation.
 */
export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Derive search results directly
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return mangaService.search(query).slice(0, 6);
  }, [query]);

  // Keyboard navigation & dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    handleClose();
    navigate(`/manga/${id}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search stories modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-background-secondary/95 backdrop-blur-2xl border border-border-card shadow-modal overflow-hidden z-10 animate-scaleIn">
        {/* Subtle Top Accent Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-accent/20 blur-xl pointer-events-none rounded-full" />

        {/* Input Bar */}
        <div className="flex items-center px-4 sm:px-5 py-3.5 border-b border-border-subtle bg-background-card/40">
          <Search className="w-5 h-5 text-accent shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, author..."
            className="w-full bg-transparent text-sm font-medium text-content-primary placeholder:text-content-muted focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-content-muted hover:text-content-primary hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-background-card border border-border-subtle text-[10px] font-mono text-content-muted">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[380px] overflow-y-auto p-3">
          {query.trim() === "" ? (
            <div className="py-8 px-4 text-center">
              <p className="text-xs font-bold text-content-muted uppercase tracking-widest mb-3">
                Quick Discoveries
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Astral Gate", "Alchemist", "Action", "Cyberpunk", "Ongoing"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-background-elevated hover:bg-accent/15 text-content-secondary hover:text-accent border border-border-subtle hover:border-accent/40 transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1.5">
              {results.map((manga) => (
                <div
                  key={manga.id}
                  onClick={() => handleSelect(manga.id)}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-background-elevated/80 border border-transparent hover:border-border-subtle cursor-pointer transition-all duration-200 group"
                >
                  <img
                    src={manga.cover}
                    alt={manga.title}
                    className="w-10 h-14 rounded-lg object-cover shrink-0 bg-background-card border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {manga.type}
                      </span>
                      <span className="text-[10px] text-content-muted">•</span>
                      <span className="text-[10px] text-content-muted font-medium">
                        Ch. {manga.latestChapter}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-content-primary truncate group-hover:text-accent transition-colors tracking-tight">
                      {manga.title}
                    </h4>
                    <p className="text-xs text-content-muted truncate font-medium">
                      {manga.genres.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                    <Star className="w-3 h-3 fill-accent" />
                    <span>{formatRating(manga.rating)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-content-secondary font-medium">
              No matching stories found.
            </div>
          )}
        </div>

        {/* Footer info */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 border-t border-border-subtle bg-background-card/40 flex items-center justify-between text-xs text-content-muted">
            <span>Showing top {results.length} matches</span>
            <span className="flex items-center gap-1 text-accent font-semibold">
              Select story <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
