import { EventEmitter } from "node:events";
import { fetchCurrentMatches } from "./cricketApi.service.js";
import { publishLiveUpdates, publishStatusUpdate } from "./redisPubSub.service.js";

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

/**
 * Determine match state from CricAPI fields.
 *
 * Uses matchStarted / matchEnded booleans first, then falls back
 * to the status string for edge-cases where the booleans are missing.
 *
 * @param {Object} match – raw match object from CricAPI
 * @returns {"live"|"completed"|"upcoming"}
 */
export function getMatchState(match) {
  if (!match) return "unknown";

  // Explicit booleans are the most reliable signal
  if (match.matchStarted === true && match.matchEnded !== true) {
    return "live";
  }
  if (match.matchEnded === true) {
    return "completed";
  }
  if (match.matchStarted === false) {
    return "upcoming";
  }

  // Fallback: parse the status string
  const s = (match.status || "").toLowerCase();
  if (s.includes("live") || s.includes("in progress") || s.includes("innings break")) {
    return "live";
  }
  if (s.includes("complete") || s.includes("result") || s.includes("won") || s.includes("tied") || s.includes("draw") || s.includes("abandon")) {
    return "completed";
  }

  // If started flag is missing but score exists, treat as live
  if (match.matchStarted === undefined && Array.isArray(match.score) && match.score.length > 0) {
    return "live";
  }

  return "upcoming";
}

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
    };

    console.log(
      `[cricketPolling] Poll #${pollCount} succeeded — ${matchCount} total, ${liveMatches.length} live — ${changed ? "changed" : "unchanged"}`
    );

    if (changed) {
      publishLiveUpdates(relevantNow);
      pollingEmitter.emit("live:update", liveMatches);
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

function start() {
  if (timerId) {
    console.log("[cricketPolling] Already running");
    return;
  }
  const interval = getInterval();
  console.log(`[cricketPolling] Starting — interval ${interval}ms`);
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

export { start, stop, pollOnce, getLatest, getLastError, pollingEmitter };
