/**
 * Provider snapshot persistence.
 *
 * Stores the latest successful CricAPI currentMatches payload in MongoDB
 * and reloads it on boot so the authoritative live-match state survives
 * process restarts. Only successful polls are ever persisted.
 */
import ProviderSnapshot from "../models/providerSnapshot.model.js";

export const CURRENT_MATCHES_SNAPSHOT_KEY = "currentMatches";

/**
 * Persist the latest successful provider payload (best-effort; failures
 * are logged but never break polling).
 *
 * @param {Array<Object>} matches - normalized provider matches
 * @param {string|Date} fetchedAt - poll start timestamp
 * @param {number} liveCount - number of provider-confirmed live matches
 */
export async function saveProviderSnapshot(matches, fetchedAt, liveCount) {
  try {
    await ProviderSnapshot.updateOne(
      { key: CURRENT_MATCHES_SNAPSHOT_KEY },
      {
        $set: {
          matches: Array.isArray(matches) ? matches : [],
          fetchedAt: fetchedAt instanceof Date ? fetchedAt : new Date(fetchedAt),
          liveCount: Number.isFinite(liveCount) ? liveCount : 0,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.warn("[providerSnapshot] Save failed:", error.message);
  }
}

/**
 * Load the most recent persisted snapshot, if any.
 *
 * @returns {Promise<Object|null>} snapshot doc (lean) or null
 */
export async function loadProviderSnapshot() {
  try {
    return await ProviderSnapshot.findOne({
      key: CURRENT_MATCHES_SNAPSHOT_KEY,
    }).lean();
  } catch (error) {
    console.warn("[providerSnapshot] Load failed:", error.message);
    return null;
  }
}
