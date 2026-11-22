/**
 * Keep a document title inside a typical search-result length.
 * The visible record heading can stay the full municipal title.
 */
export function shortenDocumentTitle(title, { suffix = "", max = 60 } = {}) {
  const full = `${title}${suffix}`;
  if (full.length <= max) return full;
  const budget = Math.max(12, max - suffix.length);
  let trimmed = String(title).slice(0, budget);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace >= 12) trimmed = trimmed.slice(0, lastSpace);
  trimmed = trimmed.replace(/[\s—–\-|,:;]+$/u, "");
  return `${trimmed}${suffix}`;
}
