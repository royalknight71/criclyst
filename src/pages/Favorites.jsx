/**
 * Favorites page (route: /favorites).
 *
 * Shows the logged-in user's favorite players.
 * Protected via ProtectedRoute (requires auth).
 * Reuses PlayerGrid / PlayerCard with unfavorite action.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite } from "../services/favorite.service";
import PlayerGrid from "../components/player/PlayerGrid";
import PlayerSkeleton from "../components/player/PlayerSkeleton";

function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFavorites();
            setFavorites(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load favorites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleUnfavorite = async (playerId) => {
        if (removingId) return;
        setRemovingId(playerId);
        try {
            await removeFavorite(playerId);
            setFavorites((prev) => prev.filter((p) => p._id !== playerId));
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to remove favorite";
            setError(msg);
        } finally {
            setRemovingId(null);
        }
    };

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

    if (favorites.length === 0) {
        return (
            <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
                <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-3xl">♡</div>
                    <h1 className="mt-8 text-4xl font-black text-white">No Favorites Yet</h1>
                    <p className="mt-4 max-w-md text-slate-400">
                        You haven&apos;t added any players to your watchlist. Browse players and tap the heart to save your favorites.
                    </p>
                    <button
                        onClick={() => navigate("/players")}
                        className="mt-8 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-blue-400"
                    >
                        Browse Players
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#0B1120]">
            <div className="absolute top-20 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 py-16">
                <div className="mb-10 text-center">
                    <p className="text-cyan-400 font-semibold tracking-[0.3em] uppercase">Your Watchlist</p>
                    <h1 className="mt-4 text-5xl font-black leading-tight text-white">
                        Favorite <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Players</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
                        {favorites.length} player{favorites.length !== 1 ? "s" : ""} saved
                    </p>
                </div>

                {removingId && (
                    <p className="mb-4 text-center text-sm text-slate-400">Updating...</p>
                )}

                <PlayerGrid players={favorites} onUnfavorite={handleUnfavorite} showFavoriteAction={true} />
            </div>
        </section>
    );
}

export default Favorites;
