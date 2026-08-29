/**
 * Favorite service.
 *
 * Encapsulates all favorites-related HTTP calls to the backend REST API
 * via the shared Axios instance.
 */

import api from "../api/axios";

/**
 * Add a player to current user's favorites.
 * Hits: POST /users/favorites/:playerId
 * @param {string} playerId - Player ObjectId
 * @returns {Promise<Object>} response payload
 */
export const addFavorite = async (playerId) => {
    const { data } = await api.post(`/users/favorites/${playerId}`);
    return data;
};

/**
 * Remove a player from current user's favorites.
 * Hits: DELETE /users/favorites/:playerId
 * @param {string} playerId - Player ObjectId
 * @returns {Promise<Object>} response payload
 */
export const removeFavorite = async (playerId) => {
    const { data } = await api.delete(`/users/favorites/${playerId}`);
    return data;
};

/**
 * Get current user's favorite players.
 * Hits: GET /users/favorites
 * @returns {Promise<Array>} list of player objects
 */
export const getFavorites = async () => {
    const { data } = await api.get("/users/favorites");
    return data.data;
};

/**
 * Check whether a specific player is favorited.
 * Hits: GET /users/favorites/:playerId/check
 * @param {string} playerId - Player ObjectId
 * @returns {Promise<boolean>} isFavorited
 */
export const checkIsFavorited = async (playerId) => {
    const { data } = await api.get(`/users/favorites/${playerId}/check`);
    return data.isFavorited;
};
