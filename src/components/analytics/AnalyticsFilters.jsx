/**
 * AnalyticsFilters.jsx
 *
 * Country and Role filter dropdowns for the Analytics dashboard.
 * Selecting a filter re-fetches the aggregated analytics from the
 * backend so every stat card and chart updates. Options are populated
 * dynamically from the database (no hardcoded lists).
 */

import { FaFilter } from "react-icons/fa";
import { toTitleCase } from "../../utils/format";

/** Shared classes for both select controls (matches PlayerFilters). */
const SELECT_CLASSES = `
    w-full
    appearance-none
    rounded-2xl
    border
    border-slate-700
    bg-slate-900/60
    py-3.5
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
`;

/**
 * Renders the analytics filter bar (country + role dropdowns, reset).
 *
 * @param {object} props - Component props.
 * @param {string} props.country - Currently selected country ("" for all).
 * @param {string} props.role - Currently selected role ("" for all).
 * @param {Array<string>} props.countries - Available country options from the API.
 * @param {Array<string>} props.roles - Available role options from the API.
 * @param {function(string): void} props.onCountryChange - Called with the new country value.
 * @param {function(string): void} props.onRoleChange - Called with the new role value.
 * @param {function(): void} props.onReset - Clears both filters.
 * @returns {JSX.Element} The filter bar element.
 */
function AnalyticsFilters({
  country,
  role,
  countries,
  roles,
  onCountryChange,
  onRoleChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(country || role);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Country filter */}
      <div className="relative flex-1">
        <span
          className="
            pointer-events-none absolute left-5 top-1/2 -translate-y-1/2
            text-sm text-slate-500
          "
        >
          🌍
        </span>

        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className={SELECT_CLASSES}
        >
          <option value="">All Countries</option>
          {countries.map((name) => (
            <option key={name} value={name}>
              {toTitleCase(name)}
            </option>
          ))}
        </select>

        <div
          className="
            pointer-events-none absolute right-5 top-1/2 -translate-y-1/2
            text-slate-400
          "
        >
          ▼
        </div>
      </div>

      {/* Role filter */}
      <div className="relative flex-1">
        <FaFilter
          className="
            pointer-events-none absolute left-5 top-1/2 -translate-y-1/2
            text-sm text-slate-500
          "
        />

        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className={SELECT_CLASSES}
        >
          <option value="">All Roles</option>
          {roles.map((name) => (
            <option key={name} value={name}>
              {toTitleCase(name)}
            </option>
          ))}
        </select>

        <div
          className="
            pointer-events-none absolute right-5 top-1/2 -translate-y-1/2
            text-slate-400
          "
        >
          ▼
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="
            shrink-0 rounded-xl border border-slate-700 bg-slate-900/50
            px-6 py-3 text-sm text-slate-300 transition-all duration-300
            hover:border-cyan-400 hover:text-cyan-400
          "
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default AnalyticsFilters;
