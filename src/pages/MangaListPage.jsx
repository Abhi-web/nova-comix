import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { mangaService } from "../services/mangaService";
import { filterStories, sortStories } from "../utils/filterManga";

import LibraryHeader from "../components/library/LibraryHeader";
import TypeTabs from "../components/library/TypeTabs";
import SearchBar from "../components/library/SearchBar";
import FilterPanel from "../components/library/FilterPanel";
import FilterDrawer from "../components/library/FilterDrawer";
import ActiveFilters from "../components/library/ActiveFilters";
import ResultsHeader from "../components/library/ResultsHeader";
import MangaGrid from "../components/library/MangaGrid";
import MangaList from "../components/library/MangaList";
import Pagination from "../components/library/Pagination";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { FilterX, RefreshCw, AlertCircle } from "lucide-react";
import Skeleton from "../components/common/Skeleton";

const ITEMS_PER_PAGE = 20;

/**
 * MangaListPage (/manga) Component for NOVA PANEL
 * Comprehensive discovery and library explore experience connected to REST API.
 */
export default function MangaListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allStories, setAllStories] = useState(() => mangaService.getAll());
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const loadStories = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await mangaService.fetchList({ limit: 100 });
      if (result && result.items && result.items.length > 0) {
        setAllStories(result.items);
      }
    } catch (err) {
      setFetchError("Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  // Directly derive all filters, view mode, sorting, and pagination from searchParams
  const selectedType = searchParams.get("type") || "all";
  const searchQuery = searchParams.get("q") || "";
  const selectedGenres = useMemo(() => {
    const raw = searchParams.get("genre");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedStatuses = useMemo(() => {
    const raw = searchParams.get("status");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedRating = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : 0;
  const sortBy = searchParams.get("sort") || "latest_updated";
  const viewMode = searchParams.get("view") === "list" ? "list" : "grid";
  const currentPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  // Mobile Filter Drawer toggle state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize state changes to URL search params
  const updateUrlParams = useCallback(
    (newValues) => {
      const nextType = newValues.type !== undefined ? newValues.type : selectedType;
      const nextSearch = newValues.q !== undefined ? newValues.q : searchQuery;
      const nextGenres = newValues.genres !== undefined ? newValues.genres : selectedGenres;
      const nextStatuses = newValues.statuses !== undefined ? newValues.statuses : selectedStatuses;
      const nextRating = newValues.rating !== undefined ? newValues.rating : selectedRating;
      const nextSort = newValues.sort !== undefined ? newValues.sort : sortBy;
      const nextView = newValues.view !== undefined ? newValues.view : viewMode;
      const nextPage = newValues.page !== undefined ? newValues.page : currentPage;

      const params = new URLSearchParams();

      if (nextType && nextType.toLowerCase() !== "all") {
        params.set("type", nextType.toLowerCase());
      }
      if (nextSearch.trim()) {
        params.set("q", nextSearch.trim());
      }
      if (nextGenres.length > 0) {
        params.set("genre", nextGenres.join(","));
      }
      if (nextStatuses.length > 0) {
        params.set("status", nextStatuses.join(","));
      }
      if (nextRating > 0) {
        params.set("rating", String(nextRating));
      }
      if (nextSort && nextSort !== "latest_updated") {
        params.set("sort", nextSort);
      }
      if (nextView === "list") {
        params.set("view", "list");
      }
      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      setSearchParams(params, { replace: true });
    },
    [
      selectedType,
      searchQuery,
      selectedGenres,
      selectedStatuses,
      selectedRating,
      sortBy,
      viewMode,
      currentPage,
      setSearchParams,
    ]
  );

  // Filter Handlers
  const handleTypeChange = (type) => {
    updateUrlParams({ type, page: 1 });
  };

  const handleSearchChange = (query) => {
    updateUrlParams({ q: query, page: 1 });
  };

  const handleClearSearch = () => {
    updateUrlParams({ q: "", page: 1 });
  };

  const handleToggleGenre = (genreName) => {
    const exists = selectedGenres.some(
      (g) => g.toLowerCase() === genreName.toLowerCase()
    );
    const updated = exists
      ? selectedGenres.filter(
          (g) => g.toLowerCase() !== genreName.toLowerCase()
        )
      : [...selectedGenres, genreName];

    updateUrlParams({ genres: updated, page: 1 });
  };

  const handleToggleStatus = (statusId) => {
    const exists = selectedStatuses.some(
      (s) => s.toLowerCase() === statusId.toLowerCase()
    );
    const updated = exists
      ? selectedStatuses.filter(
          (s) => s.toLowerCase() !== statusId.toLowerCase()
        )
      : [...selectedStatuses, statusId];

    updateUrlParams({ statuses: updated, page: 1 });
  };

  const handleRatingChange = (rating) => {
    updateUrlParams({ rating, page: 1 });
  };

  const handleSortChange = (newSort) => {
    updateUrlParams({ sort: newSort });
  };

  const handleViewModeChange = (mode) => {
    updateUrlParams({ view: mode });
  };

  const handlePageChange = (page) => {
    updateUrlParams({ page });
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Active filter count for badge
  const activeFilterCount =
    (selectedType !== "all" ? 1 : 0) +
    selectedGenres.length +
    selectedStatuses.length +
    (selectedRating > 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // 1. Filter Stories (multi-condition)
  const filteredStories = useMemo(() => {
    return filterStories(allStories, {
      searchQuery,
      type: selectedType,
      genres: selectedGenres,
      statuses: selectedStatuses,
      minRating: selectedRating,
    });
  }, [
    allStories,
    searchQuery,
    selectedType,
    selectedGenres,
    selectedStatuses,
    selectedRating,
  ]);

  // 2. Sort Stories
  const sortedStories = useMemo(() => {
    return sortStories(filteredStories, sortBy);
  }, [filteredStories, sortBy]);

  // 3. Paginate Stories
  const totalPages = Math.max(1, Math.ceil(sortedStories.length / ITEMS_PER_PAGE));
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedStories.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedStories, currentPage]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 2. PAGE HEADER */}
      <LibraryHeader />

      {/* 4. SEARCH & 3. TYPE FILTER */}
      <div className="space-y-4">
        {/* Large Search Field */}
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {/* Prominent Format Filter Tabs */}
        <TypeTabs
          activeType={selectedType}
          onTypeChange={handleTypeChange}
        />
      </div>

      {/* MAIN TWO-COLUMN DISCOVERY WORKSPACE */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* 5. DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-20 bg-background-secondary p-5 rounded-2xl border border-border-subtle shadow-sm">
          <FilterPanel
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedGenres={selectedGenres}
            onToggleGenre={handleToggleGenre}
            selectedStatuses={selectedStatuses}
            onToggleStatus={handleToggleStatus}
            selectedRating={selectedRating}
            onRatingChange={handleRatingChange}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 w-full min-w-0 space-y-5">
          {/* 9. RESULTS HEADER & CONTROLS */}
          <ResultsHeader
            count={sortedStories.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onOpenMobileFilters={() => setMobileFilterOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* 10. ACTIVE FILTER CHIPS */}
          <ActiveFilters
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            selectedType={selectedType}
            onClearType={() => handleTypeChange("all")}
            selectedGenres={selectedGenres}
            onRemoveGenre={handleToggleGenre}
            selectedStatuses={selectedStatuses}
            onRemoveStatus={handleToggleStatus}
            selectedRating={selectedRating}
            onClearRating={() => handleRatingChange(0)}
            onClearAll={handleResetFilters}
          />

          {/* RESULTS DISPLAY: LOADING / ERROR / GRID / LIST / EMPTY */}
          {fetchError ? (
            <div className="p-8 rounded-xl border border-rose-500/20 bg-background-card text-center max-w-md mx-auto my-8">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-content-primary mb-1">Unable to load data.</h3>
              <p className="text-xs text-content-secondary mb-4">Could not retrieve titles from the server.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={loadStories}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </Button>
            </div>
          ) : loading && allStories.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="card" height="240px" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="50%" />
                </div>
              ))}
            </div>
          ) : sortedStories.length > 0 ? (
            viewMode === "grid" ? (
              <MangaGrid stories={paginatedStories} />
            ) : (
              <MangaList stories={paginatedStories} />
            )
          ) : (
            /* 14. POLISHED EMPTY STATE */
            <EmptyState
              icon={<FilterX className="w-12 h-12 text-accent/80" />}
              title="No stories match your filters."
              description={
                searchQuery
                  ? `No stories found for "${searchQuery}". Try removing a filter or searching for something else.`
                  : "We couldn't find any titles satisfying all selected filters. Try removing some filters to broaden your discovery."
              }
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              }
            />
          )}

          {/* 13. PAGINATION CONTROLS */}
          {sortedStories.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        totalResultsCount={sortedStories.length}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        selectedGenres={selectedGenres}
        onToggleGenre={handleToggleGenre}
        selectedStatuses={selectedStatuses}
        onToggleStatus={handleToggleStatus}
        selectedRating={selectedRating}
        onRatingChange={handleRatingChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}
