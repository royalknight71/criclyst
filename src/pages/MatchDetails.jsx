/**
 * MatchDetails page (route: /matches/:id).
 *
 * Shows the full profile for a single match: hero card (team A vs team B,
 * both linking to /teams/:id), status/format badges, venue and date,
 * result banner, scorecard section (when data is present), match
 * information grid and a clickable Man of the Match card linking to
 * /players/:id.
 * State/effects:
 *   - Fetches the match by route `id` on mount (and whenever id changes)
 *     via getMatchById; tracks match/loading/error.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchById } from "../services/match.service";
import { checkMatchFavorite, addMatchFavorite, removeMatchFavorite } from "../services/favorite.service";
import { useAuth } from "../context/AuthContext";
import FavoriteButton from "../components/player/FavoriteButton";
import {
  FaLocationDot,
  FaCalendarDays,
  FaTrophy,
  FaStar,
  FaCoins,
  FaCircleInfo,
} from "react-icons/fa6";

/** Converts a name to Title Case ("wankhede stadium" -> "Wankhede Stadium"). */
const toTitleCase = (value = "") =>
  (value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * Maps a team name to its cricket abbreviation (e.g. "India" -> "IND").
 * Falls back to the first three letters, uppercased; returns "---" when
 * the name is missing.
 */
const getShortName = (name = "") => {
  const teams = {
    india: "IND",
    australia: "AUS",
    england: "ENG",
    pakistan: "PAK",
    "new zealand": "NZ",
    "south africa": "SA",
    "sri lanka": "SL",
    bangladesh: "BAN",
    afghanistan: "AFG",
    ireland: "IRE",
    "west indies": "WI",
  };

  if (!name) return "---";

  return teams[name.toLowerCase()] || name.slice(0, 3).toUpperCase();
};

/** Badge styling per match status. */
const statusBadge = {
  live: "border-red-500/30 bg-red-500/10 text-red-300",
  upcoming: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  completed: "border-green-500/30 bg-green-500/10 text-green-300",
};

/**
 * Renders the match details page.
 * Displays loading, error and "not found" states, then the hero card,
 * result banner, scorecard and match information. Missing/null fields
 * are hidden or shown as "--".
 *
 * @returns {JSX.Element} The match details UI.
 */
function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState(null);
  const [favChecking, setFavChecking] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const matchData = await getMatchById(id);
        setMatch(matchData);
      } catch (err) {
        setMatch(null);
        // Missing/invalid IDs (404/400) show the "Match Not Found" screen;
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

    fetchMatch();
  }, [id]);

  useEffect(() => {
    if (!user || !id) {
        setIsFavorited(false);
        return;
    }
    let cancelled = false;
    const checkFav = async () => {
        setFavChecking(true);
        setFavError(null);
        try {
            const fav = await checkMatchFavorite(id);
            if (!cancelled) setIsFavorited(fav);
        } catch {
            if (!cancelled) setIsFavorited(false);
        } finally {
            if (!cancelled) setFavChecking(false);
        }
    };
    checkFav();
    return () => { cancelled = true; };
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
        navigate("/login");
        return;
    }
    if (favLoading) return;
    setFavLoading(true);
    setFavError(null);
    try {
        if (isFavorited) {
            await removeMatchFavorite(id);
            setIsFavorited(false);
        } else {
            await addMatchFavorite(id);
            setIsFavorited(true);
        }
    } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || "Failed to update favorites";
        if (status === 401) {
            navigate("/login");
            return;
        }
        if (status === 409 && !isFavorited) {
            setIsFavorited(true);
            return;
        }
        setFavError(msg);
    } finally {
        setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-lg text-slate-400">Loading match...</p>
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

  if (!match) {
    return (
      <main className="min-h-screen bg-[#0B1120] px-6 py-20 text-white">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
          <p className="text-lg text-slate-400">Match Not Found</p>
          <button
            onClick={() => navigate("/matches")}
            className="
              rounded-xl
              border border-cyan-400
              px-5 py-3
              text-sm font-semibold text-cyan-400
              transition-all duration-300
              hover:bg-cyan-400 hover:text-slate-950
            "
          >
            ← Back to Matches
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(match.matchDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Scorecard section is only rendered when at least one score field exists.
  const hasScorecard =
    match.scorecard?.teamAScore ||
    match.scorecard?.teamBScore ||
    match.scorecard?.overs;

  const matchInfo = [
    {
      label: "Venue",
      value: match.venue || "--",
      icon: FaLocationDot,
    },
    {
      label: "Date",
      value: formattedDate,
      icon: FaCalendarDays,
    },
    {
      label: "Toss",
      value: `${toTitleCase(match.tossWinner?.name)} chose ${
        match.tossDecision || "--"
      }`,
      icon: FaCoins,
    },
    {
      label: "Status",
      value: toTitleCase(match.status),
      icon: FaCircleInfo,
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
          onClick={() => navigate("/matches")}
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
          ← Back to Matches
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

          {/* Status + Format Badges */}
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <span
              className={`
                inline-flex items-center gap-2 rounded-full
                border px-4 py-1.5
                text-xs font-semibold uppercase
                ${statusBadge[match.status] || statusBadge.upcoming}
              `}
            >
              {match.status === "live" && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              )}
              {match.status}
            </span>

            <span className="rounded-full bg-slate-700 px-4 py-1.5 text-xs font-semibold uppercase text-slate-300">
              {match.format}
            </span>
          </div>

          {/* Favorite Button */}
          <div className="mt-8 flex flex-col items-center">
            {!user ? (
                <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400"
                >
                    Login to add to Favorites
                </button>
            ) : (
                <FavoriteButton
                    isFavorited={isFavorited}
                    loading={favLoading || favChecking}
                    onToggle={handleToggleFavorite}
                />
            )}
            {favError && (
                <p className="mt-3 text-sm text-red-400">{favError}</p>
            )}
          </div>

          {/* Teams */}
          <div className="relative mt-10 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Team A */}
            <button
              onClick={() => navigate(`/teams/${match.teamA?._id}`)}
              className="group mx-auto flex flex-col items-center text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-cyan-400 bg-[#0b1322] transition-transform duration-300 group-hover:scale-105">
                  <span className="text-2xl font-black text-cyan-400">
                    {getShortName(match.teamA?.name)}
                  </span>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold capitalize text-white transition-colors duration-300 group-hover:text-cyan-400 sm:text-xl">
                {toTitleCase(match.teamA?.name)}
              </h2>
              <p className="mt-1 text-sm capitalize text-slate-400">
                {toTitleCase(match.teamA?.country)}
              </p>
            </button>

            <div className="px-4 text-3xl font-black text-slate-600 sm:px-8 sm:text-4xl">
              VS
            </div>

            {/* Team B */}
            <button
              onClick={() => navigate(`/teams/${match.teamB?._id}`)}
              className="group mx-auto flex flex-col items-center text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-purple-400 bg-[#0b1322] transition-transform duration-300 group-hover:scale-105">
                  <span className="text-2xl font-black text-purple-400">
                    {getShortName(match.teamB?.name)}
                  </span>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold capitalize text-white transition-colors duration-300 group-hover:text-purple-400 sm:text-xl">
                {toTitleCase(match.teamB?.name)}
              </h2>
              <p className="mt-1 text-sm capitalize text-slate-400">
                {toTitleCase(match.teamB?.country)}
              </p>
            </button>
          </div>

          {/* Venue + Date */}
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 text-sm capitalize text-slate-400 sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <FaLocationDot className="text-cyan-400" />
              {match.venue || "--"}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendarDays className="text-cyan-400" />
              {formattedDate}
            </span>
          </div>

          {/* Result Banner */}
          {match.result ? (
            <div
              className="
                relative mx-auto mt-8 max-w-xl
                rounded-2xl border border-green-500/20
                bg-green-500/10 p-4
              "
            >
              <p className="flex items-center justify-center gap-2 text-center text-base font-semibold text-green-300">
                <FaTrophy className="shrink-0 text-amber-400" />
                {match.result}
              </p>
            </div>
          ) : null}
        </div>

        {/* Scorecard */}
        {hasScorecard ? (
          <div className="mt-12">
            <h2 className="mb-6 text-3xl font-bold text-white">Scorecard</h2>

            <div
              className="
                rounded-3xl
                border
                border-slate-800
                bg-[#111827]
                p-8
              "
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Team Scores */}
                {[
                  {
                    label: toTitleCase(match.teamA?.name),
                    value: match.scorecard?.teamAScore || "--",
                  },
                  {
                    label: toTitleCase(match.teamB?.name),
                    value: match.scorecard?.teamBScore || "--",
                  },
                ].map((score) => (
                  <div
                    key={score.label}
                    className="
                      rounded-2xl
                      border
                      border-slate-700/60
                      bg-slate-900/40
                      p-5
                    "
                  >
                    <p className="truncate text-xs uppercase tracking-wider text-slate-400">
                      {score.label}
                    </p>
                    <h3 className="mt-2 text-3xl font-extrabold text-cyan-400">
                      {score.value}
                    </h3>
                  </div>
                ))}

                {/* Overs / CRR / Target */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-700/60
                    bg-slate-900/40
                    p-5
                  "
                >
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Overs
                  </p>
                  <h3 className="mt-2 text-3xl font-extrabold text-white">
                    {match.scorecard?.overs || "--"}
                  </h3>
                  <p className="mt-3 text-sm text-slate-400">
                    CRR{" "}
                    <span className="font-semibold text-cyan-400">
                      {match.scorecard?.currentRunRate || 0}
                    </span>
                    {" · "}Target{" "}
                    <span className="font-semibold text-cyan-400">
                      {match.scorecard?.target || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Match Information */}
        <div className="mt-12">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Match Information
          </h2>

          <div
            className="
              rounded-3xl
              border
              border-slate-800
              bg-[#111827]
              p-8
            "
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {matchInfo.map((item) => {
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

              {/* Winner */}
              <div
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
                    bg-amber-500/10
                    text-amber-400
                  "
                >
                  <FaTrophy />
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Winner
                  </p>
                  {match.winner?._id ? (
                    <button
                      onClick={() => navigate(`/teams/${match.winner._id}`)}
                      className="mt-1 block max-w-full truncate font-semibold capitalize text-amber-400 transition-colors duration-300 hover:text-amber-300"
                    >
                      {toTitleCase(match.winner.name)}
                    </button>
                  ) : (
                    <h3 className="mt-1 font-semibold text-white">--</h3>
                  )}
                </div>
              </div>

              {/* Man of the Match */}
              <div
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
                    bg-yellow-500/10
                    text-yellow-400
                  "
                >
                  <FaStar />
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-slate-400">
                    Player of the Match
                  </p>
                  {match.manOfTheMatch?._id ? (
                    <button
                      onClick={() =>
                        navigate(`/players/${match.manOfTheMatch._id}`)
                      }
                      className="mt-1 block max-w-full truncate font-semibold capitalize text-yellow-400 transition-colors duration-300 hover:text-yellow-300"
                    >
                      {toTitleCase(match.manOfTheMatch.name)}
                    </button>
                  ) : (
                    <h3 className="mt-1 font-semibold text-white">--</h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatchDetails;
