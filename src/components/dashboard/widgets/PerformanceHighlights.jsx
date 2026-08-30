/**
 * PerformanceHighlights.jsx
 *
 * Dashboard section showcasing individual performance leaders:
 * Best Batsman, Best Bowler, Best Average, and Best Strike Rate.
 * Each card is clickable and navigates to the player's detail page.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHomeHighlights } from "../../../services/player.service";
import {
  FaArrowRight,
  FaLocationDot,
  FaChartLine,
} from "react-icons/fa6";
import { GiCricketBat } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";
import { PiCricketBold } from "react-icons/pi";
import CountryFlag from "../../common/CountryFlag";

/** Normalizes text to Title Case. */
const formatText = (text = "") =>
  text
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

/**
 * HighlightCard component.
 *
 * Displays a single performance leader card with icon, label, player
 * info, and metric value. Clicking navigates to the player's detail page.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.player - Player data object.
 * @param {string} props.label - Metric label (e.g. "Best Batsman").
 * @param {string} props.metricLabel - Secondary label for the value.
 * @param {string|number} props.metricValue - The metric value to display.
 * @param {React.ComponentType} props.icon - Icon component.
 * @param {string} props.accentColor - Tailwind color classes for accent.
 * @returns {JSX.Element} The highlight card.
 */
function HighlightCard({
  player,
  label,
  metricLabel,
  metricValue,
  icon: Icon,
  accentColor,
}) {
  const navigate = useNavigate();

  if (!player) return null;

  return (
    <div
      onClick={() => navigate(`/players/${player._id}`)}
      className={`
        group
        cursor-pointer
        overflow-hidden
        rounded-3xl
        border
        border-slate-700
        bg-gradient-to-br
        from-slate-800
        to-slate-900
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400
        hover:shadow-xl
        hover:shadow-cyan-500/10
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            uppercase
            tracking-wider
            ${accentColor}
          `}
        >
          <Icon className="text-sm" />
          {label}
        </span>
      </div>

      {/* Player Info */}
      <div className="mt-5 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-cyan-400
              to-cyan-600
              text-2xl
              font-bold
              text-slate-900
              shadow-lg
            `}
          >
            {player.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">
            {formatText(player.name)}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
            <FaLocationDot className="text-cyan-400 flex-shrink-0" />
            <CountryFlag country={player.country} className="text-base flex-shrink-0" />
            <span className="truncate">{formatText(player.country)}</span>
          </div>
          <span
            className={`
              mt-2
              inline-flex
              rounded-full
              px-2
              py-0.5
              text-xs
              font-semibold
              ${
                player.role === "Batsman"
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                  : player.role === "Bowler"
                  ? "bg-red-500/10 text-red-300 border border-red-500/20"
                  : player.role === "All-Rounder"
                  ? "bg-green-500/10 text-green-300 border border-green-500/20"
                  : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
              }
            `}
          >
            {player.role}
          </span>
        </div>
      </div>

      {/* Metric */}
      <div className="mt-5 border-t border-slate-700 pt-4">
        <p className="text-xs uppercase tracking-wider text-slate-400">
          {metricLabel}
        </p>
        <p className="mt-1 text-3xl font-bold text-white">
          {typeof metricValue === "number"
            ? metricValue.toLocaleString()
            : metricValue}
        </p>
      </div>

      {/* View Profile */}
      <div
        className="
          mt-4
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
  );
}

/**
 * PerformanceHighlights component.
 *
 * Fetches home highlights data on mount and renders a 2x2 grid of
 * highlight cards for the top performers in each metric.
 *
 * @component
 * @returns {JSX.Element} The performance highlights section.
 */
function PerformanceHighlights() {
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const data = await getHomeHighlights();
        setHighlights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHighlights();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-slate-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  if (!highlights) return null;

  const cards = [
    {
      player: highlights.bestBatsman,
      label: "Best Batsman",
      metricLabel: "Total Runs",
      metricValue: highlights.bestBatsman?.runs ?? "--",
      icon: GiCricketBat,
      accentColor: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
    },
    {
      player: highlights.bestBowler,
      label: "Best Bowler",
      metricLabel: "Total Wickets",
      metricValue: highlights.bestBowler?.wickets ?? "--",
      icon: TbTargetArrow,
      accentColor: "bg-red-500/10 text-red-300 border border-red-500/20",
    },
    {
      player: highlights.bestAverage,
      label: "Best Average",
      metricLabel: "Batting Average",
      metricValue: highlights.bestAverage?.average ?? "--",
      icon: FaChartLine,
      accentColor:
        "bg-green-500/10 text-green-300 border border-green-500/20",
    },
    {
      player: highlights.bestStrikeRate,
      label: "Best Strike Rate",
      metricLabel: "Strike Rate",
      metricValue: highlights.bestStrikeRate?.strikeRate ?? "--",
      icon: PiCricketBold,
      accentColor:
        "bg-purple-500/10 text-purple-300 border border-purple-500/20",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-800 via-slate-900 to-[#0f172a] py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-10">
          <span className="uppercase tracking-widest text-cyan-400 text-sm font-semibold">
            PERFORMANCE HIGHLIGHTS
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Top Performers
          </h2>
          <p className="mt-2 text-slate-400">
            Individual leaders across key cricket performance metrics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map(
            (card) =>
              card.player && (
                <HighlightCard
                  key={card.label}
                  player={card.player}
                  label={card.label}
                  metricLabel={card.metricLabel}
                  metricValue={card.metricValue}
                  icon={card.icon}
                  accentColor={card.accentColor}
                />
              )
          )}
        </div>
      </div>
    </section>
  );
}

export default PerformanceHighlights;
