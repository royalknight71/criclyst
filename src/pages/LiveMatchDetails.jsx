/**
 * LiveMatchDetails page (route: /live/:matchId).
 *
 * Displays a detailed scorecard for a single match, including:
 * - Match header with live status, team logos, scores, venue, toss
 * - Current batsmen / bowler (from live data)
 * - Full innings batting & bowling scorecards (from scorecard API)
 * - Recent balls / commentary (if available from the API)
 * - Real-time score updates via Socket.IO match room
 *
 * The scorecard API is fetched as a non-critical supplement.
 * If it fails (e.g. "Scorecard not found"), the page still shows
 * the live data received through Socket.IO.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../services/socket";
import api from "../api/axios";
import {
  FaArrowLeft,
  FaLocationDot,
  FaCalendarDays,
  FaCoins,
  FaSatelliteDish,
  FaCircleInfo,
} from "react-icons/fa6";

const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/* ─── Sub-components ─────────────────────────────────────────── */

function MatchStatusBadge({ match }) {
  if (match.matchStarted === true && match.matchEnded !== true) {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
          Live
        </span>
      </div>
    );
  }
  if (match.matchEnded === true) {
    return (
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Finished
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
      {match.status || "Upcoming"}
    </span>
  );
}

function ScoreBlock({ score }) {
  if (!score) {
    return <p className="mt-1 text-sm text-slate-500">Yet to bat</p>;
  }
  return (
    <div>
      <p className="mt-1 text-3xl font-black text-cyan-400">
        {score.r}/{score.w}
        <span className="text-sm font-normal text-slate-400">
          {" "}({score.o} ov)
        </span>
      </p>
      {score.inning && (
        <p className="mt-0.5 text-xs text-slate-500">{score.inning}</p>
      )}
    </div>
  );
}

function BattingCard({ batting }) {
  if (!batting || batting.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-xs uppercase text-slate-400">
            <th className="px-3 py-2 text-left">Batsman</th>
            <th className="px-3 py-2 text-center">R</th>
            <th className="px-3 py-2 text-center">B</th>
            <th className="px-3 py-2 text-center">4s</th>
            <th className="px-3 py-2 text-center">6s</th>
            <th className="px-3 py-2 text-center">SR</th>
            <th className="px-3 py-2 text-left">Dismissal</th>
          </tr>
        </thead>
        <tbody>
          {batting.map((b, i) => (
            <tr
              key={b.batsman?.id || i}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="px-3 py-2 font-medium text-white">
                {b.batsman?.name || "Unknown"}
              </td>
              <td className="px-3 py-2 text-center font-bold text-cyan-400">
                {b.r}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">{b.b}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b["4s"]}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b["6s"]}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b.sr}</td>
              <td className="px-3 py-2 text-xs text-slate-400">
                {b["dismissal-text"] || "not out"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BowlingCard({ bowling }) {
  if (!bowling || bowling.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-xs uppercase text-slate-400">
            <th className="px-3 py-2 text-left">Bowler</th>
            <th className="px-3 py-2 text-center">O</th>
            <th className="px-3 py-2 text-center">M</th>
            <th className="px-3 py-2 text-center">R</th>
            <th className="px-3 py-2 text-center">W</th>
            <th className="px-3 py-2 text-center">Econ</th>
            <th className="px-3 py-2 text-center">WD</th>
            <th className="px-3 py-2 text-center">NB</th>
          </tr>
        </thead>
        <tbody>
          {bowling.map((b, i) => (
            <tr
              key={b.bowler?.id || i}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="px-3 py-2 font-medium text-white">
                {b.bowler?.name || "Unknown"}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">{b.o}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b.m}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b.r}</td>
              <td className="px-3 py-2 text-center font-bold text-cyan-400">
                {b.w}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">{b.eco}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b.wd}</td>
              <td className="px-3 py-2 text-center text-slate-300">{b.nb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InningSection({ inning }) {
  const inningName = inning.inning || "Unknown Inning";
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">{inningName}</h3>
      <div className="space-y-4">
        {inning.batting && inning.batting.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Batting
            </h4>
            <BattingCard batting={inning.batting} />
          </div>
        )}
        {inning.bowling && inning.bowling.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Bowling
            </h4>
            <BowlingCard bowling={inning.bowling} />
          </div>
        )}
      </div>
    </div>
  );
}

function CommentarySection({ commentary }) {
  if (!Array.isArray(commentary) || commentary.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
        <h3 className="mb-2 text-lg font-bold text-white">Recent Commentary</h3>
        <p className="text-sm text-slate-400">
          Ball-by-ball commentary is not available for this match.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
      <h3 className="mb-3 text-lg font-bold text-white">Recent Commentary</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {commentary.map((item, i) => (
          <div key={i} className="border-b border-slate-800 pb-2 last:border-0">
            <p className="text-sm text-slate-300">
              {item.text || item.comment || item.event || JSON.stringify(item)}
            </p>
            {item.ball && (
              <span className="text-xs text-slate-500">Ball {item.ball}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */

function LiveMatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [scorecardData, setScorecardData] = useState(null);
  const [scorecardError, setScorecardError] = useState(null);
  const [scorecardLoading, setScorecardLoading] = useState(true);
  const [liveScore, setLiveScore] = useState(null);
  const [connected, setConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadScorecard() {
      try {
        const res = await api.get(`/live-cricket/match/${matchId}/scorecard`);
        if (cancelled) return;
        if (res.data.success) {
          setScorecardData(res.data.data);
          setScorecardError(null);
        } else {
          setScorecardError(res.data.message || "Scorecard not available");
        }
      } catch (err) {
        if (cancelled) return;
        const msg = err.response?.data?.message || err.message || "Failed to load scorecard";
        setScorecardError(msg);
      } finally {
        if (!cancelled) setScorecardLoading(false);
      }
    }
    loadScorecard();
    return () => { cancelled = true; };
  }, [matchId, retryCount]);

  // Socket.IO live updates
  useEffect(() => {
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onConnectError = () => setConnected(false);

    const onLiveUpdate = (data) => {
      if (Array.isArray(data)) {
        const match = data.find((m) => m.id === matchId);
        if (match) setLiveScore(match);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("live:update", onLiveUpdate);

    socket.emit("join:match", { matchId });

    return () => {
      socket.emit("leave:match", { matchId });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("live:update", onLiveUpdate);
      socket.disconnect();
    };
  }, [matchId]);

  // Merge live data + scorecard data for display
  const ls = liveScore || {};
  const sc = scorecardData?.data || null;

  const matchName = sc?.name || ls.name || "Match Details";
  const matchType = sc?.matchType || ls.matchType || "";
  const venue = sc?.venue || ls.venue || "";
  const matchDate = sc?.date || ls.date || "";
  const matchStatus = ls.status || sc?.status || "";
  const teams = ls.teams || sc?.teams || [];
  const teamInfo = ls.teamInfo || sc?.teamInfo || [];
  const scoreArr = ls.score || sc?.score || [];
  const scorecard = sc?.scorecard || [];

  const teamAInfo = teamInfo[0] || null;
  const teamBInfo = teamInfo[1] || null;
  const teamAScore = scoreArr.find((s) => s.inning?.startsWith(teams[0]));
  const teamBScore = scoreArr.find((s) => s.inning?.startsWith(teams[1]));

  const tossWinner = sc?.tossWinner || ls.tossWinner;
  const tossChoice = sc?.tossChoice || ls.tossChoice;
  const tossInfo = tossWinner
    ? `${tossWinner} won the toss and chose to ${tossChoice || "bat/bowl"}`
    : null;
  const resultInfo = sc?.matchWinner
    ? `${sc.matchWinner} won`
    : matchStatus;

  const commentary = sc?.commentary || sc?.recentBalls || null;

  // Determine if match is live from either source
  const isMatchLive =
    (ls.matchStarted === true && ls.matchEnded !== true) ||
    (sc?.matchStarted === true && sc?.matchEnded !== true);

  return (
    <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/live-scores")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <FaArrowLeft /> Back to Live Scores
        </button>

        {/* Scorecard loading state — non-blocking, shown alongside live data */}
        {scorecardLoading && !liveScore && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
              <p className="text-slate-400">Loading match data...</p>
            </div>
          </div>
        )}

        {/* Fatal error only if we have neither live data nor scorecard */}
        {scorecardError && !liveScore && !scorecardData && (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4">
            <FaCircleInfo className="text-4xl text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Scorecard Unavailable</h2>
            <p className="max-w-md text-center text-slate-400">{scorecardError}</p>
            <p className="max-w-md text-center text-xs text-slate-500">
              The detailed scorecard for this match could not be loaded. This can
              happen for matches that haven&apos;t started, are very old, or are in a
              format the provider doesn&apos;t fully support.
            </p>
            <button
              onClick={() => { setScorecardError(null); setScorecardLoading(true); setRetryCount((c) => c + 1); }}
              className="mt-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Match content — shown whenever we have live data OR scorecard */}
        {(liveScore || scorecardData) && (
          <>
            {/* ─── Match Header ────────────────────────── */}
            <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl">
              {/* Status + type */}
              <div className="flex items-center justify-between mb-4">
                <MatchStatusBadge match={ls.matchStarted !== undefined ? ls : sc} />
                <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-semibold uppercase text-slate-300">
                  {matchType || "--"}
                </span>
              </div>

              {/* Match name */}
              <h1 className="mb-4 text-xl font-bold text-white">{matchName}</h1>

              {/* Scoreboard */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                {/* Team A */}
                <div className="text-center">
                  {teamAInfo?.img ? (
                    <img
                      src={teamAInfo.img}
                      alt={teams[0]}
                      className="mx-auto mb-2 h-12 w-12 rounded-md border border-slate-600 object-cover"
                    />
                  ) : (
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-md border border-cyan-500/40 bg-slate-900 text-sm font-bold text-cyan-400">
                      {teamAInfo?.shortname || teams[0]?.charAt(0) || "?"}
                    </div>
                  )}
                  <p className="text-sm font-bold text-white">
                    {teamAInfo?.shortname || teams[0] || "--"}
                  </p>
                  <ScoreBlock score={teamAScore} />
                </div>

                {/* VS */}
                <div className="text-3xl font-black text-slate-600">VS</div>

                {/* Team B */}
                <div className="text-center">
                  {teamBInfo?.img ? (
                    <img
                      src={teamBInfo.img}
                      alt={teams[1]}
                      className="mx-auto mb-2 h-12 w-12 rounded-md border border-slate-600 object-cover"
                    />
                  ) : (
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-md border border-purple-500/40 bg-slate-900 text-sm font-bold text-purple-400">
                      {teamBInfo?.shortname || teams[1]?.charAt(0) || "?"}
                    </div>
                  )}
                  <p className="text-sm font-bold text-white">
                    {teamBInfo?.shortname || teams[1] || "--"}
                  </p>
                  <ScoreBlock score={teamBScore} />
                </div>
              </div>

              {/* Status / Result */}
              <div className="mt-4 h-px bg-slate-700/50" />
              <p className="mt-3 text-center text-sm font-medium text-slate-300">
                {resultInfo || "Status unavailable"}
              </p>

              {/* Match info */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                {venue && (
                  <div className="flex items-center gap-1.5">
                    <FaLocationDot className="text-cyan-400" />
                    <span>{venue}</span>
                  </div>
                )}
                {matchDate && (
                  <div className="flex items-center gap-1.5">
                    <FaCalendarDays className="text-cyan-400" />
                    <span>{formatDate(matchDate)}</span>
                  </div>
                )}
                {tossInfo && (
                  <div className="flex items-center gap-1.5">
                    <FaCoins className="text-cyan-400" />
                    <span>{tossInfo}</span>
                  </div>
                )}
              </div>

              {/* Live connection indicator */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      connected ? "bg-green-400" : "bg-slate-500"
                    }`}
                  />
                  <span className="text-xs text-slate-400">
                    {isMatchLive
                      ? connected
                        ? "Live updates active"
                        : "Reconnecting..."
                      : "Match ended"}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── Scorecard ────────────────────────────── */}
            {scorecard.length > 0 ? (
              <div className="mt-8 space-y-6">
                <h2 className="text-2xl font-bold text-white">Scorecard</h2>
                {scorecard.map((inning, i) => (
                  <InningSection key={inning.inning || i} inning={inning} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FaSatelliteDish className="text-lg text-slate-500" />
                  <h3 className="text-lg font-bold text-white">Scorecard</h3>
                </div>
                {scorecardError ? (
                  <div>
                    <p className="text-sm text-yellow-400 mb-1">
                      Detailed scorecard not available
                    </p>
                    <p className="text-xs text-slate-500">
                      {scorecardError}. The live score summary above is still updating
                      in real time.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Detailed scorecard is not yet available for this match.
                  </p>
                )}
              </div>
            )}

            {/* ─── Commentary / Recent Balls ────────────── */}
            <div className="mt-6">
              <CommentarySection commentary={commentary} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default LiveMatchDetails;
