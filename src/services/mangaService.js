import { MANGA_DATA } from "../data/mangaData";
import { GENRES_DATA } from "../data/genresData";
import { generateChaptersForManga } from "../utils/chapterGenerator";
import { resolveImageUrl } from "../utils/imageUrl";
import api from "./api";

/**
 * Normalizes manga data from backend API or mock data to ensure
 * 100% compatibility with all existing NOVA PANEL components.
 */
export function normalizeManga(item) {
  if (!item) return null;
  const id = item.slug || (item._id ? item._id.toString() : item.id);
  const title = item.title || "";
  const monogram =
    item.monogram ||
    (title
      ? title
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "NP");

  const resolvedCover = resolveImageUrl(item.coverImage || item.cover);
  const resolvedBanner = resolveImageUrl(
    item.bannerImage || item.heroArtwork || item.coverImage || item.cover
  );

  return {
    ...item,
    id,
    _id: item._id || id,
    title,
    monogram,
    cover: resolvedCover,
    coverImage: resolvedCover,
    bannerImage: resolvedBanner,
    heroArtwork: resolvedBanner,
    type: item.type
      ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()
      : "Manga",
    status: item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
      : "Ongoing",
    rating: typeof item.rating === "number" ? item.rating : 8.5,
    views: item.views ?? 100000,
    latestChapter: item.chaptersCount || item.latestChapter || 1,
    genres: Array.isArray(item.genres) ? item.genres : [],
  };
}

export const mangaService = {
  // ==========================================
  // ASYNC REST API METHODS (Backend Connected)
  // ==========================================

  /**
   * Fetch paginated and filtered manga from REST API
   */
  async fetchList(params = {}) {
    try {
      const response = await api.get("/manga", params);
      if (response.success) {
        return {
          items: (response.data || []).map(normalizeManga),
          pagination: response.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 },
        };
      }
      throw new Error(response.message || "Failed to fetch stories");
    } catch (error) {
      // Fallback to local catalog if API is unreachable
      console.warn("API unavailable, falling back to local dataset:", error.message);
      return {
        items: mangaService.getAll().map(normalizeManga),
        pagination: { total: MANGA_DATA.length, page: 1, limit: 50, totalPages: 1 },
      };
    }
  },

  /**
   * Fetch single story by ID or slug from REST API
   */
  async fetchById(id) {
    if (!id) return null;
    try {
      const response = await api.get(`/manga/${id}`);
      if (response.success && response.data) {
        return normalizeManga(response.data);
      }
    } catch (error) {
      console.warn(`API lookup failed for ${id}, falling back to local:`, error.message);
    }
    // Fallback to local
    return mangaService.getById(id);
  },

  /**
   * Fetch chapters for a manga from REST API
   */
  async fetchChapters(mangaId, params = {}) {
    try {
      const response = await api.get(`/manga/${mangaId}/chapters`, params);
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((ch) => ({
          ...ch,
          id: ch._id || `${mangaId}-ch-${ch.number}`,
          formattedDate: ch.publishedAt
            ? new Date(ch.publishedAt).toLocaleDateString()
            : "Recently",
        }));
      }
    } catch (error) {
      console.warn(`API chapters lookup failed for ${mangaId}, using generator:`, error.message);
    }
    // Fallback to generator
    return mangaService.getChapters(mangaId);
  },

  // ==========================================
  // SYNCHRONOUS METHODS (Preserving Existing UI)
  // ==========================================

  getAll: () => {
    return [...MANGA_DATA].map(normalizeManga);
  },

  getFeatured: () => {
    const hero =
      MANGA_DATA.find((item) => item.id === "beyond-the-last-horizon") || MANGA_DATA[0];
    return [normalizeManga(hero), ...MANGA_DATA.filter((item) => item.id !== hero.id && item.featured).map(normalizeManga)];
  },

  getTrending: (limit = 6) => {
    const preferredOrder = [
      "beyond-the-last-horizon",
      "crimson-archive",
      "moonlit-requiem",
      "the-silent-crown",
      "ashes-of-tomorrow",
      "echoes-of-avalon",
    ];

    const sorted = [...MANGA_DATA].sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.id);
      const indexB = preferredOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return b.views - a.views;
    });

    return sorted.slice(0, limit).map(normalizeManga);
  },

  getRecentlyUpdated: (limit = 6) => {
    return [...MANGA_DATA]
      .filter((m) => m.latestChapter && m.updatedTime)
      .slice(0, limit)
      .map(normalizeManga);
  },

  getPopularThisWeek: (limit = 5) => {
    const preferredOrder = [
      "beyond-the-last-horizon",
      "crimson-archive",
      "moonlit-requiem",
      "the-silent-crown",
      "echoes-of-avalon",
    ];

    const sorted = [...MANGA_DATA].sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.id);
      const indexB = preferredOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return b.bookmarks - a.bookmarks;
    });

    return sorted.slice(0, limit).map((item, index) => ({
      ...normalizeManga(item),
      rank: index + 1,
    }));
  },

  getCompleted: (limit = 6) => {
    return [...MANGA_DATA]
      .filter((m) => m.status.toLowerCase() === "completed")
      .slice(0, limit)
      .map(normalizeManga);
  },

  getById: (id) => {
    if (!id) return null;
    if (id === "demo") {
      const hero = MANGA_DATA.find((item) => item.id === "beyond-the-last-horizon") || MANGA_DATA[0];
      return normalizeManga(hero);
    }
    const found = MANGA_DATA.find((item) => item.id === id || item.slug === id);
    return found ? normalizeManga(found) : null;
  },

  getChapters: (mangaId) => {
    const manga = mangaService.getById(mangaId);
    if (!manga) return [];
    return generateChaptersForManga(manga);
  },

  getChapter: (chapterId) => {
    if (!chapterId) return null;

    if (chapterId === "demo") {
      const manga = mangaService.getById("beyond-the-last-horizon");
      const chapters = generateChaptersForManga(manga);
      return {
        manga,
        chapter: chapters[0] || null,
        prevChapter: null,
        nextChapter: chapters[1] || null,
      };
    }

    let mangaId = "";
    let chapterNum = 1;

    if (chapterId.includes("-ch-")) {
      const parts = chapterId.split("-ch-");
      mangaId = parts[0];
      chapterNum = parseInt(parts[1], 10);
    } else {
      mangaId = chapterId;
    }

    const manga = mangaService.getById(mangaId);
    if (!manga) return null;

    const chapters = generateChaptersForManga(manga);
    const currentChapterIndex = chapters.findIndex((c) => c.number === chapterNum);

    if (currentChapterIndex === -1) {
      return {
        manga,
        chapter: null,
        prevChapter: null,
        nextChapter: null,
      };
    }

    const chapter = chapters[currentChapterIndex];
    const prevChapter = chapters[currentChapterIndex + 1] || null;
    const nextChapter = chapters[currentChapterIndex - 1] || null;

    return {
      manga,
      chapter,
      prevChapter,
      nextChapter,
    };
  },

  getRelated: (currentManga, limit = 6) => {
    if (!currentManga || !Array.isArray(currentManga.genres)) return [];

    const targetGenres = currentManga.genres.map((g) => g.toLowerCase());

    const candidates = MANGA_DATA.filter((item) => item.id !== currentManga.id)
      .map((item) => {
        const sharedCount = item.genres.filter((g) =>
          targetGenres.includes(g.toLowerCase())
        ).length;
        return {
          ...normalizeManga(item),
          sharedCount,
        };
      })
      .filter((item) => item.sharedCount > 0)
      .sort((a, b) => {
        if (b.sharedCount !== a.sharedCount) {
          return b.sharedCount - a.sharedCount;
        }
        return b.rating - a.rating;
      });

    return candidates.slice(0, limit);
  },

  getByGenre: (genreName) => {
    if (!genreName || genreName.toLowerCase() === "all") {
      return [...MANGA_DATA].map(normalizeManga);
    }
    return MANGA_DATA.filter((item) =>
      item.genres.some((g) => g.toLowerCase() === genreName.toLowerCase())
    ).map(normalizeManga);
  },

  getByType: (typeName) => {
    if (!typeName || typeName.toLowerCase() === "all") {
      return [...MANGA_DATA].map(normalizeManga);
    }
    return MANGA_DATA.filter(
      (item) => item.type.toLowerCase() === typeName.toLowerCase()
    ).map(normalizeManga);
  },

  getRankings: (type = "all") => {
    let list = [...MANGA_DATA].map(normalizeManga);
    if (type !== "all") {
      list = list.filter((m) => m.type.toLowerCase() === type.toLowerCase());
    }
    return list
      .sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));
  },

  search: (query) => {
    if (!query || query.trim() === "") return [];
    const q = query.toLowerCase().trim();
    return MANGA_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.alternativeTitles &&
          item.alternativeTitles.some((alt) => alt.toLowerCase().includes(q))) ||
        item.genres.some((g) => g.toLowerCase().includes(q)) ||
        item.author.toLowerCase().includes(q) ||
        (item.artist && item.artist.toLowerCase().includes(q)) ||
        item.type.toLowerCase().includes(q)
    ).map(normalizeManga);
  },

  getGenres: () => {
    return [...GENRES_DATA];
  },
};
