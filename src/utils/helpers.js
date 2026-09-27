/**
 * General UI and Data Formatting Helpers
 */

/**
 * Formats a rating number to 1 decimal place
 * @param {number} rating 
 * @returns {string}
 */
export function formatRating(rating) {
  if (rating === undefined || rating === null) return "N/A";
  return Number(rating).toFixed(1);
}

/**
 * Formats large view or bookmark counts (e.g. 1.2M, 450K)
 * @param {number} num 
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Truncate long text strings cleanly
 * @param {string} str 
 * @param {number} maxLen 
 * @returns {string}
 */
export function truncate(str, maxLen = 100) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + "...";
}

/**
 * Returns accessible class for publication status
 * @param {string} status 
 * @returns {string}
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'ongoing':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
    case 'completed':
      return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
    case 'hiatus':
      return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    default:
      return 'text-content-secondary bg-background-card border-border-subtle';
  }
}
