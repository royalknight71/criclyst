/**
 * LiveScores page (route: /live-scores).
 *
 * Connects to the Criclyst Socket.IO backend and displays real-time
 * cricket match data from the external CricketData API.
 *
 * Events:
 *   - "live:matches" — initial full dataset on connect
 *   - "live:update"  — incremental update when polling detects changes
 *
 * The component manages connection state, displays loading / empty /
 * error states, and renders a responsive grid of LiveMatchCards.
 */

import { useState, useEffect } from "react";
import socket from "../services/socket";
import LiveMatchCard from "../components/live/LiveMatchCard";
import { FaSatelliteDish } from "react-icons/fa";

function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(false);

  useEffect(() => {
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnectError = () => setConnected(false);

    const onLiveMatches = (payload) => {
      setLoading(false);
      if (payload && typeof payload === "object" && "matches" in payload) {
        setDataAvailable(payload.available);
        setMatches(payload.matches);
      } else {
        setDataAvailable(true);
        setMatches(payload);
      }
    };

    const onLiveUpdate = (data) => {
      setMatches(data);
      setLoading(false);
      setDataAvailable(true);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("live:matches", onLiveMatches);
    socket.on("live:update", onLiveUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("live:matches", onLiveMatches);
      socket.off("live:update", onLiveUpdate);
      socket.disconnect();
    };
  }, []);

  const connectionLabel = connected ? "Connected" : loading ? "Connecting..." : "Disconnected";

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
            className={`h-2.5 w-2.5 rounded-full ${
              connected ? "bg-green-400 animate-pulse" : "bg-slate-500"
            }`}
          />
          <span className="text-sm text-slate-400">{connectionLabel}</span>
        </div>
        <span className="text-sm text-slate-500">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* Content */}
      <div className="mx-auto mt-8 max-w-7xl">
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
              <p className="text-slate-400">Connecting to live scores...</p>
            </div>
          </div>
        ) : !dataAvailable ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10">
              <FaSatelliteDish className="text-4xl text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Live Data Temporarily Unavailable</h2>
            <p className="max-w-md text-center text-slate-400">
              The live score feed is currently unavailable. Data will appear
              automatically once the connection is restored.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-sm text-slate-300">
                Retrying in the background...
              </span>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
              <FaSatelliteDish className="text-4xl text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">No Live Matches</h2>
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
            {matches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default LiveScores;
