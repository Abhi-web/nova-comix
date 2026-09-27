import { Link } from "react-router-dom";

/**
 * GenreList Component for Manga Details
 * Displays clickable genre badges navigating to /manga?genre=slug
 */
export default function GenreList({ genres = [], className = "" }) {
  if (!genres || genres.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      aria-label="Story genres"
    >
      {genres.map((genre) => {
        const slug = genre.toLowerCase().trim();
        return (
          <Link
            key={genre}
            to={`/manga?genre=${encodeURIComponent(slug)}`}
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          >
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-lg bg-background-card border border-border-subtle text-content-secondary group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/5 transition-all duration-200">
              {genre}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
