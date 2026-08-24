/**
 * Compare page (route: /compare).
 *
 * Player Comparison module: lets the user pick TWO players via
 * API-backed search selectors and compare them side-by-side.
 * State:
 *   - player1 / player2: full player objects fetched from the players API
 *     (null until chosen).
 * Selection is delegated to PlayerSelector (debounced search over the
 * /players endpoint); once both slots are filled a ComparisonCard renders
 * the head-to-head statistics and summary. The same player cannot be
 * selected in both slots.
 */

import { useState } from "react";
import PlayerSelector from "../components/compare/PlayerSelector";
import ComparisonCard from "../components/compare/ComparisonCard";
import { FaExchangeAlt } from "react-icons/fa";

/**
 * Renders the Compare page: hero header, the two selection slots and
 * either the comparison view or a friendly prompt to select two players.
 *
 * @returns {JSX.Element} The compare UI.
 */
function Compare() {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const bothSelected = Boolean(player1 && player2);

  /** Clears both slots. */
  const handleReset = () => {
    setPlayer1(null);
    setPlayer2(null);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
      {/* Background glow */}
      <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Hero header */}
        <div className="mb-12 text-center">
          <p className="text-cyan-400 font-semibold uppercase tracking-[0.3em]">
            PLAYER COMPARISON
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-white">
            Compare Cricket{" "}
            <span className="mt-2 block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Players
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Compare players side-by-side across their key statistics and
            performance metrics.
          </p>
        </div>

        {/* Selection slots */}
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
          <PlayerSelector
            label="Player 1"
            selected={player1}
            onSelect={setPlayer1}
            disabledId={player2?._id ?? null}
          />

          <div className="hidden items-center justify-center md:flex">
            <span
              className="
                flex h-12 w-12 items-center justify-center rounded-full
                border border-slate-700 bg-slate-900/60 text-cyan-400
              "
            >
              <FaExchangeAlt />
            </span>
          </div>

          <PlayerSelector
            label="Player 2"
            selected={player2}
            onSelect={setPlayer2}
            disabledId={player1?._id ?? null}
          />
        </div>

        {/* Comparison area */}
        <div className="mt-14">
          {bothSelected ? (
            /* Defensive guard: identical selections should never render. */
            player1._id === player2._id ? (
              <div className="rounded-3xl border border-slate-800 bg-[#111827] p-10 text-center">
                <p className="text-lg font-semibold text-white">
                  You have selected the same player in both slots.
                </p>
                <p className="mt-2 text-slate-400">
                  Please choose two different players to start comparing.
                </p>
              </div>
            ) : (
              <ComparisonCard
                player1={player1}
                player2={player2}
                onReset={handleReset}
              />
            )
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center sm:p-16">
              <span
                className="
                  mx-auto flex h-16 w-16 items-center justify-center
                  rounded-full bg-cyan-500/10 text-2xl text-cyan-400
                "
              >
                <FaExchangeAlt />
              </span>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Select two players to start comparing.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-slate-400">
                Use the search boxes above to pick Player 1 and Player 2. Their
                career statistics will appear here side-by-side.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Compare;
