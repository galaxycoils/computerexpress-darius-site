/**
 * Date formatting utilities for news/police pages.
 * Shared formatters used by NewsPage.jsx and PoliceNewsPage.jsx.
 */

/**
 * Format an ISO date string to a readable Canadian locale date.
 * Example: "2026-09-04T08:15:00Z" → "September 4, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Format a date string relative to today (e.g. "2 days ago", "Sep 4").
 * Used for compact date labels in news cards.
 */
export function formatDateShort(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

/**
 * Format a date for machine reading (ISO 8601, no time).
 * Used for <time datetime="..."> attributes.
 */
export function formatDateIso(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toISOString().slice(0, 10);
  } catch {
    return isoString;
  }
}
