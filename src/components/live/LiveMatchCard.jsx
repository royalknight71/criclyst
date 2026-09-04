/**
 * LiveMatchCard.jsx
 *
 * Card widget for a single live cricket match received via Socket.IO
 * from the CricketData API. Displays team names, logos (when available),
 * match status, venue, date, and score data.
 * Clicking navigates to the detailed scorecard view.
 */

import { useNavigate } from "react-router-dom";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";

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

function LiveMatchCard({ match }) {
  const navigate = useNavigate();
  const teams = match.teams || [];
  const teamInfo = match.teamInfo || [];
  const score = match.score || [];

  const teamAInfo = teamInfo[0] || null;
  const teamBInfo = teamInfo[1] || null;

  const teamAScore = score.find((s) => s.inning?.startsWith(teams[0]));
  const teamBScore = score.find((s) => s.inning?.startsWith(teams[1]));

  return (
    <button
      type="button"
      onClick={() => navigate(`/live/${match.id}`)}
      className="group w-full rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
            Live
          </span>
        </div>
        <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-semibold uppercase text-slate-300">
          {match.matchType || "--"}
        </span>
      </div>

      <div className="my-4 h-px bg-slate-700/50" />

      {/* Teams */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Team A */}
        <div className="text-center">
          {teamAInfo?.img ? (
            <img
              src={teamAInfo.img}
              alt={teams[0]}
              className="mx-auto mb-2 h-10 w-10 rounded-md border border-slate-600 object-cover"
            />
          ) : (
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md border border-cyan-500/40 bg-slate-900 text-xs font-bold text-cyan-400">
              {teamAInfo?.shortname || teams[0]?.charAt(0) || "?"}
            </div>
          )}
          <p className="truncate text-sm font-bold text-white">
            {teamAInfo?.shortname || teams[0] || "--"}
          </p>
          {teamAScore ? (
            <p className="mt-1 text-2xl font-black text-cyan-400">
              {teamAScore.r}/{teamAScore.w}
              <span className="text-xs font-normal text-slate-400">
                {" "}({teamAScore.o} ov)
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Yet to bat</p>
          )}
        </div>

        {/* VS */}
        <div className="px-2 text-2xl font-black text-slate-600">VS</div>

        {/* Team B */}
        <div className="text-center">
          {teamBInfo?.img ? (
            <img
              src={teamBInfo.img}
              alt={teams[1]}
              className="mx-auto mb-2 h-10 w-10 rounded-md border border-slate-600 object-cover"
            />
          ) : (
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-md border border-purple-500/40 bg-slate-900 text-xs font-bold text-purple-400">
              {teamBInfo?.shortname || teams[1]?.charAt(0) || "?"}
            </div>
          )}
          <p className="truncate text-sm font-bold text-white">
            {teamBInfo?.shortname || teams[1] || "--"}
          </p>
          {teamBScore ? (
            <p className="mt-1 text-2xl font-black text-cyan-400">
              {teamBScore.r}/{teamBScore.w}
              <span className="text-xs font-normal text-slate-400">
                {" "}({teamBScore.o} ov)
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">Yet to bat</p>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-slate-700/50" />

      {/* Status */}
      <p className="mb-3 text-center text-sm font-medium text-slate-300">
        {match.status || "Status unavailable"}
      </p>

      {/* Info */}
      <div className="flex flex-col gap-2 text-xs text-slate-400">
        {match.venue && (
          <div className="flex items-center gap-2">
            <FaLocationDot className="shrink-0 text-cyan-400" />
            <span className="truncate">{match.venue}</span>
          </div>
        )}
        {match.date && (
          <div className="flex items-center gap-2">
            <FaCalendarDays className="shrink-0 text-cyan-400" />
            <span>{formatDate(match.date)}</span>
          </div>
        )}
      </div>

      {/* View scorecard hint */}
      <p className="mt-4 text-center text-xs font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
        View Scorecard →
      </p>
    </button>
  );
}

export default LiveMatchCard;
