/**
 * Chapter Generator and Helper Utilities for NOVA PANEL
 * Generates rich, canonical sequential chapters for fictional manga.
 */

const CANONICAL_CHAPTER_NAMES = [
  "The Awakening Call",
  "Crossroads of Fate",
  "Echoes in the Dark",
  "The Celestial Threshold",
  "Shadows of the Fallen",
  "The Obsidian Cipher",
  "Resonant Frequencies",
  "The Sovereign Mandate",
  "Tears in the Astral Nexus",
  "Blood and Starlight",
  "The Uncharted Boundary",
  "Whispers Across the Abyss",
  "The Iron Vow",
  "Trial of the Nine Gates",
  "Confrontation at Dawn",
  "The Void Weaver",
  "A Fragile Truce",
  "The Climax of the Nexus",
  "Beyond the Veil",
  "A New Constellation",
];

/**
 * Generate full list of chapters for a manga
 * @param {object} manga 
 * @returns {Array} List of chapters
 */
export function generateChaptersForManga(manga) {
  if (!manga) return [];

  // If manga already has explicit chapters array, return it
  if (Array.isArray(manga.chapters) && manga.chapters.length > 0) {
    return manga.chapters;
  }

  const total = Number(manga.latestChapter) || 50;
  const chapters = [];

  for (let num = total; num >= 1; num--) {
    const isNew = num >= total - 2;
    const nameIndex = (num - 1) % CANONICAL_CHAPTER_NAMES.length;
    const chapterName = CANONICAL_CHAPTER_NAMES[nameIndex];

    let publishedAt = "";
    if (num === total) {
      publishedAt = manga.updatedTime || "2 hours ago";
    } else if (num === total - 1) {
      publishedAt = "1 day ago";
    } else if (num === total - 2) {
      publishedAt = "3 days ago";
    } else if (num >= total - 6) {
      publishedAt = `${total - num} days ago`;
    } else {
      publishedAt = `${Math.floor((total - num) / 7) + 1} weeks ago`;
    }

    chapters.push({
      id: `${manga.id}-ch-${num}`,
      mangaId: manga.id,
      number: num,
      title: `Chapter ${num}: ${chapterName}`,
      shortTitle: `Chapter ${num}`,
      subTitle: chapterName,
      publishedAt,
      isNew,
      views: 8500 + ((num * 419) % 35000),
      pages: Array.from({ length: 6 }, (_, p) => ({
        pageNumber: p + 1,
        placeholderLabel: `Panel ${p + 1}`,
      })),
    });
  }

  return chapters;
}
