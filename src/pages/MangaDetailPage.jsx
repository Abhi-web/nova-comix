import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { mangaService } from "../services/mangaService";
import { isInLibrary, toggleLibrary, getReadingProgress } from "../utils/storage";

// Subcomponents
import Breadcrumb from "../components/manga/Breadcrumb";
import MangaHero from "../components/manga/MangaHero";
import MangaMetadata from "../components/manga/MangaMetadata";
import StoryDescription from "../components/manga/StoryDescription";
import GenreList from "../components/manga/GenreList";
import MangaStats from "../components/manga/MangaStats";
import ContinueReading from "../components/manga/ContinueReading";
import ChapterList from "../components/manga/ChapterList";
import RelatedStories from "../components/manga/RelatedStories";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Skeleton from "../components/common/Skeleton";
import LoadingState from "../components/common/LoadingState";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";

/**
 * MangaDetailPage Component for NOVA PANEL
 * Dynamic route: /manga/:id
 * Implements full 11-step structure with live API data, localStorage library & reading progress.
 */
export default function MangaDetailPage() {
  const { id } = useParams();
  const [manga, setManga] = useState(() => mangaService.getById(id));
  const [chapters, setChapters] = useState(() => (manga ? mangaService.getChapters(manga.id) : []));
  const [loading, setLoading] = useState(!manga);
  const [error, setError] = useState(null);

  const loadStoryAndChapters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedManga = await mangaService.fetchById(id);
      if (fetchedManga) {
        setManga(fetchedManga);
        const fetchedChapters = await mangaService.fetchChapters(fetchedManga.id || id);
        setChapters(fetchedChapters);
      } else {
        setError("Unable to load data.");
      }
    } catch (err) {
      setError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStoryAndChapters();
  }, [loadStoryAndChapters]);

  // Library bookmark state tracked reactively
  const [libraryVersion, setLibraryVersion] = useState(0);
  const isBookmarked = useMemo(() => {
    return (libraryVersion >= 0 && manga?.id) ? isInLibrary(manga.id) : false;
  }, [manga, libraryVersion]);

  // Reading progress state tracked reactively
  const [progressVersion, setProgressVersion] = useState(0);
  const readingProgress = useMemo(() => {
    return (progressVersion >= 0 && manga?.id) ? getReadingProgress(manga.id) : null;
  }, [manga, progressVersion]);

  // Re-check reading progress if window regains focus (e.g. returning from reader)
  useEffect(() => {
    const handleFocus = () => {
      setProgressVersion((v) => v + 1);
      setLibraryVersion((v) => v + 1);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Target chapter for READ NOW (either current reading progress chapter or latest)
  const initialReadingTarget = useMemo(() => {
    if (readingProgress?.chapterId) {
      return readingProgress.chapterId;
    }
    return chapters[0]?.id || `${manga?.id}-ch-${manga?.latestChapter || 1}`;
  }, [readingProgress, chapters, manga]);

  // Handle Add to Library toggle
  const handleToggleLibrary = () => {
    if (!manga?.id) return;
    toggleLibrary(manga.id);
    setLibraryVersion((v) => v + 1);
  };

  if (loading && !manga) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading story archive..." />
      </div>
    );
  }

  if (error && !manga) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/20 bg-background-card text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-content-primary mb-1">Unable to load data.</h3>
        <p className="text-xs text-content-secondary mb-4">Could not retrieve story details from the server.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={loadStoryAndChapters}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  // Error State: Story not found
  if (!manga) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <EmptyState
          title="Story not found"
          description="The title you are searching for does not exist in our catalog or the link is invalid."
          action={
            <Link to="/manga">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Explore
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* 1. Breadcrumb: Home / Explore / Story Title */}
      <Breadcrumb title={manga.title} />

      {/* 2. Story Hero & 4. Action Buttons */}
      <MangaHero
        manga={manga}
        latestChapterId={initialReadingTarget}
        isBookmarked={isBookmarked}
        onToggleLibrary={handleToggleLibrary}
      />

      {/* 3. Story Metadata & 7. Author / Artist Information */}
      <MangaMetadata manga={manga} />

      {/* 5. Description */}
      <StoryDescription
        description={manga.description}
        synopsis={manga.synopsis}
      />

      {/* 6. Genres */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-content-muted mb-2.5">
          Genres & Themes
        </h3>
        <GenreList genres={manga.genres} />
      </div>

      {/* 8. Statistics */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-content-muted mb-2.5">
          Story Statistics
        </h3>
        <MangaStats manga={manga} totalChapters={chapters.length} />
      </div>

      {/* 9. Chapter Section */}
      <div className="pt-4 space-y-6">
        {/* Continue Reading Banner (if progress exists in localStorage) */}
        <ContinueReading mangaId={manga.id} />

        {/* Chapter List with Search and Sort */}
        <ChapterList chapters={chapters} readingProgress={readingProgress} />
      </div>

      {/* 10. Related Stories: More Like This */}
      <div className="pt-6">
        <RelatedStories currentManga={manga} />
      </div>
    </div>
  );
}
