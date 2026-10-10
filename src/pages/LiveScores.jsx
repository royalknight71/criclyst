/**
 * LiveScores page (route: /live-scores).
 *
 * Connects to the shared Criclyst Socket.IO backend and displays real-time
 * cricket match data from the external CricketData (CricAPI) provider.
 *
 * Events:
 *   - "live:matches" — initial full dataset on connect
 *   - "live:update"  — incremental update when polling detects changes
 *   - "live:status"  — polling/API error state changes
 *
 * The component:
 *   - never disconnects the shared socket singleton on unmount (that would
 *     kill live updates and private notifications for other components)
 *   - always resolves its loading state via a mount-time failsafe
 *   - renders live matches separately from completed/upcoming matches
 *   - distinguishes connection failures from provider/polling failures
 */

import { useState, useEffect, useCallback, useRef } from "react";
import socket from "../services/socket";
import LiveMatchCard from "../components/live/LiveMatchCard";
import { FaSatelliteDish, FaPlugCircleXmark } from "react-icons/fa6";

function isLive(match) {
  if (match.matchStarted === true && match.matchEnded !== true) return true;
  if (match.matchState === "live") return true;
  const s = (match.status || "").toLowerCase();
  if (
    s.includes("live") ||
    s.includes("in progress") ||
    s.includes("innings break")
  ) {
    return true;
  }
  return false;
}

/** Drop duplicate provider rows so the same match never renders twice. */
function dedupeMatches(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const match of list) {
    const key = match?.id || match?.name;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(match);
  }
  return out;
}

const CONNECT_DATA_TIMEOUT_MS = 15000;

function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [providerError, setProviderError] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const receivedDataRef = useRef(false);

  const handleLiveMatches = useCallback((payload) => {
    receivedDataRef.current = true;
    setLoading(false);

    if (
      payload &&
      typeof payload === "object" &&
      "matches" in payload
    ) {
      setDataAvailable(payload.available !== false);
      setMatches(dedupeMatches(payload.matches));
      setProviderError(payload.lastError || null);
      setFetchedAt(payload.fetchedAt || null);
      setConnectionError(null);
    } else if (Array.isArray(payload)) {
      setDataAvailable(true);
      setMatches(dedupeMatches(payload));
      setConnectionError(null);
    }
  }, []);

  const handleLiveUpdate = useCallback((data) => {
    receivedDataRef.current = true;
    if (Array.isArray(data)) {
      setMatches(dedupeMatches(data));
    } else if (
      data &&
      typeof data === "object" &&
      "matches" in data
    ) {
      setMatches(dedupeMatches(data.matches));
    }

    setLoading(false);
    setDataAvailable(true);
    setFetchedAt(new Date().toISOString());
  }, []);

  // Handle polling/API status changes from the backend.
  const handleLiveStatus = useCallback((status) => {
    setProviderError(status?.lastError ?? null);
  }, []);

  useEffect(() => {
    socket.connect();

    // Failsafe: never leave the page stuck on "Connecting to live scores..."
    // even if neither "connect" nor "connect_error" ever fires.
    const failsafe = setTimeout(() => {
      setLoading(false);
      if (!receivedDataRef.current && !socket.connected) {
        setConnectionError("No response from the live score server");
      }
    }, CONNECT_DATA_TIMEOUT_MS);

    const onConnect = () => {
      setConnected(true);
      setConnectionError(null);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onConnectError = (err) => {
      setConnected(false);
      setConnectionError(
        err?.message
          ? `Unable to connect: ${err.message}`
          : "Unable to connect to live score server"
      );
      setLoading(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("live:matches", handleLiveMatches);
    socket.on("live:update", handleLiveUpdate);
    socket.on("live:status", handleLiveStatus);

    // Socket may already be connected (shared singleton reused across pages).
    // Deferred so no setState runs synchronously inside the effect body.
    const syncConnected = setTimeout(() => {
      if (socket.connected) setConnected(true);
    }, 0);

    return () => {
      clearTimeout(failsafe);
      clearTimeout(syncConnected);

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("live:matches", handleLiveMatches);
      socket.off("live:update", handleLiveUpdate);
      socket.off("live:status", handleLiveStatus);
      // Deliberately NOT calling socket.disconnect(): this is a shared
      // app-wide singleton. Disconnecting here would tear down live scores
      // and private notifications for every other component.
    };
  }, [handleLiveMatches, handleLiveUpdate, handleLiveStatus]);

  // Split genuinely live matches from completed/upcoming ones.
  const liveMatches = matches.filter(isLive);
  const otherMatches = matches.filter((m) => !isLive(m));

  const statusText = !connected
    ? "Disconnected"
    : loading
      ? "Connecting..."
      : providerError
        ? "API Error"
        : "Connected";

  const statusColor = !connected
    ? "bg-slate-500"
    : loading
      ? "bg-yellow-400"
      : providerError
        ? "bg-red-400"
        : "bg-green-400";

  const showSpinner = loading && !connectionError;
  const showConnectionError =
    !showSpinner && !dataAvailable && (connectionError || (!connected && !matches.length));
  const showProviderError =
    !showSpinner && !showConnectionError && providerError && !dataAvailable;
  const showEmpty =
    !showSpinner && !showConnectionError && !showProviderError && matches.length === 0;

  return (
    <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold tracking-[0.35em] text-cyan-400">
          REAL-TIME CRICKET
        </p>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Live <span className="text-red-500">Scores</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
          Real-time match data powered by live polling. Scores update
          automatically — no page refresh needed.
        </p>
      </section>

      {/* Connection Status */}
      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full animate-pulse ${statusColor}`}
          />

          <span className="text-sm text-slate-400">
            {statusText}
          </span>

          {providerError && (
            <span
              className="ml-2 text-xs text-red-400"
              title={providerError}
            >
              (polling error)
            </span>
          )}

          {connectionError && (
            <span
              className="ml-2 text-xs text-red-400"
              title={connectionError}
            >
              (connection error)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {fetchedAt && (
            <span className="text-xs text-slate-600">
              Updated {new Date(fetchedAt).toLocaleTimeString()}
            </span>
          )}

          <span className="text-sm text-slate-500">
            {liveMatches.length} live match
            {liveMatches.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto mt-8 max-w-7xl">
        {showSpinner ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />

              <p className="text-slate-400">
                Connecting to live scores...
              </p>
            </div>
          </div>
        ) : showConnectionError ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <FaPlugCircleXmark className="text-4xl text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Live Score Server Unreachable
            </h2>

            <p className="max-w-md text-center text-slate-400">
              Could not reach the live score server. It may be restarting —
              reconnection happens automatically.
            </p>

            <p className="max-w-md text-center text-xs text-red-400/80">
              {connectionError}
            </p>

            <button
              onClick={() => {
                setConnectionError(null);
                setLoading(true);
                receivedDataRef.current = false;
                socket.connect();
              }}
              className="mt-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Retry Now
            </button>
          </div>
        ) : showProviderError ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <FaSatelliteDish className="text-4xl text-red-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Live Data Temporarily Unavailable
            </h2>

            <p className="max-w-md text-center text-slate-400">
              The live score feed could not be reached. The data provider may
              be temporarily unavailable.
            </p>

            <p className="max-w-md text-center text-xs text-red-400/80">
              {providerError}
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />

              <span className="text-sm text-slate-300">
                Retrying in the background...
              </span>
            </div>
          </div>
        ) : showEmpty ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
              <FaSatelliteDish className="text-4xl text-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              No Live Matches Right Now
            </h2>

            <p className="max-w-md text-center text-slate-400">
              No matches are currently in progress. Live scores will appear
              automatically once a match begins.
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

              <span className="text-sm text-slate-300">
                Monitoring live matches...
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* ─── Live matches ─────────────────────────── */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-bold text-white">Live Now</h2>
                <span className="text-sm text-slate-500">
                  {liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""}
                </span>
              </div>

              {liveMatches.length === 0 ? (
                <div className="rounded-2xl border border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
                  <p className="text-slate-400">
                    No matches are currently in progress. Live scores will
                    appear here automatically once a match begins.
                  </p>
                </div>
              ) : (
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {liveMatches.map((match) => (
                    <LiveMatchCard key={match.id || match.name} match={match} />
                  ))}
                </section>
              )}
            </section>

            {/* ─── Completed / upcoming matches ────────── */}
            {otherMatches.length > 0 && (
              <section>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">
                    Other Matches
                  </h2>
                  <span className="text-sm text-slate-500">
                    completed &amp; upcoming
                  </span>
                </div>

                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherMatches.map((match) => (
                    <LiveMatchCard key={match.id || match.name} match={match} />
                  ))}
                </section>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default LiveScores;
