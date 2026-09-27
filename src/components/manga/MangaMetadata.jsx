import React from "react";
import { formatRating } from "../../utils/helpers";
import Badge from "../common/Badge";

/**
 * MangaMetadata Component
 * Displays compact story metadata panel (Type, Status, Release Date, Author, Artist, Rating)
 */
export default function MangaMetadata({ manga, className = "" }) {
  if (!manga) return null;

  const author = manga.author?.trim() || "Unknown";
  const artist = manga.artist?.trim() || "Unknown";
  const releaseYear = manga.releaseYear || (manga.createdAt ? new Date(manga.createdAt).getFullYear() : "Unknown");
  const type = manga.type || "Manga";
  const status = manga.status || "Ongoing";

  const items = [
    {
      label: "Type",
      value: (
        <span className="font-semibold text-content-primary">
          {type}
        </span>
      ),
    },
    {
      label: "Status",
      value: (
        <Badge
          variant={status.toLowerCase() === "completed" ? "info" : "success"}
          size="xs"
        >
          {status}
        </Badge>
      ),
    },
    {
      label: "Release Year",
      value: <span className="text-content-secondary font-medium">{releaseYear}</span>,
    },
    {
      label: "Rating",
      value: (
        <span className="font-bold text-accent">
          ★ {formatRating(manga.rating)} <span className="text-xs font-normal text-content-muted">/ 10</span>
        </span>
      ),
    },
    {
      label: "Author",
      value: <span className="text-content-primary font-medium">{author}</span>,
    },
    {
      label: "Artist",
      value: <span className="text-content-primary font-medium">{artist}</span>,
    },
  ];

  return (
    <div
      className={`rounded-2xl bg-background-card/75 border border-border-subtle p-5 backdrop-blur-sm shadow-card ${className}`}
      aria-label="Story technical metadata"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border-subtle/50">
        {items.map((item, idx) => (
          <div
            key={item.label}
            className={`flex flex-col justify-center ${
              idx > 0 ? "pt-3 sm:pt-0 sm:pl-4" : ""
            }`}
          >
            <span className="text-[11px] font-bold text-content-muted uppercase tracking-wider mb-1.5">
              {item.label}
            </span>
            <div className="text-sm flex items-center min-h-[24px]">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
