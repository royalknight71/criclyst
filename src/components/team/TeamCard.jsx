/**
 * TeamCard.jsx
 *
 * Card component that displays a cricket team's overview: logo (with a
 * letter fallback when the image fails to load), name, country and match
 * format badge, plus captain/coach details and a "View Team" button.
 */

import { useNavigate } from "react-router-dom";
import CountryFlag from "../common/CountryFlag";

/**
 * Renders an individual team card with logo, metadata and staff details.
 * @param {object} props - Component props.
 * @param {object} props.team - Team object to display.
 * @param {string} props.team.name - Team name.
 * @param {string} props.team.country - Team country.
 * @param {string} props.team.format - Match format badge (e.g. Test, ODI, T20I).
 * @param {string} [props.team.logo] - URL of the team logo image.
 * @param {{name?: string}} [props.team.captain] - Captain details.
 * @param {string} [props.team.coach] - Coach name.
 * @returns {JSX.Element} The team card element.
 */
const TeamCard = ({ team, onUnfavorite, showFavoriteAction = false }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-slate-700/70
        bg-[#111827]
        p-6
        transition-all duration-300
        hover:-translate-y-2
        hover:border-cyan-400
        hover:shadow-[0_15px_40px_rgba(0,217,255,0.12)]
      "
    >

      {/* Top Gradient */}
      <div
        className="
          absolute left-0 right-0 top-0 h-[3px]
          bg-gradient-to-r from-cyan-400 to-purple-500
        "
      />

      {/* Flag as rectangular team emblem */}
      <div
        className="
          relative mx-auto mb-5
          aspect-[3/2] w-20
          overflow-hidden
          rounded-lg
          border border-cyan-500/25
          bg-[#0b1322]
          shadow-[0_0_24px_rgba(0,217,255,0.08)]
        "
      >
        <CountryFlag country={team.country} className="team-flag-logo" />
      </div>

      {/* Team Info */}
      <div className="text-center">

        <h2 className="text-xl font-bold capitalize text-white">
          {team.name}
        </h2>

        <p className="mt-1 text-sm capitalize text-slate-400">
          <CountryFlag country={team.country} className="text-base mr-1" />
          {team.country}
        </p>

        <span
          className="
            mt-3 inline-block
            rounded-full
            border border-cyan-400/30
            bg-cyan-400/10
            px-3 py-1
            text-xs font-semibold
            uppercase
            text-cyan-400
          "
        >
          {team.format}
        </span>

      </div>

      {/* Captain / Coach */}
      <div className="mt-6 space-y-3 border-t border-slate-700 pt-5">

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Captain
          </span>

          <span className="text-right capitalize text-slate-200">
            {team.captain?.name || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Coach
          </span>

          <span className="text-right capitalize text-slate-200">
            {team.coach || "N/A"}
          </span>
        </div>

      </div>

      {/* View Team & Favorite Action */}
      <div className="mt-6 flex items-center justify-between gap-2">
        {showFavoriteAction && onUnfavorite ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnfavorite(team._id);
            }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            Remove
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={() => navigate(`/teams/${team._id}`)}
          className="
            flex-1
            rounded-lg
            border border-cyan-400
            bg-transparent
            py-2.5
            text-sm font-semibold
            text-cyan-400
            transition-all duration-300
            hover:bg-cyan-400
            hover:text-slate-950
          "
        >
          View Team
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

    </div>
  );
};

export default TeamCard;