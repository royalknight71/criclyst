/**
 * Favorites page (route: /favorites).
 *
 * Shows the logged-in user's favorite players, teams, and matches.
 * Protected via ProtectedRoute (requires auth).
 * Reuses PlayerGrid / PlayerCard with unfavorite action.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayerFavorites, getTeamFavorites, getMatchFavorites, removePlayerFavorite, removeTeamFavorite, removeMatchFavorite } from "../services/favorite.service";
import PlayerGrid from "../components/player/PlayerGrid";
import TeamGrid from "../components/team/TeamGrid";
import PlayerSkeleton from "../components/player/PlayerSkeleton";
import CountryFlag from "../components/common/CountryFlag";

function Favorites() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const [playersData, teamsData, matchesData] = await Promise.all([
                getPlayerFavorites(),
                getTeamFavorites(),
                getMatchFavorites()
            ]);
            setPlayers(Array.isArray(playersData) ? playersData : []);
            setTeams(Array.isArray(teamsData) ? teamsData : []);
            setMatches(Array.isArray(matchesData) ? matchesData : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load favorites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleUnfavorite = async (id, type) => {
        if (removingId) return;
        setRemovingId(id);
        try {
            if (type === "players") {
                await removePlayerFavorite(id);
                setPlayers((prev) => prev.filter((p) => p._id !== id));
            } else if (type === "teams") {
                await removeTeamFavorite(id);
                setTeams((prev) => prev.filter((t) => t._id !== id));
            } else if (type === "matches") {
                await removeMatchFavorite(id);
                setMatches((prev) => prev.filter((m) => m._id !== id));
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to remove favorite";
            setError(msg);
        } finally {
            setRemovingId(null);
        }
    };

const renderEmptyState = () => (
    <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
        <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-3xl">♡</div>
            <h1 className="mt-8 text-4xl font-black text-white">No Favorites Yet</h1>
            <p className="mt-4 max-w-md text-slate-400">
                You haven&apos;t added any players, teams, or matches to your watchlist. Browse and tap the heart to save your favorites.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => navigate("/players")}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-blue-400"
                >
                    Browse Players
                </button>
                <button
                    onClick={() => navigate("/teams")}
                    className="rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-green-500/20 transition hover:from-green-300 hover:to-emerald-400"
                >
                    Browse Teams
                </button>
                <button
                    onClick={() => navigate("/matches")}
                    className="rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-purple-500/20 transition hover:from-purple-300 hover:to-pink-400"
                >
                    Browse Matches
                </button>
            </div>
        </div>
        </section>
    );

    if (loading) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
                <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="relative mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <PlayerSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-[#0B1120] px-6 py-16">
                <div className="mx-auto max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <h2 className="text-xl font-bold text-red-300">Something went wrong</h2>
                    <p className="mt-2 text-sm text-red-200">{error}</p>
                    <button
                        onClick={fetchFavorites}
                        className="mt-6 rounded-xl bg-cyan-400 px-6 py-2.5 font-semibold text-slate-900 transition hover:bg-cyan-300"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    const totalFavorites = players.length + teams.length + matches.length;

    if (totalFavorites === 0) {
        return renderEmptyState();
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 py-16">
                <div className="mb-10 text-center">
                    <p className="text-cyan-400 font-semibold tracking-[0.3em] uppercase">Your Watchlist</p>
                    <h1 className="mt-4 text-5xl font-black leading-tight text-white">
                        Favorite <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Items</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
                        {totalFavorites} item{totalFavorites !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {removingId && (
                    <p className="mb-4 text-center text-sm text-slate-400">Updating...</p>
                )}

                {/* Players Section */}
                {players.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl">👤</span>
                            Players ({players.length})
                        </h2>
                        <PlayerGrid players={players} onUnfavorite={(id) => handleUnfavorite(id, "players")} showFavoriteAction={true} />
                    </div>
                )}

                {/* Teams Section */}
                {teams.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl">🏏</span>
                            Teams ({teams.length})
                        </h2>
                        <TeamGrid teams={teams} onUnfavorite={(id) => handleUnfavorite(id, "teams")} showFavoriteAction={true} />
                    </div>
                )}

                {/* Matches Section */}
                {matches.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl">⚔️</span>
                            Matches ({matches.length})
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {matches.map((match) => (
                                <MatchFavoriteCard key={match._id} match={match} onUnfavorite={() => handleUnfavorite(match._id, "matches")} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function MatchFavoriteCard({ match, onUnfavorite }) {
    const toTitleCase = (value = "") =>
        (value || "")
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

    const statusBadge = {
        live: "border-red-500/30 bg-red-500/10 text-red-300",
        upcoming: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
        completed: "border-green-500/30 bg-green-500/10 text-green-300",
    };

    const formattedDate = new Date(match.matchDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <div
            className="
                group rounded-3xl
                border border-slate-700
                bg-gradient-to-br from-slate-800 to-slate-900
                p-6
                text-left
                shadow-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:border-cyan-400
                hover:shadow-cyan-500/20
            "
        >
            {/* Status + Format */}
            <div className="flex items-center justify-between">
                <span
                    className={`
                        inline-flex items-center gap-2 rounded-full
                        border px-3 py-1
                        text-xs font-semibold uppercase
                        ${statusBadge[match.status] || statusBadge.upcoming}
                    `}
                >
                    {match.status === "live" && (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                    )}
                    {match.status}
                </span>

                <span className="rounded-full bg-slate-700 px-4 py-1 text-xs font-semibold uppercase text-slate-300">
                    {match.format}
                </span>
            </div>

            <div className="my-5 border-t border-slate-700" />

            {/* Teams */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <div className="text-center">
                    <div className="mx-auto mb-3 aspect-[3/2] w-13 overflow-hidden rounded-md border border-cyan-500/40 bg-slate-900 transition-colors duration-300 group-hover:border-cyan-400">
                        <CountryFlag country={match.teamA?.country} className="team-flag-logo" />
                    </div>
                    <h3 className="truncate text-base font-bold capitalize text-white">
                        {toTitleCase(match.teamA?.name)}
                    </h3>
                </div>

                <div className="px-4 text-2xl font-black text-slate-600">VS</div>

                <div className="text-center">
                    <div className="mx-auto mb-3 aspect-[3/2] w-13 overflow-hidden rounded-md border border-purple-400/40 bg-slate-900 transition-colors duration-300 group-hover:border-purple-400">
                        <CountryFlag country={match.teamB?.country} className="team-flag-logo" />
                    </div>
                    <h3 className="truncate text-base font-bold capitalize text-white">
                        {toTitleCase(match.teamB?.name)}
                    </h3>
                </div>
            </div>

            {/* Winner */}
            {match.winner?.name ? (
                <>
                    <div className="my-5 border-t border-slate-700" />
                    <p className="flex items-center justify-center gap-2 text-center text-sm font-semibold capitalize text-green-300">
                        <span className="text-amber-400">🏆</span>
                        {toTitleCase(match.winner.name)} won
                    </p>
                </>
            ) : null}

            <div className="my-5 border-t border-slate-700" />

            {/* Venue + Date */}
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-cyan-400">📍</span>
                    <p className="truncate text-sm text-white">{match.venue}</p>
                </div>

                <div className="flex items-start gap-3">
                    <span className="mt-1 shrink-0 text-cyan-400">📅</span>
                    <p className="text-sm text-white">{formattedDate}</p>
                </div>
            </div>

            {/* Unfavorite button */}
            <div className="mt-6 flex items-center justify-end">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnfavorite(match._id);
                    }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

export default Favorites;
