import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerById } from "../services/player.service";
import { FaLocationDot } from "react-icons/fa6";
import { GiCricketBat } from "react-icons/gi";
import { PiCricketBold } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { FaShieldHalved, FaChartLine, FaArrowRight } from "react-icons/fa6";
function PlayerDetails() {
const { id } = useParams();
 const navigate=useNavigate()

  const [player, setPlayer] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      setError(null);
      try {
        const playerData = await getPlayerById(id);
        setPlayer(playerData);
      } catch (err) {
    setPlayer(null);
    setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);


  if (loading) {
    return <h1 className="player-name">Loading...</h1>;
  }

  if (error) {
    return <h1 className="player-name">Error: {error}</h1>;
  }

  if (!player) {
    return <h1 className="player-name">Player Not Found</h1>;
  }
  const formattedCountryName=player.country.split(" ").map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    ).join(" ")

    const formattedTeamName=player.team.split(" ").map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    ).join(" ")
    const formattedPlayerName=player.name.split(" ").map((word)=>word.charAt(0).toUpperCase()+
  word.slice(1).toLowerCase()
  ).join(" ")
  const stats = [
  {
    label: "Runs",
    value: player.runs,
    show: player.runs !== undefined,
    icon: GiCricketBat,
  },
  {
    label: "Matches",
    value: player.matches,
    show: true,
    icon: FaShieldHalved,
  },
  {
    label:
      player.role === "Bowler"
        ? "Bowling Avg"
        : "Batting Avg",
    value: player.average,
    show: player.average !== undefined,
    icon: FaChartLine,
  },
  {
    label: "Strike Rate",
    value: player.strikeRate,
    show: player.strikeRate !== undefined,
    icon: PiCricketBold,
  },
  {
    label: "Wickets",
    value: player.wickets,
    show: player.wickets !== undefined,
    icon: TbTargetArrow,
  },
  {
    label: "Highest Score",
    value: player.highestScore,
    show: player.highestScore !== undefined,
    icon: FaArrowRight,
  },
];
const playerInfo = [
  {
    label: "Country",
    value: formattedCountryName,
  },
  {
    label: "Team",
    value: formattedTeamName || "Free Agent",
  },
  {
    label: "Batting Style",
    value: player.battingStyle,
  },
  {
    label: "Bowling Style",
    value: player.bowlingStyle,
  },
  {
    label: "Debut Year",
    value: player.debutYear,
  },
  {
    label: "Jersey Number",
    value: player.jerseyNumber
      ? `#${player.jerseyNumber}`
      : "--",
  },
  {
    label: "Status",
    value: player.isActive ? "Active" : "Retired",
  },
];

return (
  <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">

    {/* Background Glow */}
    <div className="absolute left-0 top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

    <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />

    <div className="relative mx-auto max-w-7xl px-6 py-14">

      {/* Back Button */}

      <button
        onClick={() => navigate("/players")}
        className="
          mb-10
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-slate-700
          bg-slate-900/50
          px-5
          py-3
          text-slate-300
          transition-all
          duration-300
          hover:border-cyan-400
          hover:text-cyan-400
        "
      >
        ← Back to Players
      </button>

      {/* Hero Card */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-slate-800
          bg-[#111827]
          p-10
        "
      >

        {/* Hero Glow */}

        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-purple-500/10 blur-[100px]" />

        {/* Gradient Line */}

        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        <div className="relative flex flex-col items-center text-center">

          {/* Image */}

          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />

            <img
              src={player.image || "/default-player.png"}
              alt={player.name}
              className="
                relative
                h-36
                w-36
                rounded-full
                border-4
                border-cyan-400
                object-cover
              "
            />

          </div>

          {/* Name */}

          <h1 className="mt-8 text-5xl font-black tracking-tight text-white">

            {formattedPlayerName}

          </h1>

          {/* Country */}

          <div className="mt-4 flex items-center gap-2 text-lg text-slate-400">

            <FaLocationDot className="text-cyan-400" />

            <span>{formattedCountryName}</span>

          </div>

          {/* Role Badge */}

          <div className="mt-6">

            <span
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-semibold

                ${
                  player.role === "Batsman"
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                    : player.role === "Bowler"
                    ? "bg-red-500/10 text-red-300 border border-red-500/30"
                    : player.role === "All-Rounder"
                    ? "bg-green-500/10 text-green-300 border border-green-500/30"
                    : "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                }
              `}
            >
              {player.role}
            </span>

          </div>

        </div>

      </div>

      {/* ========= PART-2 STARTS HERE ========= */}

     <div className="mt-10">

  <h2 className="mb-6 text-3xl font-bold text-white">
    Career Statistics
  </h2>

  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

    {stats
      .filter((stat) => stat.show)
      .map((stat) => {

        const Icon = stat.icon;

        return (

          <div
            key={stat.label}
            className="
              rounded-2xl
              border
              border-slate-800
              bg-[#111827]
              p-5
              transition-all
              duration-300
              hover:border-cyan-400/40
              hover:-translate-y-1
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-400
                "
              >
                <Icon className="text-xl" />
              </div>

              <div>

                <p className="text-sm uppercase tracking-wider text-slate-400">

                  {stat.label}

                </p>

                <h3 className="mt-1 text-3xl font-bold text-white">

                  {stat.value}

                </h3>

              </div>

            </div>

          </div>

        );

      })}

  </div>

</div>

      {/* ========= PART-3 STARTS HERE ========= */}

<div className="mt-12">

  <h2 className="mb-6 text-3xl font-bold text-white">
    Player Information
  </h2>

  <div
    className="
      rounded-3xl
      border
      border-slate-800
      bg-[#111827]
      p-8
    "
  >

    <div className="grid gap-5 md:grid-cols-2">

      {playerInfo.map((item) => (

        <div
          key={item.label}
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-700/60
            bg-slate-900/40
            px-5
            py-4
          "
        >

          <span className="text-slate-400">
            {item.label}
          </span>

          <span className="font-semibold text-white">
            {item.value}
          </span>

        </div>

      ))}

    </div>

  </div>

</div>

    </div>

  </section>
);
}

export default PlayerDetails