/**
 * MatchCard.jsx
 *
 * Clickable card for the Matches listing page. Displays any match
 * regardless of status: status badge, format badge, team A vs team B
 * rectangular flag emblems, venue and formatted date. Clicking the
 * card navigates to /matches/:id.
 */

import { useNavigate } from "react-router-dom";
import {
  FaLocationDot,
  FaCalendarDays,
  FaTrophy,
} from "react-icons/fa6";
import CountryFlag from "../common/CountryFlag";

/** Converts a name to Title Case (e.g. "south africa" -> "South Africa"). */
const formatName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/** Badge styling per match status, consistent with dashboard widgets. */
const statusBadge = {
  live: "border-red-500/30 bg-red-500/10 text-red-300",
  upcoming: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  completed: "border-green-500/30 bg-green-500/10 text-green-300",
};

/**
 * Renders a single navigable match card.
 *
 * @param {object} props - Component props.
 * @param {object} props.match - Match object with populated teamA/teamB.
 * @returns {JSX.Element} The match card element.
 */
function MatchCard({ match }) {
  const navigate = useNavigate();

  const formattedDate = new Date(match.matchDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={() => navigate(`/matches/${match._id}`)}
      className="
        group rounded-3xl
        border border-slate-700
        bg-gradient-to-br from-slate-800 to-slate-900
        p-6
        text-left
        shadow-lg
        transition-all duration-300
        hover:-translate-y-1
        hover:border-cyan-400
        hover:shadow-cyan-500/20
      "
    >
      {/* Status + Format */}
      <div className="flex items-center justify-between">
        <span
          className={`
            inline-flex items-center gap-2 rounded-full
            border px-3 py-1
            text-xs font-semibold uppercase
            ${statusBadge[match.status] || statusBadge.upcoming}
          `}
        >
          {match.status === "live" && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
          )}
          {match.status}
        </span>

        <span className="rounded-full bg-slate-700 px-4 py-1 text-sm font-semibold uppercase text-slate-300">
          {match.format}
        </span>
      </div>

      <div className="my-5 border-t border-slate-700" />

      {/* Teams */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="text-center">
          <div className="mx-auto mb-3 aspect-[3/2] w-13 overflow-hidden rounded-md border border-cyan-500/40 bg-slate-900 transition-colors duration-300 group-hover:border-cyan-400">
            <CountryFlag country={match.teamA?.country} className="team-flag-logo" />
          </div>
          <h3 className="truncate text-base font-bold capitalize text-white">
            {formatName(match.teamA?.name)}
          </h3>
        </div>

        <div className="px-4 text-2xl font-black text-slate-600">VS</div>

        <div className="text-center">
          <div className="mx-auto mb-3 aspect-[3/2] w-13 overflow-hidden rounded-md border border-cyan-500/40 bg-slate-900 transition-colors duration-300 group-hover:border-cyan-400">
            <CountryFlag country={match.teamB?.country} className="team-flag-logo" />
          </div>
          <h3 className="truncate text-base font-bold capitalize text-white">
            {formatName(match.teamB?.name)}
          </h3>
        </div>
      </div>

      {/* Winner */}
      {match.winner?.name ? (
        <>
          <div className="my-5 border-t border-slate-700" />
          <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold capitalize text-green-300">
            <FaTrophy className="text-amber-400" />
            {formatName(match.winner.name)} won
          </p>
        </>
      ) : null}

      <div className="my-5 border-t border-slate-700" />

      {/* Venue + Date */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <FaLocationDot className="mt-1 shrink-0 text-cyan-400" />
          <p className="truncate text-sm text-white">{match.venue}</p>
        </div>

        <div className="flex items-start gap-3">
          <FaCalendarDays className="mt-1 shrink-0 text-cyan-400" />
          <p className="text-sm text-white">{formattedDate}</p>
        </div>
      </div>

      {/* View Match hint */}
      <p className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-cyan-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
        View Match →
      </p>
    </button>
  );
}

export default MatchCard;
