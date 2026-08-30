/**
 * Favorite service.
 *
 * Encapsulates all favorites-related HTTP calls to the backend REST API
 * via the shared Axios instance.
 */

import api from "../api/axios";

/**
 * Generic helper to build favorite endpoints.
 */
function buildEntityEndpoints(entity) {
    return {
        /**
         * Add an entity to current user's favorites.
         * Hits: POST /users/favorites/${entity}/:id
         * @param {string} id - Entity ObjectId
         * @returns {Promise<Object>} response payload
         */
        add: async (id) => {
            const { data } = await api.post(`/users/favorites/${entity}/${id}`);
            return data;
        },

        /**
         * Remove an entity from current user's favorites.
         * Hits: DELETE /users/favorites/${entity}/:id
         * @param {string} id - Entity ObjectId
         * @returns {Promise<Object>} response payload
         */
        remove: async (id) => {
            const { data } = await api.delete(`/users/favorites/${entity}/${id}`);
            return data;
        },

        /**
         * Get current user's favorite entities.
         * Hits: GET /users/favorites/${entity}
         * @returns {Promise<Array>} list of entity objects
         */
        get: async () => {
            const { data } = await api.get(`/users/favorites/${entity}`);
            return data.data;
        },

        /**
         * Check whether a specific entity is favorited.
         * Hits: GET /users/favorites/${entity}/:id/check
         * @param {string} id - Entity ObjectId
         * @returns {Promise<boolean>} isFavorited
         */
        check: async (id) => {
            const { data } = await api.get(`/users/favorites/${entity}/${id}/check`);
            return data.isFavorited;
        }
    };
}

/**
 * Player favorites API
 */
export const playerFavorites = buildEntityEndpoints("players");

/**
 * Team favorites API
 */
export const teamFavorites = buildEntityEndpoints("teams");

/**
 * Match favorites API
 */
export const matchFavorites = buildEntityEndpoints("matches");

// Re-export individual functions for backward compatibility
export const addFavorite = playerFavorites.add;
export const removeFavorite = playerFavorites.remove;
export const getFavorites = playerFavorites.get;
export const checkIsFavorited = playerFavorites.check;

// Named exports for clarity
export const addPlayerFavorite = playerFavorites.add;
export const removePlayerFavorite = playerFavorites.remove;
export const getPlayerFavorites = playerFavorites.get;
export const checkPlayerFavorite = playerFavorites.check;

export const addTeamFavorite = teamFavorites.add;
export const removeTeamFavorite = teamFavorites.remove;
export const getTeamFavorites = teamFavorites.get;
export const checkTeamFavorite = teamFavorites.check;

export const addMatchFavorite = matchFavorites.add;
export const removeMatchFavorite = matchFavorites.remove;
export const getMatchFavorites = matchFavorites.get;
export const checkMatchFavorite = matchFavorites.check;