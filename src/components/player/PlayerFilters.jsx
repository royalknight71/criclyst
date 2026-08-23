/**
 * PlayerFilters.jsx
 *
 * Role filter dropdown for the players listing page. Allows filtering
 * players by their role: Batsman, Bowler, All-Rounder or Wicket-Keeper.
 * Rendered as a styled select with a filter icon and custom arrow.
 */

import { FaFilter } from "react-icons/fa";

/**
 * Renders the role filter dropdown control.
 * @param {object} props - Component props.
 * @param {string} props.value - Currently selected role value ("" for all roles).
 * @param {function(string): void} props.onChange - Callback invoked with the newly selected role value.
 * @returns {JSX.Element} The filter dropdown element.
 */
function PlayerFilters({ value, onChange }) {
  return (
    <div className="relative w-full md:w-64">

      <FaFilter
        className="
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-slate-500
          text-sm
          pointer-events-none
        "
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          appearance-none
          rounded-2xl
          border
          border-slate-700
          bg-slate-900/60
          py-4
          pl-14
          pr-12
          text-white
          backdrop-blur-md
          outline-none
          transition-all
          duration-300
          focus:border-cyan-400
          focus:ring-4
          focus:ring-cyan-500/10
        "
      >
        <option value="">All Roles</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-Rounder">All-Rounder</option>
        <option value="Wicket-Keeper">Wicket-Keeper</option>
      </select>

      {/* Custom Arrow */}

      <div
        className="
          pointer-events-none
          absolute
          right-5
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      >
        ▼
      </div>

    </div>
  );
}

export default PlayerFilters;