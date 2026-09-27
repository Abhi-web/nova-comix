import React from "react";
import { useSearchParams } from "react-router-dom";
import { mangaService } from "../services/mangaService";
import MangaCard from "../components/cards/MangaCard";
import EmptyState from "../components/common/EmptyState";
import { Layers } from "lucide-react";

/**
 * GenresPage (/genres) Component for NOVA PANEL
 * Explore stories classified by genres and world settings.
 */
export default function GenresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genres = mangaService.getGenres();
  
  // Directly derive active genre from URL search params
  const selectedGenre = searchParams.get("genre") || "all";

  const handleSelectGenre = (genreId) => {
    if (genreId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ genre: genreId });
    }
  };

  const activeGenreData = genres.find(
    (g) => g.name.toLowerCase() === selectedGenre.toLowerCase() || g.id === selectedGenre.toLowerCase()
  );

  const mangaList = mangaService.getByGenre(
    selectedGenre === "all" ? null : (activeGenreData?.name || selectedGenre)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-6 bg-accent rounded-full inline-block" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
            Genres & Categorization
          </h1>
        </div>
        <p className="text-sm text-content-secondary max-w-xl">
          Dive into specific themes, archetypes, and narrative disciplines curated within our archive.
        </p>
      </div>

      {/* Genre Pills Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => handleSelectGenre("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase shrink-0 transition-all duration-200 ${
            selectedGenre === "all"
              ? "bg-accent text-background-primary shadow-glow-accent/30 font-extrabold"
              : "bg-background-card/80 hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:scale-[1.02]"
          }`}
        >
          All Genres
        </button>

        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => handleSelectGenre(g.name.toLowerCase())}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 flex items-center gap-2 ${
              selectedGenre.toLowerCase() === g.name.toLowerCase() ||
              selectedGenre.toLowerCase() === g.id
                ? "bg-accent text-background-primary shadow-glow-accent/30 font-bold"
                : "bg-background-card/80 hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:scale-[1.02]"
            }`}
          >
            <span>{g.name}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                selectedGenre.toLowerCase() === g.name.toLowerCase()
                  ? "bg-black/25 text-background-primary"
                  : "bg-background-elevated text-accent"
              }`}
            >
              {g.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Genre Banner Info */}
      {activeGenreData && (
        <div className="p-6 rounded-2xl bg-background-card/85 backdrop-blur-sm border border-border-subtle shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-1.5 h-5 bg-accent rounded-full inline-block shadow-glow-accent/40" />
              <h2 className="text-lg font-bold text-content-primary">
                {activeGenreData.name} Discipline
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-content-secondary max-w-2xl leading-relaxed">
              {activeGenreData.description}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-accent shrink-0 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25">
            {mangaList.length} Archived Volumes
          </span>
        </div>
      )}

      {/* Manga Grid */}
      {mangaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {mangaList.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${selectedGenre} titles found`}
          description="We are constantly expanding the archive. New works in this genre will be indexed soon."
        />
      )}
    </div>
  );
}
