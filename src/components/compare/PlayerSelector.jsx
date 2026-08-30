/**
 * PlayerSelector.jsx
 *
 * A single "slot" of the Compare module (Player 1 / Player 2).
 * Provides a debounced search input backed by the players API
 * (via getPlayers), a themed results dropdown and a selected-player
 * card with the option to clear the selection.
 *
 * The other slot's selected player id is passed as `disabledId` so the
 * same player cannot be picked in both slots.
 */

import { useEffect, useState } from "react";
import { getPlayers } from "../../services/player.service";
import { FaSearch } from "react-icons/fa";
import {
  FaLocationDot,
  FaRotate,
} from "react-icons/fa6";
import CountryFlag from "../common/CountryFlag";

/** Converts an API-stored lowercase string into Title Case. */
const toTitleCase = (value) =>
  (value || "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * Renders one player selection slot.
 *
 * @param {object} props - Component props.
 * @param {string} props.label - Slot label ("Player 1" or "Player 2").
 * @param {object|null} props.selected - Currently selected player object, or null.
 * @param {function(Object|null): void} props.onSelect - Called with the chosen
 *   player object, or null when the selection is cleared.
 * @param {string|null} props.disabledId - Id of the player selected in the
 *   other slot; excluded from results to prevent duplicate comparisons.
 * @returns {JSX.Element} The selector UI.
 */
function PlayerSelector({ label, selected, onSelect, disabledId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [open, setOpen] = useState(false);

  /* Debounce the raw search term before hitting the API. */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* Fetch matching players whenever the debounced query changes. */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const fetchPlayers = async () => {
      setSearching(true);
      setSearchError(null);

      try {
        const response = await getPlayers(1, 8, debouncedSearch, "");
        if (!cancelled) setResults(response.data);
      } catch (err) {
        if (!cancelled) {
          setResults([]);
          setSearchError(err.message);
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    };

    fetchPlayers();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, open]);

  /** Applies a result row to this slot and closes the dropdown. */
  const handleSelect = (player) => {
    onSelect(player);
    setOpen(false);
    setSearchTerm("");
    setDebouncedSearch("");
    setResults([]);
  };

  /** Clears this slot's selection and re-opens the picker. */
  const handleClear = () => {
    onSelect(null);
    setOpen(true);
  };

  const availableResults = results.filter(
    (player) => player._id !== disabledId
  );

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#111827] p-6">
      {/* Slot header */}
      <div className="mb-5 flex min-h-[2rem] items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-cyan-400">
          {label}
        </h3>

        {selected && (
          <button
            onClick={handleClear}
            className="
              flex items-center gap-2 rounded-xl border border-slate-700
              bg-slate-900/60 px-4 py-2 text-sm text-slate-300
              transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400
            "
          >
            <FaRotate className="text-xs" />
            Change
          </button>
        )}
      </div>

      {selected ? (
        /* Selected player card */
        <div className="flex min-h-[4rem] flex-1 items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
            <img
              src={selected.image || "/default-player.png"}
              alt={toTitleCase(selected.name)}
              className="
                relative h-16 w-16 rounded-full border-2 border-cyan-400
                object-cover
              "
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-white">
              {toTitleCase(selected.name)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <FaLocationDot className="text-cyan-400" />
              <CountryFlag country={selected.country} className="text-base" />
              {toTitleCase(selected.country)}
            </p>
          </div>
        </div>
      ) : (
        /* Search + dropdown picker */
        <div className="relative flex min-h-[4rem] flex-1 items-center">
          <FaSearch
            className="
              pointer-events-none absolute left-4 top-1/2 -translate-y-1/2
              text-sm text-slate-500
            "
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={`Search for ${label.toLowerCase()}...`}
            className="
              w-full rounded-2xl border border-slate-700 bg-slate-900/60
              py-3.5 pl-11 pr-5 text-white placeholder:text-slate-500
              outline-none backdrop-blur-md transition-all duration-300
              focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10
            "
          />

          {open && (
            <div
              className="
                absolute z-20 mt-2 w-full overflow-hidden rounded-2xl
                border border-slate-700 bg-[#111827] shadow-2xl shadow-black/50
              "
            >
              {searching ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex animate-pulse items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-slate-800" />
                        <div className="h-2.5 w-1/3 rounded bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchError ? (
                <div className="p-4 text-center">
                  <p className="font-semibold text-red-400">
                    Failed to search players.
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{searchError}</p>
                </div>
              ) : availableResults.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-slate-400">
                    {results.length > 0
                      ? "This player is already selected in the other slot."
                      : debouncedSearch
                      ? "No players found matching your search."
                      : "Start typing to search players."}
                  </p>
                </div>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {availableResults.map((player) => (
                    <li key={player._id}>
                      <button
                        onClick={() => handleSelect(player)}
                        className="
                          flex w-full items-center gap-3 px-4 py-3 text-left
                          transition-colors duration-200 hover:bg-cyan-500/10
                        "
                      >
                        <img
                          src={player.image || "/default-player.png"}
                          alt=""
                          className="
                            h-10 w-10 shrink-0 rounded-full border border-slate-700
                            object-cover
                          "
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-white">
                            {toTitleCase(player.name)}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-slate-400">
                            <CountryFlag country={player.country} className="text-base mr-1" />
                            {toTitleCase(player.country)}
                          </span>
                        </span>
                        <span
                          className={`
                            shrink-0 rounded-full px-3 py-1 text-xs font-semibold
                            ${
                              player.role === "Batsman"
                                ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                                : player.role === "Bowler"
                                ? "border border-red-500/30 bg-red-500/10 text-red-300"
                                : player.role === "All-Rounder"
                                ? "border border-green-500/30 bg-green-500/10 text-green-300"
                                : "border border-purple-500/30 bg-purple-500/10 text-purple-300"
                            }
                          `}
                        >
                          {player.role}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Click-away layer */}
          {open && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerSelector;
