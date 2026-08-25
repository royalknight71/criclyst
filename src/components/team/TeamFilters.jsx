/**
 * TeamFilters.jsx
 *
 * Format filter dropdown for the teams listing page. Allows filtering
 * teams by their match format: ODI, Test or T20I.
 * Rendered as a styled select with a filter icon and custom arrow.
 */

import { FaFilter } from "react-icons/fa";

/**
 * Renders the format filter dropdown control.
 * @param {object} props - Component props.
 * @param {string} props.value - Currently selected format value ("" for all formats).
 * @param {function(string): void} props.onChange - Callback invoked with the newly selected format value.
 * @returns {JSX.Element} The filter dropdown element.
 */
function TeamFilters({ value, onChange }) {
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
        <option value="">All Formats</option>
        <option value="odi">ODI</option>
        <option value="test">Test</option>
        <option value="t20i">T20I</option>
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

export default TeamFilters;
