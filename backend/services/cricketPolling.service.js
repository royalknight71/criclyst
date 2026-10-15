import { EventEmitter } from "node:events";
import { fetchCurrentMatches } from "./cricketApi.service.js";
import { publishLiveUpdates, publishStatusUpdate } from "./redisPubSub.service.js";
import { syncMatchesFromProvider } from "./matchSync.service.js";
import { getMatchState } from "../utils/matchStatus.js";
import {
  saveProviderSnapshot,
  loadProviderSnapshot,
} from "./providerSnapshot.service.js";

const DEFAULT_POLL_INTERVAL_MS = 900000; // 15 minutes

let latestData = null;
let timerId = null;
let isRunning = false;
let pollCount = 0;
let lastError = null;
let previousLastError = null;

// Kept for backward compatibility / in-process fallback
const pollingEmitter = new EventEmitter();
pollingEmitter.setMaxListeners(20);

// Re-export the shared strict classifier so existing importers
// (liveCricket.controller, tests) keep a single source of truth.
export { getMatchState };

function getInterval() {
  const raw = process.env.CRICKET_API_POLL_INTERVAL_MS;
  if (!raw) return DEFAULT_POLL_INTERVAL_MS;
  const ms = Number(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : DEFAULT_POLL_INTERVAL_MS;
}

function extractRelevantMatches(data) {
  if (!data || !Array.isArray(data.data)) return [];
  return data.data.map((m) => ({
    id: m.id,
    name: m.name,
    status: m.status,
    matchType: m.matchType,
    score: m.score,
    teams: m.teams,
    teamInfo: m.teamInfo,
    venue: m.venue,
    date: m.date,
    dateTimeGMT: m.dateTimeGMT,
    matchStarted: m.matchStarted,
    matchEnded: m.matchEnded,
    matchState: getMatchState(m),
  }));
}

function hasChanged(prev, next) {
  if (!prev && next) return true;
  if (prev && !next) return true;
  if (JSON.stringify(prev) !== JSON.stringify(next)) return true;
  return false;
}

async function pollOnce() {
  if (isRunning) {
    console.log("[cricketPolling] Skipped — previous poll still running");
    return { skipped: true };
  }

  isRunning = true;
  pollCount++;
  const startedAt = new Date().toISOString();

  try {
    const data = await fetchCurrentMatches();

    const matchCount = Array.isArray(data.data) ? data.data.length : 0;
    const relevantNow = extractRelevantMatches(data);
    const liveMatches = relevantNow.filter((m) => m.matchState === "live");
    const changed = hasChanged(latestData?.relevant, relevantNow);

    lastError = null;

if (previousLastError !== lastError) {
  publishStatusUpdate(lastError);
  previousLastError = lastError;
}
    latestData = {
      raw: data,
      relevant: relevantNow,
      liveMatches,
      fetchedAt: startedAt,
      pollCount,
      liveCount: liveMatches.length,
      lastError: null,
      hydrated: false,
    };

    // Persist the successful payload so the authoritative state survives
    // restarts. Best-effort; never blocks or fails the poll.
    saveProviderSnapshot(relevantNow, startedAt, liveMatches.length);

    console.log(
      `[cricketPolling] Poll #${pollCount} succeeded — ${matchCount} total, ${liveMatches.length} live — ${changed ? "changed" : "unchanged"}`
    );

    if (changed) {
      publishLiveUpdates(relevantNow);
      pollingEmitter.emit("live:update", liveMatches);
    }

    // Persist provider state into the Match collection, reusing the payload
    // fetched above (no extra CricAPI calls). Failures never break polling.
    try {
      const syncResult = await syncMatchesFromProvider(relevantNow, {
        // Only treat the feed as authoritative when the provider actually
        // returned a data array (a malformed payload must not demote
        // everything to completed).
        feedAuthoritative: Array.isArray(data.data),
      });
      const unresolved = syncResult.unresolvedTeams?.length
        ? ` | unresolved teams: ${syncResult.unresolvedTeams.join(", ")}`
        : "";
      console.log(
        `[cricketPolling] Match sync #${pollCount} — ${syncResult.created} created, ${syncResult.updated} updated, ${syncResult.synced} unchanged, ${syncResult.skipped} skipped, ${syncResult.staleDemoted} stale demoted${unresolved}`
      );
    } catch (syncError) {
      console.error("[cricketPolling] Match sync failed:", syncError.message);
    }

    return { success: true, matchCount, liveCount: liveMatches.length, changed, data };
  } catch (error) {
    lastError = error.message;
    if (previousLastError !== lastError) {
  publishStatusUpdate(lastError);
  previousLastError = lastError;
}
    console.error(`[cricketPolling] Poll #${pollCount} failed:`, error.message);
    return { success: false, error: error.message };
  } finally {
    isRunning = false;
  }
}

function scheduleNext() {
  if (timerId) return;
  const interval = getInterval();
  timerId = setTimeout(async () => {
    timerId = null;
    await pollOnce();
    scheduleNext();
  }, interval);
}

/**
 * Reload the last successful provider snapshot from MongoDB so restarts
 * (e.g. Render dyno cycling) don't lose the authoritative match states.
 * The hydrated snapshot is flagged stale until the next successful poll.
 */
async function hydrateFromStorage() {
  if (latestData) return;
  const snapshot = await loadProviderSnapshot();
  if (!snapshot || latestData) return;
  if (!Array.isArray(snapshot.matches) || snapshot.matches.length === 0) return;

  const relevant = extractRelevantMatches({ data: snapshot.matches });
  const liveMatches = relevant.filter((m) => m.matchState === "live");
  const fetchedAt =
    snapshot.fetchedAt instanceof Date
      ? snapshot.fetchedAt.toISOString()
      : snapshot.fetchedAt || null;

  latestData = {
    raw: null,
    relevant,
    liveMatches,
    fetchedAt,
    pollCount: 0,
    liveCount: liveMatches.length,
    lastError: null,
    hydrated: true,
  };
  console.log(
    `[cricketPolling] Hydrated cached snapshot from ${fetchedAt} — ${relevant.length} matches, ${liveMatches.length} live (stale until next poll)`
  );
}

/**
 * Authoritative provider state used by every read path.
 *
 * - available=false: no successful provider response exists — callers
 *   must NOT claim "zero live matches"; report unavailable/stale instead.
 * - stale=true: data comes from cache (hydrated snapshot) or the most
 *   recent poll failed — present it with its last successful sync time.
 */
function getAuthoritativeState() {
  if (!latestData) {
    return {
      available: false,
      stale: true,
      fetchedAt: null,
      lastError,
      liveMatches: [],
      relevant: [],
    };
  }
  const stale = latestData.hydrated === true || lastError !== null;
  return {
    available: true,
    stale,
    fetchedAt: latestData.fetchedAt || null,
    lastError,
    liveMatches: latestData.liveMatches || [],
    relevant: latestData.relevant || [],
  };
}

function start() {
  if (timerId) {
    console.log("[cricketPolling] Already running");
    return;
  }
  const interval = getInterval();
  console.log(`[cricketPolling] Starting — interval ${interval}ms`);
  // Non-blocking: the first poll decides the real state; the hydrated
  // snapshot only covers the gap if the poll fails.
  hydrateFromStorage().catch((error) =>
    console.warn("[cricketPolling] Snapshot hydration failed:", error.message)
  );
  pollOnce().then(() => scheduleNext());
}

function stop() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  console.log("[cricketPolling] Stopped");
}

function getLatest() {
  return latestData;
}

function getLastError() {
  return lastError;
}

export { start, stop, pollOnce, getLatest, getLastError, getAuthoritativeState, pollingEmitter };
