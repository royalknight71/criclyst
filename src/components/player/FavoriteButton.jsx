/**
 * FavoriteButton.jsx
 *
 * Reusable favorite/unfavorite toggle button.
 * Used in PlayerDetails and Favorites page / PlayerCard.
 */

import { FaHeart, FaRegHeart } from "react-icons/fa";

/**
 * @param {object} props
 * @param {boolean} props.isFavorited - whether player is currently favorited
 * @param {boolean} props.loading - loading state to prevent duplicate clicks
 * @param {Function} props.onToggle - click handler
 * @param {string} [props.size] - "default" | "small" | "large"
 * @param {string} [props.className] - extra classes
 */
function FavoriteButton({ isFavorited, loading, onToggle, size = "default", className = "" }) {
    const sizeClasses = {
        small: "px-3 py-1.5 text-sm gap-1.5",
        default: "px-6 py-3 text-base gap-2",
        large: "px-8 py-3.5 text-lg gap-2.5",
    };

    const baseClasses = `
        inline-flex items-center justify-center rounded-xl font-semibold
        border transition-all duration-300
        disabled:cursor-not-allowed disabled:opacity-50
        ${sizeClasses[size] || sizeClasses.default}
    `;

    const stateClasses = isFavorited
        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 border-transparent hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20"
        : "bg-slate-800/80 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-cyan-400 hover:bg-slate-700/50";

    return (
        <button
            onClick={onToggle}
            disabled={loading}
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className={`${baseClasses} ${stateClasses} ${className}`}
        >
            {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isFavorited ? (
                <FaHeart className="text-base" />
            ) : (
                <FaRegHeart className="text-base" />
            )}
            <span>{loading ? "Please wait..." : isFavorited ? "Favorited" : "Add to Favorites"}</span>
        </button>
    );
}

export default FavoriteButton;
