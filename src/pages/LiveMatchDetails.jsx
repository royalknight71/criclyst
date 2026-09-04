/**
 * LiveMatchDetails page (route: /live/:matchId).
 *
 * Displays a detailed scorecard for a single match, including:
 * - Match info (venue, date, toss, result)
 * - Inning-by-inning batting and bowling tables
 * - Real-time score updates via Socket.IO match room
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../services/socket";
import api from "../api/axios";
import {
  FaArrowLeft,
  FaLocationDot,
  FaCalendarDays,
  FaCoins,
  FaSatelliteDish,
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

function BattingCard({ batting, teamName }) {
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
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Batting
          </h4>
          <BattingCard batting={inning.batting} />
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bowling
          </h4>
          <BowlingCard bowling={inning.bowling} />
        </div>
      </div>
    </div>
  );
}

function LiveMatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [liveScore, setLiveScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const fetchScorecard = useCallback(async () => {
    try {
      const res = await api.get(`/live-cricket/match/${matchId}/scorecard`);
      if (res.data.success) {
        setMatchData(res.data.data);
      } else {
        setError(res.data.message || "Failed to load scorecard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load scorecard");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchScorecard();
  }, [fetchScorecard]);

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

  const matchInfo = matchData?.data || null;
  const scorecard = matchInfo?.scorecard || [];
  const tossInfo = matchInfo?.tossWinner
    ? `${matchInfo.tossWinner} won the toss and chose to ${matchInfo.tossChoice}`
    : null;
  const resultInfo = matchInfo?.matchWinner
    ? `${matchInfo.matchWinner} won`
    : matchInfo?.status || "";

  const liveScoreData = liveScore || {};
  const liveTeams = liveScoreData.teams || matchInfo?.teams || [];
  const liveTeamInfo = liveScoreData.teamInfo || matchInfo?.teamInfo || [];
  const liveScoreArr = liveScoreData.score || matchInfo?.score || [];

  const teamAInfo = liveTeamInfo[0] || null;
  const teamBInfo = liveTeamInfo[1] || null;
  const teamAScore = liveScoreArr.find((s) => s.inning?.startsWith(liveTeams[0]));
  const teamBScore = liveScoreArr.find((s) => s.inning?.startsWith(liveTeams[1]));

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400" />
            <p className="text-slate-400">Loading scorecard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080d1c] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate("/live-scores")}
            className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <FaArrowLeft /> Back to Live Scores
          </button>
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold text-white">Error Loading Match</h2>
            <p className="text-slate-400">{error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); fetchScorecard(); }}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

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

        {/* Match Header */}
        <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl">
          {/* Live badge + type */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {liveScoreData.matchStarted && !liveScoreData.matchEnded && (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
                    Live
                  </span>
                </>
              )}
              {liveScoreData.matchEnded && (
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Finished
                </span>
              )}
            </div>
            <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-semibold uppercase text-slate-300">
              {matchInfo?.matchType || liveScoreData.matchType || "--"}
            </span>
          </div>

          {/* Match name */}
          <h1 className="mb-4 text-xl font-bold text-white">
            {matchInfo?.name || liveScoreData.name || "Match Details"}
          </h1>

          {/* Scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Team A */}
            <div className="text-center">
              {teamAInfo?.img ? (
                <img
                  src={teamAInfo.img}
                  alt={liveTeams[0]}
                  className="mx-auto mb-2 h-12 w-12 rounded-md border border-slate-600 object-cover"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-md border border-cyan-500/40 bg-slate-900 text-sm font-bold text-cyan-400">
                  {teamAInfo?.shortname || liveTeams[0]?.charAt(0) || "?"}
                </div>
              )}
              <p className="text-sm font-bold text-white">
                {teamAInfo?.shortname || liveTeams[0] || "--"}
              </p>
              {teamAScore ? (
                <p className="mt-1 text-3xl font-black text-cyan-400">
                  {teamAScore.r}/{teamAScore.w}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}({teamAScore.o} ov)
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Yet to bat</p>
              )}
            </div>

            {/* VS */}
            <div className="text-3xl font-black text-slate-600">VS</div>

            {/* Team B */}
            <div className="text-center">
              {teamBInfo?.img ? (
                <img
                  src={teamBInfo.img}
                  alt={liveTeams[1]}
                  className="mx-auto mb-2 h-12 w-12 rounded-md border border-slate-600 object-cover"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-md border border-purple-500/40 bg-slate-900 text-sm font-bold text-purple-400">
                  {teamBInfo?.shortname || liveTeams[1]?.charAt(0) || "?"}
                </div>
              )}
              <p className="text-sm font-bold text-white">
                {teamBInfo?.shortname || liveTeams[1] || "--"}
              </p>
              {teamBScore ? (
                <p className="mt-1 text-3xl font-black text-cyan-400">
                  {teamBScore.r}/{teamBScore.w}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}({teamBScore.o} ov)
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Yet to bat</p>
              )}
            </div>
          </div>

          {/* Status / Result */}
          <div className="mt-4 h-px bg-slate-700/50" />
          <p className="mt-3 text-center text-sm font-medium text-slate-300">
            {liveScoreData.status || resultInfo || "Status unavailable"}
          </p>

          {/* Match info */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
            {matchInfo?.venue && (
              <div className="flex items-center gap-1.5">
                <FaLocationDot className="text-cyan-400" />
                <span>{matchInfo.venue}</span>
              </div>
            )}
            {matchInfo?.date && (
              <div className="flex items-center gap-1.5">
                <FaCalendarDays className="text-cyan-400" />
                <span>{formatDate(matchInfo.date)}</span>
              </div>
            )}
            {tossInfo && (
              <div className="flex items-center gap-1.5">
                <FaCoins className="text-cyan-400" />
                <span>{tossInfo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scorecard Innings */}
        {scorecard.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-white">Scorecard</h2>
            {scorecard.map((inning, i) => (
              <InningSection key={inning.inning || i} inning={inning} />
            ))}
          </div>
        )}

        {scorecard.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
            <FaSatelliteDish className="text-3xl text-slate-600" />
            <p className="text-slate-400">
              Detailed scorecard not yet available for this match.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default LiveMatchDetails;
