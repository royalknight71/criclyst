/**
 * Match status utilities — the single backend source of truth for
 * classifying cricket match state from CricAPI provider payloads and for
 * reconciling MongoDB Match documents against the latest authoritative
 * provider snapshot.
 *
 * Rules (in priority order):
 * 1. matchEnded === true            → completed (even when matchStarted is true)
 * 2. matchStarted === true          → live, unless the status text already
 *                                     reports a final result
 * 3. matchStarted === false         → upcoming
 * 4. status text heuristics         → completed patterns beat live patterns
 * 5. otherwise                      → "unknown" (never guessed from the date)
 *
 * A match is NEVER classified live merely because its date is today or
 * because a stored database record says "live".
 */

export const VALID_STATUSES = Object.freeze(["upcoming", "live", "completed"]);

// Final-result phrases used by CricAPI status text. Checked before the
// live patterns so a completed match is never re-labelled live.
const COMPLETED_STATUS_PATTERN =
  /(?:\bwon by\b|\bwin by\b|\babandoned\b|\bno result\b|\btied\b|\bdrawn?\b|\bmatch (?:complete|completed)\b|\bcompleted\b|\bresult\b)/i;

// In-play phrases used by CricAPI status text when boolean flags are absent.
const LIVE_STATUS_PATTERN =
  /\b(?:live|in progress|innings break|opt to bat|elected to (?:bat|bowl|field)|need \d+ runs? from|require \d+ runs? from)\b/i;

/**
 * Determine match state from a CricAPI-style match object.
 *
 * @param {Object} match - raw/normalized provider match
 * @returns {"live"|"completed"|"upcoming"|"unknown"}
 */
export function getMatchState(match) {
  if (!match || typeof match !== "object") return "unknown";

  const statusText = typeof match.status === "string" ? match.status : "";

  // Explicit booleans are the most reliable signal. matchEnded wins over
  // matchStarted so finished matches are never shown as live.
  if (match.matchEnded === true) return "completed";
  if (match.matchStarted === true) {
    // Defensive: some feeds keep matchStarted=true briefly after the result.
    if (COMPLETED_STATUS_PATTERN.test(statusText)) return "completed";
    return "live";
  }
  if (match.matchStarted === false) return "upcoming";

  // No reliable booleans — fall back to the status string only.
  if (COMPLETED_STATUS_PATTERN.test(statusText)) return "completed";
  if (LIVE_STATUS_PATTERN.test(statusText)) return "live";

  // Note: the presence of score entries alone is NOT proof of a live
  // match (completed matches also carry scores).
  return "unknown";
}

/**
 * Normalize an arbitrary status-like value onto our enum.
 *
 * @returns {"upcoming"|"live"|"completed"|null}
 */
export function normalizeStatus(value) {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  return VALID_STATUSES.includes(v) ? v : null;
}

/**
 * Build a Map of provider match id → normalized state from the latest
 * authoritative provider payload. Duplicate provider ids are collapsed
 * (first occurrence wins) so the same match can never appear twice.
 *
 * @param {Array<Object>} relevantMatches - normalized provider matches
 * @returns {Map<string, "upcoming"|"live"|"completed">}
 */
export function buildProviderStateMap(relevantMatches) {
  const map = new Map();
  if (!Array.isArray(relevantMatches)) return map;

  for (const match of relevantMatches) {
    if (!match || typeof match !== "object") continue;
    const rawId = match.id ?? match.matchId ?? match.providerId;
    if (rawId === undefined || rawId === null || rawId === "") continue;
    const id = String(rawId);
    if (map.has(id)) continue;

    const state =
      normalizeStatus(match.matchState) || getMatchState(match) || null;
    if (state && VALID_STATUSES.includes(state)) map.set(id, state);
  }
  return map;
}

/**
 * Effective display status for a MongoDB Match document, reconciled
 * against the authoritative provider snapshot.
 *
 * - Provider-confirmed state always wins over the stored status.
 * - A stored "live" match that the provider does not currently confirm
 *   (dropped from the feed, or never provider-tracked) is shown as
 *   completed — LIVE is never inferred from stale data.
 * - When no successful provider snapshot exists, the stored status is
 *   returned unchanged (callers must mark the response as stale).
 *
 * @param {Object} doc - MongoDB Match document (needs providerId/status)
 * @param {Map<string,string>} stateMap - from buildProviderStateMap
 * @param {boolean} snapshotAvailable - whether a successful poll exists
 * @returns {string|undefined} effective status
 */
export function effectiveMatchStatus(doc, stateMap, snapshotAvailable) {
  if (!snapshotAvailable || !stateMap) return doc?.status;

  const providerId = doc?.providerId;
  if (providerId) {
    const confirmed = stateMap.get(String(providerId));
    if (confirmed) return confirmed;
  }

  // Live requires current provider confirmation.
  if (doc?.status === "live") return "completed";

  return doc?.status;
}

/**
 * Apply effectiveMatchStatus to every document in-place (for API responses).
 */
export function applyReconciledStatuses(docs, stateMap, snapshotAvailable) {
  if (!Array.isArray(docs)) return docs;
  for (const doc of docs) {
    const next = effectiveMatchStatus(doc, stateMap, snapshotAvailable);
    if (next) doc.status = next;
  }
  return docs;
}

/**
 * Freshness metadata describing the authoritative provider snapshot.
 *
 * @param {Object|null} snapshot - { lastError, stale, fetchedAt, liveCount }
 * @returns {{providerStatus: string, stale: boolean, lastSyncAt: string|null, liveCount: number}}
 */
export function buildMatchListMeta(snapshot) {
  if (!snapshot) {
    // Provider could not be checked at all — never claim "zero live".
    return {
      providerStatus: "unavailable",
      stale: true,
      lastSyncAt: null,
      liveCount: 0,
    };
  }
  const stale = Boolean(snapshot.lastError) || snapshot.stale === true;
  return {
    providerStatus: stale ? "stale" : "ok",
    stale,
    lastSyncAt: snapshot.fetchedAt || null,
    liveCount: Number.isFinite(snapshot.liveCount) ? snapshot.liveCount : 0,
  };
}

/**
 * Deduplicate an array of provider matches by stable id
 * (first occurrence wins).
 */
export function dedupeByProviderId(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const match of list) {
    if (!match || typeof match !== "object") continue;
    const rawId = match.id ?? match.matchId ?? match.providerId;
    if (rawId === undefined || rawId === null || rawId === "") continue;
    const id = String(rawId);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(match);
  }
  return out;
}
