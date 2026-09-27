import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';
import api from '../services/api';
import storageService from '../services/storageService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useSettings } from '../context/SettingsContext';

const PROGRESS_STORAGE_KEY = 'nova_reader_progress';

function getStoredProgress(chapterId) {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed[chapterId] || null;
  } catch (err) {
    return null;
  }
}

function saveStoredProgress(chapterId, data) {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[chapterId] = {
      ...data,
      chapterId,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
  } catch (err) {
    // Ignore storage quota/security errors
  }
}

export default function ReaderPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { settings, openSettings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [brokenImages, setBrokenImages] = useState(new Set());
  const [retryTokens, setRetryTokens] = useState({});
  const [savedProgressPrompt, setSavedProgressPrompt] = useState(null);

  const pageRefs = useRef([]);

  // Dynamic classes from user preferences
  const readerWidthClass =
    settings?.reader?.pageWidth === 'compact'
      ? 'max-w-2xl'
      : settings?.reader?.pageWidth === 'wide'
      ? 'max-w-5xl'
      : 'max-w-3xl';

  const readerSpacingClass =
    settings?.reader?.pageSpacing === 'none'
      ? 'space-y-0'
      : settings?.reader?.pageSpacing === 'small'
      ? 'space-y-2'
      : settings?.reader?.pageSpacing === 'large'
      ? 'space-y-8'
      : 'space-y-4';

  const readerBgClass =
    settings?.reader?.readerBackground === 'black'
      ? 'bg-[#000000]'
      : settings?.reader?.readerBackground === 'dim'
      ? 'bg-[#12151D]'
      : 'bg-[#090A0F]';

  // Fetch real chapter data from backend
  const fetchChapter = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBrokenImages(new Set());
    setRetryTokens({});

    try {
      const res = await api.get(`/chapters/${chapterId}`);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Chapter data not found');
      }

      const chapter = res.data;
      // Ensure pages are sorted numerically by pageNumber
      if (Array.isArray(chapter.pages)) {
        chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);
      } else {
        chapter.pages = [];
      }

      setChapterData(chapter);

      // Check for saved reading progress
      const prevProgress = getStoredProgress(chapterId);
      if (prevProgress && prevProgress.currentPage > 1) {
        setSavedProgressPrompt(prevProgress);
      }
    } catch (err) {
      setError(err.message || 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchChapter();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [fetchChapter]);

  // Track active page via IntersectionObserver
  useEffect(() => {
    if (!chapterData?.pages?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-number'), 10);
            if (pageNum) {
              setCurrentPage(pageNum);
              saveStoredProgress(chapterId, {
                currentPage: pageNum,
                totalPages: chapterData.pages.length,
                scrollPosition: window.scrollY,
                mangaTitle: chapterData.mangaId?.title,
                chapterNumber: chapterData.number,
              });
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapterData, chapterId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowLeft' && chapterData?.prevChapter) {
        navigate(`/read/${chapterData.prevChapter._id}`);
      } else if (e.key === 'ArrowRight' && chapterData?.nextChapter) {
        navigate(`/read/${chapterData.nextChapter._id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterData, navigate]);

  // Jump to saved progress
  const handleJumpToSaved = () => {
    if (!savedProgressPrompt) return;
    const targetIdx = savedProgressPrompt.currentPage - 1;
    const targetEl = pageRefs.current[targetIdx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    } else if (savedProgressPrompt.scrollPosition) {
      window.scrollTo({ top: savedProgressPrompt.scrollPosition, behavior: 'smooth' });
    }
    setSavedProgressPrompt(null);
  };

  const handleImageError = (pageNumber) => {
    setBrokenImages((prev) => new Set(prev).add(pageNumber));
  };

  const handleRetryImage = (pageNumber) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.delete(pageNumber);
      return next;
    });
    setRetryTokens((prev) => ({
      ...prev,
      [pageNumber]: Date.now(),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-6 text-content-primary">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium text-content-secondary">Loading real chapter stream...</p>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-6 text-content-primary">
        <div className="max-w-md w-full p-8 rounded-2xl bg-background-card border border-rose-500/20 text-center shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-content-primary">Unable to Read Chapter</h2>
          <p className="text-xs text-content-secondary leading-relaxed">
            {error || 'The requested chapter could not be found or is not currently published.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/manga">
              <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Explore Stories
              </Button>
            </Link>
            <Button variant="primary" size="sm" onClick={fetchChapter} icon={<RotateCcw className="w-4 h-4" />}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const manga = chapterData.mangaId || {};
  const mangaId = manga._id || manga.slug || '';
  const pages = chapterData.pages || [];
  const prevChapter = chapterData.prevChapter;
  const nextChapter = chapterData.nextChapter;

  return (
    <div className={`min-h-screen ${readerBgClass} text-content-primary flex flex-col selection:bg-accent/20 selection:text-accent transition-colors duration-300`}>
      {/* Sticky Reader Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-background-primary/90 backdrop-blur-xl border-b border-border-subtle h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 shadow-card transition-all">
        {/* Left: Back to Manga Details */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={mangaId ? `/manga/${mangaId}` : '/manga'}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-content-secondary hover:text-accent transition-colors rounded-xl p-2 hover:bg-background-card"
            title={`Back to ${manga.title || 'Story'}`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-4 w-px bg-border-subtle hidden sm:block" />

          {/* Manga Title & Chapter Details */}
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-content-primary truncate max-w-[180px] sm:max-w-md">
              {manga.title || 'Untitled Story'}
            </h1>
            <p className="text-[11px] text-content-secondary truncate font-medium">
              Chapter {chapterData.number} {chapterData.title ? `— ${chapterData.title}` : ''}
            </p>
          </div>
        </div>

        {/* Center / Right: Page Counter Badge, Settings & Chapter Nav */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {pages.length > 0 && (
            <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-bold text-accent font-mono hidden xs:flex items-center gap-1.5 shadow-glow-accent/10">
              <Layers className="w-3.5 h-3.5" />
              <span>{currentPage} / {pages.length}</span>
            </div>
          )}

          {/* Reader Settings Modal Trigger */}
          <Button
            variant="secondary"
            size="sm"
            onClick={openSettings}
            icon={<Sliders className="w-3.5 h-3.5 text-accent" />}
            title="Customize reader layout & spacing"
          >
            <span className="hidden sm:inline">Settings</span>
          </Button>

          {/* Previous Chapter */}
          {prevChapter ? (
            <Link to={`/read/${prevChapter._id}`}>
              <Button
                variant="secondary"
                size="sm"
                icon={<ChevronLeft className="w-4 h-4" />}
                title={`Previous: Chapter ${prevChapter.number}`}
              >
                <span className="hidden md:inline">Prev</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft className="w-4 h-4" />}
              disabled
              title="First chapter"
            >
              <span className="hidden md:inline">Prev</span>
            </Button>
          )}

          {/* Next Chapter */}
          {nextChapter ? (
            <Link to={`/read/${nextChapter._id}`}>
              <Button
                variant="primary"
                size="sm"
                icon={<ChevronRight className="w-4 h-4" />}
                iconPosition="right"
                title={`Next: Chapter ${nextChapter.number}`}
              >
                <span className="hidden md:inline">Next</span>
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
              disabled
              title="Latest chapter reached"
            >
              <span className="hidden md:inline">Next</span>
            </Button>
          )}
        </div>
      </header>

      {/* Floating Continue Reading Prompt */}
      {savedProgressPrompt && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-30 max-w-sm w-full px-4 animate-fadeIn">
          <div className="p-3 rounded-xl bg-background-card/95 border border-accent/30 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-content-primary font-medium">
              <Bookmark className="w-4 h-4 text-accent shrink-0" />
              <span>Resume from Page {savedProgressPrompt.currentPage}?</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleJumpToSaved}
                className="px-2.5 py-1 bg-accent text-background-primary rounded-md font-bold hover:bg-accent/90 transition-colors"
              >
                Jump
              </button>
              <button
                onClick={() => setSavedProgressPrompt(null)}
                className="px-2 py-1 text-content-tertiary hover:text-content-primary transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Vertical Reading Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 w-full">
        {pages.length === 0 ? (
          <div className="max-w-md w-full my-20 p-8 rounded-2xl bg-background-card border border-border-subtle text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-background-elevated text-content-tertiary flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-content-primary">No Pages Uploaded Yet</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              This chapter has been published, but no image pages have been added to it yet.
            </p>
            <Link to={mangaId ? `/manga/${mangaId}` : '/manga'}>
              <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Return to Story Details
              </Button>
            </Link>
          </div>
        ) : (
          <div className={`w-full ${readerWidthClass} flex flex-col items-center ${readerSpacingClass} transition-all duration-300`}>
            {pages.map((page, idx) => {
              const isBroken = brokenImages.has(page.pageNumber);
              const retryToken = retryTokens[page.pageNumber] ? `?r=${retryTokens[page.pageNumber]}` : '';
              const accessUrl = storageService.getFileAccessUrl(page.fileId || page.imageUrl) + retryToken;

              return (
                <div
                  key={page._id || page.fileId || idx}
                  ref={(el) => (pageRefs.current[idx] = el)}
                  data-page-number={page.pageNumber}
                  className="w-full relative flex flex-col items-center group transition-all"
                >
                  {isBroken ? (
                    <div className="w-full h-80 rounded-lg border border-rose-500/20 bg-background-card flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <AlertTriangle className="w-8 h-8 text-rose-400" />
                      <div>
                        <p className="text-sm font-semibold text-content-primary">
                          Failed to load Page {page.pageNumber}
                        </p>
                        <p className="text-xs text-content-secondary mt-1">
                          Network interruption or Google Drive temporary stream limit.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                        onClick={() => handleRetryImage(page.pageNumber)}
                      >
                        Retry Page {page.pageNumber}
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full bg-background-elevated/40 rounded-lg overflow-hidden border border-border-subtle/40 shadow-md">
                      <img
                        src={accessUrl}
                        alt={`Page ${page.pageNumber}`}
                        loading="lazy"
                        onError={() => handleImageError(page.pageNumber)}
                        className="w-full h-auto object-contain mx-auto block select-none"
                      />
                    </div>
                  )}

                  {/* Page Number Subtle Badge */}
                  <div className="mt-1 text-[10px] text-content-tertiary select-none">
                    — {page.pageNumber} —
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* End of Chapter Footer Section */}
        {pages.length > 0 && (
          <div className="w-full max-w-xl mx-auto my-14 p-6 sm:p-10 rounded-3xl bg-background-card/90 border border-border-subtle text-center shadow-2xl space-y-5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-accent/15 blur-2xl pointer-events-none rounded-full" />
            <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto shadow-glow-accent/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-content-primary tracking-tight">
                You've reached the end of Chapter {chapterData.number}
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                {manga.title} {chapterData.title ? `— "${chapterData.title}"` : ''}
              </p>
            </div>

            {/* Chapter Action Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to={mangaId ? `/manga/${mangaId}` : '/manga'} className="w-full sm:w-auto">
                <Button variant="secondary" size="md" icon={<ArrowLeft className="w-4 h-4" />} className="w-full">
                  Story Details
                </Button>
              </Link>

              {nextChapter ? (
                <Link to={`/read/${nextChapter._id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full font-bold shadow-glow-accent/30"
                  >
                    Next Chapter ({nextChapter.number}) →
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="md" disabled className="w-full sm:w-auto">
                  Latest Chapter Reached
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Reader Bottom Copyright Bar */}
      <footer className="border-t border-border-subtle py-3 px-4 text-center text-[11px] text-content-muted bg-background-card/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <span>NOVA PANEL Reader • Chapter {chapterData.number}</span>
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>•</span>
            <Link to="/manga" className="hover:text-accent transition-colors">Library</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
