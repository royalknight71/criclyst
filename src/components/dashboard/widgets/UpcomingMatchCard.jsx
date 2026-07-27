import { FaLocationDot, FaArrowRight } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

const formatName = (name = "") =>
  name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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

function UpcomingMatchCard({ match }) {
  const matchDate = new Date(match.matchDate);

  const formattedDate = matchDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = matchDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const daysLeft = Math.max(
    0,
    Math.ceil((matchDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-cyan-500/20">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 text-cyan-400 font-semibold">

          <FaCalendarAlt />

          <span>Upcoming</span>

        </div>

        <span className="rounded-full bg-slate-700 px-4 py-1.5 text-sm font-medium text-slate-300 uppercase">
          {match.format}
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

        </div>

        <div className="px-6 text-4xl font-black text-slate-500">
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

        </div>

      </div>

      <div className="my-5 border-t border-slate-700"></div>

      {/* Match Details */}

      <div className="grid gap-5 md:grid-cols-2">

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
              {formattedDate} • {formattedTime}
            </p>

          </div>

        </div>

      </div>

      {/* Countdown */}

      <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">

        <p className="text-center text-lg font-semibold text-cyan-300">

          Kick-off in{" "}

          <span className="font-bold">
            {daysLeft === 0 ? "Today" : `${daysLeft} Day${daysLeft > 1 ? "s" : ""}`}
          </span>

        </p>

      </div>

      {/* Button */}

      <button className="mt-6 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-cyan-500 py-3 text-lg font-semibold text-slate-900 transition-all duration-300 hover:bg-cyan-400">

        View Fixture

        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

      </button>

    </div>
  );
}

export default UpcomingMatchCard;