/**
 * Utility helpers for working with player objects.
 * Provides lookup, role inspection, formatting and role-based
 * color mapping used across player-facing UI.
 */


/**
 * Find a player in a list by exact (case-sensitive) name match.
 *
 * @param {Array<Object>} players - Collection of player objects to search.
 * @param {string} name - Player name to match against `player.name`.
 * @returns {Object|undefined} The matching player object, or undefined if not found.
 */
export function getPlayerByName(players, name) {
    return (
        players.find((player)=>player.name===name)
    )
}

/**
 * Get a player's playing role (e.g. "Batsman", "Bowler", "All-Rounder").
 *
 * @param {Object} player - Player object with a `role` field.
 * @returns {string} The player's role.
 */
export function getPlayerRole(player) {
    return player.role;
}

/**
 * Format a number using locale-aware thousands separators
 * (e.g. 14085 becomes "14,085").
 *
 * @param {number} num - The number to format.
 * @returns {string} The locale-formatted number string.
 */
export function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Check whether a player's role is "Bowler".
 *
 * @param {Object} player - Player object with a `role` field.
 * @returns {boolean} True if the player is a bowler.
 */
export function isBowler(player) {
    return player.role === "Bowler";
}

/**
 * Check whether a player's role is "Batsman".
 *
 * @param {Object} player - Player object with a `role` field.
 * @returns {boolean} True if the player is a batsman.
 */
export function isBatsman(player) {
    return player.role === "Batsman";
}

/**
 * Format a number using locale-aware thousands separators
 * (e.g. 14085 becomes "14,085").
 *
 * @param {number} num - The number to format.
 * @returns {string} The locale-formatted number string.
 */
export function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Check whether a player's role is "Bowler".
 *
 * @param {Object} player - Player object with a `role` field.
 * @returns {boolean} True if the player is a bowler.
 */
export function isBowler(player) {
    return player.role === "Bowler";
}

/**
 * Check whether a player's role is "Batsman".
 *
 * @param {Object} player - Player object with a `role` field.
 * @returns {boolean} True if the player is a batsman.
 */
export function isBatsman(player) {
    return player.role === "Batsman";
}

/**
 * Map a playing role to a display color used for badges and charts.
 *
 * @param {string} role - Player role ("Batsman", "Bowler", "All-Rounder", "Wicket Keeper").
 * @returns {string} Hex color string; falls back to a neutral gray for unknown roles.
 */
export function getRoleColor(role) {
    switch(role){
        case "Batsman":
            return "#2563eb";

        case "Bowler":
            return "#dc2626";

        case "All-Rounder":
            return "#16a34a";

        case "Wicket Keeper":
            return "#2563eb";

        default:
            return "#6b7280";
    }
}