/**
 * Display formatting utilities.
 *
 * Pure string-formatting helpers shared across pages/charts.
 * These never mutate source data — they only affect display labels.
 */

/**
 * Converts an API-stored lowercase string into Title Case for
 * display purposes (player names, countries, etc.).
 * e.g. "joe root" -> "Joe Root", "new zealand" -> "New Zealand".
 *
 * @param {string} value - Raw string value (may be null/undefined).
 * @returns {string} Title-cased string, or "" when input is empty.
 */
export const toTitleCase = (value) =>
  (value || "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
