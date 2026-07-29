import {
  FaArrowRight,
  FaFlag,
  FaTrophy,
  FaUserGroup,
  FaRankingStar,
} from "react-icons/fa6";
import { IoTrendingUp } from "react-icons/io5";

const formatText = (text = "") =>
  text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");

const medals = [
  {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    label: "Gold",
  },
  {
    bg: "bg-slate-400/20",
    text: "text-slate-200",
    label: "Silver",
  },
  {
    bg: "bg-orange-500/20",
    text: "text-orange-300",
    label: "Bronze",
  },
];

function TopPlayerCard({ player, index }) {
  const badge =
    index < 3
      ? medals[index]
      : {
          bg: "bg-cyan-500/20",
          text: "text-cyan-300",
          label: `#${index + 1}`,
        };

  return (
    <div className="group rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-5">

          {/* Avatar */}

          <div className="relative">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-4xl font-bold text-slate-900 shadow-lg">

              {player.name.charAt(0).toUpperCase()}

            </div>

            <div
              className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full ${badge.bg} ${badge.text}`}
            >

              <FaRankingStar />

            </div>

          </div>

          {/* Player */}

          <div>

            <h2 className="text-3xl font-bold text-white">

              {formatText(player.name)}

            </h2>

            <div className="mt-2 flex items-center gap-2 text-slate-400">

              <FaFlag className="text-cyan-400" />

              <span>{formatText(player.country)}</span>

            </div>

            <div
              className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}
            >

              {badge.label}

            </div>

          </div>

        </div>

        {/* Role */}

        <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-cyan-300">

          {player.role}

        </div>

      </div>

      {/* Divider */}

      <div className="my-7 h-px bg-slate-700"></div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          icon={<IoTrendingUp />}
          title="Runs"
          value={player.runs?.toLocaleString()}
          valueColor="text-green-400"
        />

        <StatCard
          icon={<FaUserGroup />}
          title="Matches"
          value={player.matches}
          valueColor="text-cyan-300"
        />

        <StatCard
          icon={<FaTrophy />}
          title="Wickets"
          value={player.wickets}
          valueColor="text-yellow-400"
        />

        <StatCard
          icon={<FaRankingStar />}
          title="Rank"
          value={`#${index + 1}`}
          valueColor="text-orange-300"
        />

      </div>

      {/* Footer */}

      <div className="mt-7 flex items-center justify-between">

        <p className="text-sm text-slate-400">

          Career Statistics

        </p>

        <button className="flex items-center gap-2 rounded-xl cursor-pointer border border-cyan-400 px-5 py-2 font-medium text-cyan-300 transition-all duration-300 hover:bg-cyan-400 hover:text-slate-900">

          View Profile

          <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

        </button>

      </div>

    </div>
  );
}

function StatCard({ icon, title, value, valueColor }) {
  return (
    <div className="rounded-2xl bg-slate-800/80 p-4 transition-all duration-300 hover:bg-slate-700">

      <div className="flex items-center gap-2 text-cyan-400">

        {icon}

        <span className="text-xs uppercase tracking-wider text-slate-400">

          {title}

        </span>

      </div>

      <h3 className={`mt-3 text-3xl font-bold ${valueColor}`}>

        {value}

      </h3>

    </div>
  );
}

export default TopPlayerCard;