/**
 * LiveScores page (route: /live-scores).
 *
 * Connects to the Criclyst Socket.IO backend and displays real-time
 * cricket match data from the external CricketData API.
 *
 * Events:
 *   - "live:matches" — initial full dataset on connect
 *   - "live:update"  — incremental update when polling detects changes
 *   - "live:status"  — polling/API error state changes
 *
 * The component manages connection state, displays loading / empty /
 * error states, and renders a responsive grid of LiveMatchCards.
 */

import { useState, useEffect, useCallback } from "react";
import socket from "../services/socket";
import LiveMatchCard from "../components/live/LiveMatchCard";
import { FaSatelliteDish } from "react-icons/fa";

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

function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const handleLiveMatches = useCallback((payload) => {
    setLoading(false);

    if (
      payload &&
      typeof payload === "object" &&
      "matches" in payload
    ) {
      setDataAvailable(payload.available);
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setLastError(payload.lastError || null);
      setFetchedAt(payload.fetchedAt || null);
    } else if (Array.isArray(payload)) {
      setDataAvailable(true);
      setMatches(payload);
    }
  }, []);

  const handleLiveUpdate = useCallback((data) => {
    if (Array.isArray(data)) {
      setMatches(data);
    } else if (
      data &&
      typeof data === "object" &&
      "matches" in data
    ) {
      setMatches(Array.isArray(data.matches) ? data.matches : []);
    }

    setLoading(false);
    setDataAvailable(true);
  }, []);

  // Handle polling/API status changes from the backend.
  const handleLiveStatus = useCallback((status) => {
    setLastError(status?.lastError ?? null);
  }, []);

  useEffect(() => {
    socket.connect();

    let initialDataTimeout;

    const onConnect = () => {
      setConnected(true);

      // Prevent the page from staying in "Connecting..." forever
      // if the initial live:matches event is not received.
      initialDataTimeout = setTimeout(() => {
        setLoading((currentLoading) => {
          if (currentLoading) {
            setDataAvailable(false);
          }
          return false;
        });
      }, 15000);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onConnectError = () => {
      setConnected(false);
      setLoading(false);
      setLastError("Unable to connect to live score server");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("live:matches", handleLiveMatches);
    socket.on("live:update", handleLiveUpdate);
    socket.on("live:status", handleLiveStatus);

    return () => {
      if (initialDataTimeout) {
        clearTimeout(initialDataTimeout);
      }

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("live:matches", handleLiveMatches);
      socket.off("live:update", handleLiveUpdate);
      socket.off("live:status", handleLiveStatus);
      socket.disconnect();
    };
  }, [handleLiveMatches, handleLiveUpdate, handleLiveStatus]);

  // Defense-in-depth: only show genuinely live matches
  const liveMatches = matches.filter(isLive);

  const statusText = !connected
    ? "Disconnected"
    : loading
      ? "Connecting..."
      : lastError
        ? "API Error"
        : "Connected";

  const statusColor = !connected
    ? "bg-slate-500"
    : loading
      ? "bg-yellow-400"
      : lastError
        ? "bg-red-400"
        : "bg-green-400";

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
      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full animate-pulse ${statusColor}`}
          />

          <span className="text-sm text-slate-400">
            {statusText}
          </span>

          {lastError && (
            <span
              className="ml-2 text-xs text-red-400"
              title={lastError}
            >
              (polling error)
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
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />

              <p className="text-slate-400">
                Connecting to live scores...
              </p>
            </div>
          </div>
        ) : lastError && !dataAvailable ? (
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
              {lastError}
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />

              <span className="text-sm text-slate-300">
                Retrying in the background...
              </span>
            </div>
          </div>
        ) : liveMatches.length === 0 ? (
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
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default LiveScores;