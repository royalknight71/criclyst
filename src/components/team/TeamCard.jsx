import { useState } from "react";

const TeamCard = ({ team }) => {
  const [imageError, setImageError] = useState(false);

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

      {/* Logo */}
      <div
        className="
          mx-auto mb-5
          flex h-28 w-28
          items-center justify-center
          overflow-hidden
          rounded-full
          border border-slate-600
          bg-[#0b1322]
        "
      >
        {!imageError && team.logo ? (
          <img
            src={team.logo}
            alt={team.name}
            className="h-20 w-20 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-4xl font-bold text-cyan-400">
            {team.name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Team Info */}
      <div className="text-center">

        <h2 className="text-xl font-bold capitalize text-white">
          {team.name}
        </h2>

        <p className="mt-1 text-sm capitalize text-slate-400">
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

      {/* View Team */}
      <button
        className="
          mt-6 w-full
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
  );
};

export default TeamCard;