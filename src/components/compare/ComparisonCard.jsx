/**
 * ComparisonCard.jsx
 *
 * Displays the side-by-side comparison of two players fetched from the
 * players API. Renders a VS header, General Information / Batting /
 * Bowling sections and a Comparison Summary.
 *
 * Only fields that actually exist on the backend player model are used:
 *   name, country, role, team, image, matches, runs, wickets,
 *   average, strikeRate, highestScore.
 *
 * Highlighting rules ("higher is better" only where unambiguous):
 *   - Runs, Average, Strike Rate, Highest Score, Wickets: better value
 *     highlighted in cyan with a "leads" marker.
 *   - Matches: displayed neutrally (playing more matches is not
 *     inherently better).
 */

import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { GiCricketBat } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";

/** Converts an API-stored lowercase string into Title Case. */
const toTitleCase = (value) =>
  (value || "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/** Role badge classes matching PlayerDetails. */
const roleBadgeClass = (role) =>
  role === "Batsman"
    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
    : role === "Bowler"
    ? "bg-red-500/10 text-red-300 border-red-500/30"
    : role === "All-Rounder"
    ? "bg-green-500/10 text-green-300 border-green-500/30"
    : "bg-purple-500/10 text-purple-300 border-purple-500/30";

/** Determines which side leads a numeric stat ('p1' | 'p2' | null on tie). */
const leaderOf = (v1, v2) => {
  if (v1 > v2) return "p1";
  if (v2 > v1) return "p2";
  return null;
};

/**
 * A single comparison row: label + both values side-by-side.
 * The winning value is highlighted when a clear leader exists.
 */
function StatRow({ label, value1, value2, leader }) {
  return (
    <div
      className="
        grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl
        border border-slate-700/60 bg-slate-900/40 px-5 py-5
        sm:gap-8 sm:px-8 sm:py-6
      "
    >
      <span
        className={`text-right text-xl font-bold sm:text-2xl ${
          leader === "p1" ? "text-cyan-300" : "text-white"
        }`}
      >
        {value1}
        {leader === "p1" && (
          <span className="ml-2 hidden align-middle text-xs font-semibold uppercase tracking-wider text-cyan-400 md:inline">
            ▲
          </span>
        )}
      </span>

      <span className="w-20 shrink-0 text-center text-xs uppercase tracking-wider text-slate-400 sm:w-28 sm:text-sm">
        {label}
      </span>

      <span
        className={`text-left text-xl font-bold sm:text-2xl ${
          leader === "p2" ? "text-cyan-300" : "text-white"
        }`}
      >
        {leader === "p2" && (
          <span className="mr-2 hidden align-middle text-xs font-semibold uppercase tracking-wider text-cyan-400 md:inline">
            ▲
          </span>
        )}
        {value2}
      </span>
    </div>
  );
}

/**
 * Section wrapper for grouping related comparison rows.
 */
function StatSection({ title, icon: Icon, children }) {
  return (
    <div>
      <h4 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <Icon />
        </span>
        {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Player identity block reused above each column header.
 * Clicking navigates to the player's detail page.
 */
function PlayerHeader({ player }) {
  return (
    <Link
      to={`/players/${player._id}`}
      className="
        group flex flex-col items-center text-center transition-transform
        duration-300 hover:-translate-y-1
      "
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
        <img
          src={player.image || "/default-player.png"}
          alt={toTitleCase(player.name)}
          className="
            relative h-24 w-24 rounded-full border-4 border-cyan-400
            object-cover transition-colors duration-300 group-hover:border-cyan-300
          "
        />
      </div>

      <h3 className="mt-4 text-2xl font-black text-white group-hover:text-cyan-300 sm:text-3xl">
        {toTitleCase(player.name)}
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-slate-400">
        <FaLocationDot className="text-cyan-400" />
        {toTitleCase(player.country)}
      </p>

      <span
        className={`
          mt-3 rounded-full border px-4 py-1.5 text-sm font-semibold
          ${roleBadgeClass(player.role)}
        `}
      >
        {player.role}
      </span>
    </Link>
  );
}

/**
 * Renders the full head-to-head comparison UI for two players.
 *
 * @param {object} props - Component props.
 * @param {object} props.player1 - First player object from the API.
 * @param {object} props.player2 - Second player object from the API.
 * @param {function(): void} props.onReset - Clears the current comparison.
 * @returns {JSX.Element} The comparison display element.
 */
function ComparisonCard({ player1, player2, onReset }) {
  /* Batting stats — higher is clearly better. */
  const battingStats = [
    { label: "Runs", get: (p) => p.runs ?? 0 },
    { label: "Avg*", get: (p) => p.average ?? 0 },
    { label: "Strike Rate", get: (p) => p.strikeRate ?? 0 },
    { label: "Highest Score", get: (p) => p.highestScore ?? 0 },
  ];

  const showBowling =
    ["Bowler", "All-Rounder"].includes(player1.role) ||
    ["Bowler", "All-Rounder"].includes(player2.role);

  /* Summary: which stats each player leads. */
  const p1Leads = [];
  const p2Leads = [];

  battingStats.forEach((stat) => {
    const leader = leaderOf(stat.get(player1), stat.get(player2));
    if (leader === "p1") p1Leads.push(stat.label);
    if (leader === "p2") p2Leads.push(stat.label);
  });

  if (showBowling) {
    const wicketLeader = leaderOf(player1.wickets ?? 0, player2.wickets ?? 0);
    if (wicketLeader === "p1") p1Leads.push("Wickets");
    if (wicketLeader === "p2") p2Leads.push("Wickets");
  }

  const noClearLeader = p1Leads.length === 0 && p2Leads.length === 0;

  return (
    <div className="space-y-12">
      {/* VS header */}
      <div
        className="
          relative overflow-hidden rounded-[32px] border border-slate-800
          bg-[#111827] p-8 sm:p-10
        "
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />

        <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8">
          <PlayerHeader player={player1} />

          <span
            className="
              shrink-0 rounded-full border border-slate-700 bg-slate-900/60
              px-6 py-3 text-2xl font-black tracking-widest text-cyan-400
            "
          >
            VS
          </span>

          <PlayerHeader player={player2} />
        </div>
      </div>

      {/* Stat sections */}
      <div className="space-y-12 sm:space-y-14">
        <StatSection title="General Information" icon={FaLocationDot}>
          <StatRow
            label="Country"
            value1={toTitleCase(player1.country)}
            value2={toTitleCase(player2.country)}
            leader={null}
          />
          <StatRow
            label="Role"
            value1={player1.role}
            value2={player2.role}
            leader={null}
          />
          <StatRow
            label="Matches"
            value1={player1.matches}
            value2={player2.matches}
            leader={null}
          />
        </StatSection>

        <StatSection title="Batting Statistics" icon={GiCricketBat}>
          {battingStats.map((stat) => (
            <StatRow
              key={stat.label}
              label={stat.label}
              value1={(stat.get(player1) ?? 0).toLocaleString()}
              value2={(stat.get(player2) ?? 0).toLocaleString()}
              leader={leaderOf(stat.get(player1), stat.get(player2))}
            />
          ))}
        </StatSection>

        {showBowling && (
          <StatSection title="Bowling Statistics" icon={TbTargetArrow}>
            <StatRow
              label="Wickets"
              value1={(player1.wickets ?? 0).toLocaleString()}
              value2={(player2.wickets ?? 0).toLocaleString()}
              leader={leaderOf(player1.wickets ?? 0, player2.wickets ?? 0)}
            />
          </StatSection>
        )}

        <p className="pt-2 text-sm text-slate-500">
          *Average denotes Bowling Average if the player is a Bowler, otherwise
          it is the Batting Average. Matches are shown neutrally as playing
          more matches is not inherently better.
        </p>
      </div>

      {/* Comparison summary */}
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 sm:p-10">
        <h3 className="mb-8 text-2xl font-bold text-white">
          Comparison Summary
        </h3>

        {noClearLeader ? (
          <p className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-5 py-4 text-slate-300">
            Stats are too diverse to determine an overall winner.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { player: player1, leads: p1Leads },
              { player: player2, leads: p2Leads },
            ].map(({ player, leads }) => (
              <div
                key={player._id}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-6 py-5"
              >
                <p className="font-bold text-white">
                  {toTitleCase(player.name)}{" "}
                  {leads.length > 0 ? "leads in:" : "leads in no stat."}
                </p>

                {leads.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {leads.map((label) => (
                      <li
                        key={label}
                        className="flex items-center gap-2 text-slate-300"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="
            rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3
            text-slate-300 transition-all duration-300 hover:border-cyan-400
            hover:text-cyan-400
          "
        >
          Reset comparison
        </button>
      </div>
    </div>
  );
}

export default ComparisonCard;
