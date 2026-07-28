import {
  FaLocationDot,
  FaArrowRight,
  FaTrophy,
} from "react-icons/fa6";
import { FaCalendarAlt, FaStar } from "react-icons/fa";

const formatName = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getShortName = (name = "") => {
  const teams = {
    india: "IND",
    australia: "AUS",
    england: "ENG",
    pakistan: "PAK",
    "new zealand": "NZ",
    "south africa": "SA",
    "sri lanka": "SL",
    bangladesh: "BAN",
    afghanistan: "AFG",
    ireland: "IRE",
    "west indies": "WI",
  };

  if (!name) return "---";

  return teams[name.toLowerCase()] || name.slice(0, 3).toUpperCase();
};

function RecentMatchCard({ match }) {
  const matchDate = new Date(match.matchDate);

  const formattedDate = matchDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-cyan-500/20">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 font-semibold text-amber-400">

          <FaTrophy />

          <span>Completed</span>

        </div>

        <span className="rounded-full bg-slate-700 px-4 py-1 text-sm font-semibold uppercase text-slate-300">
          {match.format.toUpperCase()}
        </span>

      </div>

      <div className="my-5 border-t border-slate-700"></div>

      {/* Teams */}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center">

        <div className="text-center">

          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900">

            <span className="text-2xl font-bold text-cyan-400">
              {getShortName(match.teamA?.name)}
            </span>

          </div>

          <h3 className="text-xl font-bold text-white">
            {formatName(match.teamA?.name)}
          </h3>

          <p className="mt-2 text-3xl font-extrabold text-cyan-400">
            {match.scorecard.teamAScore}
          </p>

        </div>

        <div className="px-6 text-4xl font-black text-slate-600">
          VS
        </div>

        <div className="text-center">

          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900">

            <span className="text-2xl font-bold text-cyan-400">
              {getShortName(match.teamB?.name)}
            </span>

          </div>

          <h3 className="text-xl font-bold text-white">
            {formatName(match.teamB?.name)}
          </h3>

          <p className="mt-2 text-3xl font-extrabold text-cyan-400">
            {match.scorecard.teamBScore}
          </p>

        </div>

      </div>

      <div className="my-5 border-t border-slate-700"></div>

      {/* Result */}

      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

        <p className="text-center text-lg font-semibold text-green-300">
          🏆 {match.result}
        </p>

      </div>

      {/* Details */}

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div className="flex items-start gap-3">

          <FaStar className="mt-1 text-yellow-400" />

          <div>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Player of the Match
            </p>

            <p className="font-medium text-white">
              {formatName(match.manOfTheMatch?.name)}
            </p>

          </div>

        </div>

        <div className="flex items-start gap-3">

          <FaTrophy className="mt-1 text-amber-400" />

          <div>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Winner
            </p>

            <p className="font-medium text-white">
              {formatName(match.winner?.name)}
            </p>

          </div>

        </div>

        <div className="flex items-start gap-3">

          <FaLocationDot className="mt-1 text-cyan-400" />

          <div>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Venue
            </p>

            <p className="text-white">
              {match.venue}
            </p>

          </div>

        </div>

        <div className="flex items-start gap-3">

          <FaCalendarAlt className="mt-1 text-cyan-400" />

          <div>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              Match Date
            </p>

            <p className="text-white">
              {formattedDate}
            </p>

          </div>

        </div>

      </div>

      {/* Button */}

      <button className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-cyan-500 py-3 text-lg font-semibold text-slate-900 transition-all duration-300 hover:bg-cyan-400">

        Match Summary

        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

      </button>

    </div>
  );
}

export default RecentMatchCard;