/**
 * TeamDetails page (route: /teams/:id).
 *
 * Shows the full profile for a single team: hero card (logo, name,
 * country, format badge), team information (ranking, founded year,
 * coach, captain, home ground, status) and the squad section listing
 * all populated players (clickable, navigating to /players/:id).
 * State/effects:
 *   - Fetches the team by route `id` on mount (and whenever id changes)
 *     via getTeamById; tracks team/loading/error.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamById } from "../services/team.service";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaTrophy,
  FaShieldHalved,
  FaUserTie,
  FaUsers,
  FaCalendarDays,
  FaHouse,
} from "react-icons/fa6";

/**
 * Converts a free-form string into Title Case ("india" -> "India").
 * Returns an em dash when the value is empty/null.
 *
 * @param {string} [value=""] - Raw value to format.
 * @returns {string} The title-cased value or "--".
 */
const toTitleCase = (value = "") =>
  (value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ") || "--";

/**
 * Renders the team profile page.
 * Displays loading, error and "not found" states, then the hero card,
 * team information grid and the clickable squad list. The backend does
 * not populate the captain reference, so the captain's name is resolved
 * from the squad when available.
 *
 * @returns {JSX.Element} The team details UI.
 */
function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);
      try {
        const teamData = await getTeamById(id);
        setTeam(teamData);
      } catch (err) {
        setTeam(null);
        // Missing/invalid IDs (404/400) show the "Team Not Found" screen;
        // everything else surfaces as a themed error state.
        setError(
          err.response?.status === 404 || err.response?.status === 400
            ? null
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-slate-400">Loading team...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-400">
            Error: {error}
          </p>
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
          <p className="text-lg text-slate-400">Team Not Found</p>
          <button
            onClick={() => navigate("/teams")}
            className="
              rounded-xl
              border border-cyan-400
              px-5 py-3
              text-sm font-semibold text-cyan-400
              transition-all duration-300
              hover:bg-cyan-400 hover:text-slate-950
            "
          >
            ← Back to Teams
          </button>
        </div>
      </main>
    );
  }

  // Resolve the captain's display name: populated object, squad lookup,
  // or a fallback when neither is available.
  const captainFromSquad =
    typeof team.captain === "string" &&
    team.players?.find((p) => p._id === team.captain);

  const captainName =
    (typeof team.captain === "object" && team.captain?.name) ||
    (captainFromSquad ? toTitleCase(captainFromSquad.name) : "") ||
    "N/A";

  const teamInfo = [
    {
      label: "Ranking",
      value: team.ranking ? `#${team.ranking}` : "--",
      icon: FaTrophy,
    },
    {
      label: "Founded",
      value: team.founded || "--",
      icon: FaCalendarDays,
    },
    {
      label: "Coach",
      value: toTitleCase(team.coach),
      icon: FaUserTie,
    },
    {
      label: "Captain",
      value: captainName,
      icon: FaShieldHalved,
    },
    {
      label: "Home Ground",
      value: toTitleCase(team.homeGround),
      icon: FaHouse,
    },
    {
      label: "Status",
      value: team.isActive ? "Active" : "Inactive",
      icon: FaUsers,
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
          onClick={() => navigate("/teams")}
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
          ← Back to Teams
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
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
              <div
                className="
                  relative flex h-36 w-36
                  items-center justify-center
                  overflow-hidden rounded-full
                  border-4 border-cyan-400
                  bg-[#0b1322]
                "
              >
                {!imageError && team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="h-24 w-24 object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-5xl font-black text-cyan-400">
                    {team.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <h1 className="mt-8 text-5xl font-black tracking-tight capitalize text-white">
              {toTitleCase(team.name)}
            </h1>

            {/* Country */}
            <div className="mt-4 flex items-center gap-2 text-lg capitalize text-slate-400">
              <FaLocationDot className="text-cyan-400" />
              <span>{toTitleCase(team.country)}</span>
            </div>

            {/* Format Badge */}
            <div className="mt-6">
              <span
                className="
                  rounded-full
                  border border-cyan-500/30
                  bg-cyan-500/10
                  px-5
                  py-2
                  text-sm font-semibold uppercase text-cyan-300
                "
              >
                {team.format}
              </span>
            </div>

            {/* Description */}
            {team.description ? (
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400">
                {team.description}
              </p>
            ) : null}
          </div>
        </div>

        {/* Team Information */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold text-white">Team Information</h2>

          <div
            className="
              rounded-3xl
              border
              border-slate-800
              bg-[#111827]
              p-8
            "
          >
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {teamInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-slate-700/60
                      bg-slate-900/40
                      px-5
                      py-4
                    "
                  >
                    <div
                      className="
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        bg-cyan-500/10
                        text-cyan-400
                      "
                    >
                      <Icon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-400">
                        {item.label}
                      </p>
                      <h3 className="mt-1 truncate font-semibold capitalize text-white">
                        {item.value}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Squad */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Squad{" "}
            <span className="text-base font-medium text-slate-400">
              ({team.players?.length || 0} players)
            </span>
          </h2>

          {team.players?.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {team.players.map((player) => (
                <button
                  key={player._id}
                  onClick={() => navigate(`/players/${player._id}`)}
                  className="
                    group rounded-2xl
                    border border-slate-800
                    bg-[#111827]
                    p-5
                    text-left
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-cyan-400/40
                    hover:shadow-[0_15px_40px_rgba(0,217,255,0.08)]
                  "
                >
                  {/* Role Badge */}
                  <span
                    className={`
                      inline-block rounded-full
                      border px-3 py-1
                      text-xs font-semibold
                      ${
                        player.role === "Batsman"
                          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                          : player.role === "Bowler"
                          ? "border-red-500/30 bg-red-500/10 text-red-300"
                          : player.role === "All-Rounder"
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
                          : "border-purple-500/30 bg-purple-500/10 text-purple-300"
                      }
                    `}
                  >
                    {player.role}
                  </span>

                  {/* Name */}
                  <h3 className="mt-4 truncate text-lg font-bold capitalize text-white transition-colors duration-300 group-hover:text-cyan-400">
                    {toTitleCase(player.name)}
                  </h3>

                  {/* Country */}
                  <div className="mt-2 flex items-center gap-2 text-sm capitalize text-slate-400">
                    <FaLocationDot className="text-cyan-400" />
                    <span>{toTitleCase(player.country)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="
                rounded-3xl
                border
                border-slate-800
                bg-[#111827]
                py-14
                text-center
              "
            >
              <p className="text-slate-400">No squad players added yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TeamDetails;
