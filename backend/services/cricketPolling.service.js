import { EventEmitter } from "node:events";
import { fetchCurrentMatches } from "./cricketApi.service.js";

const DEFAULT_POLL_INTERVAL_MS = 1800000; // 30 minutes

let latestData = null;
let timerId = null;
let isRunning = false;
let pollCount = 0;

const pollingEmitter = new EventEmitter();
pollingEmitter.setMaxListeners(20);

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

  try {
    const data = await fetchCurrentMatches();
    const matchCount = Array.isArray(data.data) ? data.data.length : 0;
    const relevantNow = extractRelevantMatches(data);
    const changed = hasChanged(latestData?.relevant, relevantNow);

    latestData = {
      raw: data,
      relevant: relevantNow,
      fetchedAt: new Date().toISOString(),
      pollCount,
    };

    console.log(
      `[cricketPolling] Poll #${pollCount} succeeded — ${matchCount} matches — ${changed ? "changed" : "unchanged"}`
    );

    if (changed) {
      pollingEmitter.emit("live:update", relevantNow);
    }

    return { success: true, matchCount, changed, data };
  } catch (error) {
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

export { start, stop, pollOnce, getLatest, pollingEmitter };
