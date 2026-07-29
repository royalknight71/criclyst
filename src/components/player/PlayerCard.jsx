import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaLocationDot,
  FaHashtag,
  FaShieldHalved,
  FaChartLine,
} from "react-icons/fa6";

import { GiCricketBat } from "react-icons/gi";
import { PiCricketBold } from "react-icons/pi";

import StatItem from "./StatItem";

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

  const badgeColors = {
    Batsman:
      "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30",

    Bowler:
      "bg-red-500/10 text-red-300 border border-red-500/30",

    "All-Rounder":
      "bg-green-500/10 text-green-300 border border-green-500/30",

    "Wicket-Keeper":
      "bg-purple-500/10 text-purple-300 border border-purple-500/30",
  };

  const stats = [
    {
      title: "Runs",
      value: player.runs?.toLocaleString(),
      icon: PiCricketBold,
    },
    {
      title: "Matches",
      value: player.matches,
      icon: FaShieldHalved,
    },
    {
      title: "Average",
      value: player.average,
      icon: FaChartLine,
    },
    {
      title: "Wickets",
      value: player.wickets,
      icon: GiCricketBat,
    },
  ];

  return (
    <article
  className="
    group
    relative
    w-full
    max-w-[320px]
    overflow-hidden
    rounded-3xl
    border
    border-slate-800
    bg-[#111827]
    shadow-lg
    transition-all
    duration-300
    hover:-translate-y-2
    hover:border-cyan-400/60
    hover:shadow-[0_0_35px_rgba(34,211,238,0.15)]
  "
>

      {/* Glow */}

      <div
        className="
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-10
          -left-10
          h-24
          w-28
          rounded-full
          bg-blue-600/10
          blur-3xl
        "
      />

      {/* Gradient Line */}

      <div
        className="
          h-1.5
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-purple-500
        "
      />

      {/* Hero */}

      <div className="relative px-6 pt-6 text-center">

        <div className="relative mx-auto w-fit">

          {/* Cyan Glow Behind Image */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              bg-cyan-400/20
              blur-xl
            "
          />

          <img
            src={player.image || "/default-player.png"}
            alt={player.name}
            className="
              relative
              h-20
              w-20
              rounded-full
              border-2
              border-cyan-400
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />

        </div>

        <h2
          className="
            mt-4
            text-xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {formatText(player.name)}
        </h2>

        <div
          className="
            mt-2
            flex
            items-center
            justify-center
            gap-2
            text-sm
            text-slate-400
          "
        >
          <FaLocationDot className="text-cyan-400" />

          <span>
            {formatText(player.country)}
          </span>
        </div>

        <div className="mt-4">

          <span
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${
                badgeColors[player.role] ??
                "bg-slate-700 text-white"
              }
            `}
          >
            {player.role}
          </span>

        </div>
                {/* Stats */}

        <div className="mt-6 grid grid-cols-2 gap-3">

          {stats.map((stat) => (
            <StatItem
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}

        </div>

        {/* Player Info */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-slate-700/70
            bg-slate-900/40
            p-4
            backdrop-blur-md
          "
        >

          {player.jerseyNumber && (
            <div className="flex items-center justify-between">

              <span className="flex items-center gap-2 text-sm text-slate-400">

                <FaHashtag className="text-cyan-400" />

                Jersey

              </span>

              <span className="font-semibold text-white">

                #{player.jerseyNumber}

              </span>

            </div>
          )}

          <div
            className={`flex items-center justify-between ${
              player.jerseyNumber ? "mt-3 pt-3 border-t border-slate-700" : ""
            }`}
          >

            <span className="text-sm text-slate-400">

              Team

            </span>

            <span className="font-semibold text-white">

              {formatText(player.team ?? "Free Agent")}

            </span>

          </div>

        </div>

        {/* View Profile */}

        <button
          onClick={() => navigate(`/players/${player._id}`)}
          className="
            mt-6
            mb-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-purple-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-[0_0_25px_rgba(34,211,238,0.30)]
            active:scale-95
          "
        >
          View Profile

          <FaArrowRight
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />

        </button>

      </div>

    </article>
  );
}

export default PlayerCard;