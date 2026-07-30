import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaLocationDot,
  FaShieldHalved,
  FaChartLine,
} from "react-icons/fa6";
import { GiCricketBat } from "react-icons/gi";
import { GiCricket } from "react-icons/gi";      // Cricket ball
import { PiCricketBold } from "react-icons/pi";
import {TbTargetArrow} from "react-icons/tb"

function PlayerCard({ player }) {
  const navigate = useNavigate();

  const formatText = (text = "") =>
    text
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");

  const roleColors = {
    Batsman:
      "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20",

    Bowler:
      "text-red-300 bg-red-500/10 border border-red-500/20",

    "All-Rounder":
      "text-green-300 bg-green-500/10 border border-green-500/20",

    "Wicket-Keeper":
      "text-purple-300 bg-purple-500/10 border border-purple-500/20",
  };

  const stats = [
    {
      label: "Runs",
      value: player.runs?.toLocaleString() ?? "-",
      icon: GiCricketBat,
    },
    {
      label: "Matches",
      value: player.matches ?? "-",
      icon: FaShieldHalved,
    },
    {
      label: "Average",
      value: player.average ?? "-",
      icon: FaChartLine,
    },
    {
      label: "Wickets",
      value: player.wickets ?? "-",
      icon: TbTargetArrow,
    },
  ];

  return (
    <article
      onClick={() => navigate(`/players/${player._id}`)}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-[#111827]
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-400/40
        hover:shadow-[0_15px_45px_rgba(34,211,238,.15)]
      "
    >

      {/* Decorative Glow */}

      <div
        className="
          absolute
          right-0
          top-0
          h-40
          w-40
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      {/* Accent Line */}

      <div
        className="
          h-1
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-purple-500
        "
      />

      <div className="relative px-6 py-6">

        {/* Profile */}

        <div className="flex items-center gap-4">

          <img
            src={player.image || "/default-player.png"}
            alt={player.name}
            className="
              h-16
              w-16
              rounded-full
              border-2
              border-cyan-400
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />

          <div className="flex-1">

            <h2 className="text-lg font-bold text-white">
              {formatText(player.name)}
            </h2>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <FaLocationDot className="text-cyan-400" />
              {formatText(player.country)}
            </div>

            <span
              className={`
                mt-3
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${roleColors[player.role]}
              `}
            >
              {player.role}
            </span>

          </div>

        </div>

                {/* Stats */}

        <div className="mt-6 space-y-2">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-700/60
                  bg-slate-900/40
                  px-4
                  py-3
                  transition-all
                  duration-300
                  group-hover:border-slate-600
                  hover:border-cyan-400/40
                  hover:bg-slate-800/70
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-500/10
                      text-cyan-400
                    "
                  >
                    <Icon className="text-lg" />
                  </div>

                  <div>

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      {stat.label}
                    </p>

                    <p
                      className="
                        mt-1
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      {stat.value}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Footer */}

        <div
          className="
            mt-6
            border-t
            border-slate-800
            pt-4
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-slate-500">
                TEAM
              </p>

              <p className="mt-1 font-semibold text-white">
                {formatText(player.team ?? "Free Agent")}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs text-slate-500">
                JERSEY
              </p>

              <p className="mt-1 font-semibold text-white">
                #{player.jerseyNumber ?? "--"}
              </p>

            </div>

          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-end
              gap-2
              text-sm
              font-semibold
              text-cyan-400
              transition-all
              duration-300
              group-hover:gap-3
            "
          >
            View Profile

            <FaArrowRight />

          </div>

        </div>

      </div>

    </article>
  );
}

export default PlayerCard;