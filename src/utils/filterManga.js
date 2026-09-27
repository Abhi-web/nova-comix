/**
 * Reusable Filtering and Sorting Utilities for NOVA PANEL Library
 */

/**
 * Filter stories across multiple criteria:
 * - Search query (title, alt titles, author, artist, genres)
 * - Type (Manga, Manhwa, Manhua, Webtoon)
 * - Multiple Genres (OR logic within genre selection)
 * - Multiple Statuses (OR logic within status selection)
 * - Minimum Rating (8+, 7+, 6+, or All)
 * 
 * Overall: Type AND Genres AND Status AND Rating AND Search
 */
export function filterStories(stories, {
  searchQuery = "",
  type = "all",
  genres = [],
  statuses = [],
  minRating = 0,
}) {
  if (!Array.isArray(stories)) return [];

  const trimmedQuery = searchQuery.trim().toLowerCase();

  return stories.filter((story) => {
    // 1. Search Query Match
    if (trimmedQuery) {
      const matchTitle = story.title.toLowerCase().includes(trimmedQuery);
      const matchAlt = story.alternativeTitles?.some((alt) =>
        alt.toLowerCase().includes(trimmedQuery)
      );
      const matchAuthor = story.author?.toLowerCase().includes(trimmedQuery);
      const matchArtist = story.artist?.toLowerCase().includes(trimmedQuery);
      const matchGenre = story.genres?.some((g) =>
        g.toLowerCase().includes(trimmedQuery)
      );
      const matchType = story.type?.toLowerCase().includes(trimmedQuery);

      if (!matchTitle && !matchAlt && !matchAuthor && !matchArtist && !matchGenre && !matchType) {
        return false;
      }
    }

    // 2. Release Type Filter (All or specific type)
    if (type && type.toLowerCase() !== "all") {
      if (story.type?.toLowerCase() !== type.toLowerCase()) {
        return false;
      }
    }

    // 3. Genres Filter (OR logic: story must match at least one selected genre)
    if (genres && genres.length > 0) {
      const hasMatchingGenre = genres.some((selectedGenre) =>
        story.genres?.some(
          (g) => g.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
      if (!hasMatchingGenre) {
        return false;
      }
    }

    // 4. Status Filter (OR logic: story status must match at least one selected status)
    if (statuses && statuses.length > 0) {
      const hasMatchingStatus = statuses.some(
        (selectedStatus) =>
          story.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
      if (!hasMatchingStatus) {
        return false;
      }
    }

    // 5. Minimum Rating Filter
    if (minRating > 0) {
      if ((story.rating || 0) < minRating) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort stories according to specified sort key:
 * - "latest_updated": Sort by updatedAt descending
 * - "recently_added": Sort by createdAt descending
 * - "highest_rated": Sort by rating descending
 * - "most_popular": Sort by views descending
 * - "title_asc": Sort by title A-Z
 * - "title_desc": Sort by title Z-A
 */
export function sortStories(stories, sortBy = "latest_updated") {
  if (!Array.isArray(stories)) return [];
  const list = [...stories];

  switch (sortBy) {
    case "latest_updated":
      return list.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    case "recently_added":
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    case "highest_rated":
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case "most_popular":
      return list.sort((a, b) => (b.views || 0) - (a.views || 0));

    case "title_asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));

    case "title_desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));

    default:
      return list;
  }
}
