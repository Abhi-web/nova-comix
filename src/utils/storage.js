/**
 * LocalStorage Utilities for NOVA PANEL
 * Keys:
 * - nova_library: Set of bookmarked manga IDs
 * - nova_reading_progress: Reading history by manga ID
 */

const LIBRARY_KEY = "nova_library";
const PROGRESS_KEY = "nova_reading_progress";

/**
 * Get all bookmarked manga IDs
 * @returns {string[]}
 */
export function getLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Check if a manga ID is in library
 * @param {string} mangaId 
 * @returns {boolean}
 */
export function isInLibrary(mangaId) {
  if (!mangaId) return false;
  const list = getLibrary();
  return list.includes(mangaId);
}

/**
 * Toggle manga in library
 * @param {string} mangaId 
 * @returns {boolean} true if now in library, false if removed
 */
export function toggleLibrary(mangaId) {
  if (!mangaId) return false;
  try {
    const list = getLibrary();
    const index = list.indexOf(mangaId);
    let updated;
    let inLib = false;

    if (index >= 0) {
      updated = list.filter((id) => id !== mangaId);
      inLib = false;
    } else {
      updated = [...list, mangaId];
      inLib = true;
    }

    localStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));
    return inLib;
  } catch {
    return false;
  }
}

/**
 * Get reading progress for a specific manga ID
 * @param {string} mangaId 
 * @returns {{ chapterId: string, chapterNumber: number, chapterTitle: string, progress: number, updatedAt: string } | null}
 */
export function getReadingProgress(mangaId) {
  if (!mangaId) return null;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const allProgress = JSON.parse(raw);
    return allProgress[mangaId] || null;
  } catch {
    return null;
  }
}

/**
 * Save reading progress for a manga chapter
 * @param {string} mangaId 
 * @param {{ chapterId: string, chapterNumber: number, chapterTitle: string, progress: number }} data 
 */
export function saveReadingProgress(mangaId, data) {
  if (!mangaId || !data) return;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const allProgress = raw ? JSON.parse(raw) : {};

    allProgress[mangaId] = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (err) {
    console.error("Failed to save reading progress", err);
  }
}
