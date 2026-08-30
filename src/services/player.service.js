/**
 * Player service.
 *
 * Encapsulates all player-related HTTP calls to the backend REST API
 * via the shared Axios instance. Each function maps to a GET endpoint
 * under /players and returns the unwrapped response payload.
 */

import api from "../api/axios";

/**
 * Fetch the top 5 players by runs (descending).
 *
 * Hits: GET /players?sortBy=runs&order=desc&limit=5
 *
 * @async
 * @returns {Promise<Array<Object>>} List of the top 5 player objects.
 */
export const getTopPlayers = async () => {

    const { data } = await api.get(
        "/players?sortBy=runs&order=desc&limit=5"
    );

    return data.data;
};

/**
 * Fetch the single top-ranked player by runs (descending).
 *
 * Hits: GET /players?sortBy=runs&order=desc&limit=1
 *
 * @async
 * @returns {Promise<Object>} The highest run-scorer player object.
 */
export const getTopPlayer = async () => {

    const { data } = await api.get(
        "/players?sortBy=runs&order=desc&limit=1"
    );

    return data.data[0];
};

/**
 * Fetch a paginated list of players with optional search and role filters.
 *
 * Hits: GET /players?page=&limit=[&search=][&role=]
 * The `search` and `role` query params are only appended when non-empty.
 *
 * @async
 * @param {number} [page=1] - 1-based page number for pagination.
 * @param {number} [limit=8] - Number of players per page.
 * @param {string} [search=""] - Free-text search (name, country or team).
 * @param {string} [role=""] - Role filter (e.g. "Batsman", "Bowler").
 * @returns {Promise<Object>} Paginated response containing `data` (player list),
 *   `totalPages` and `totalPlayers`.
 */
export const getPlayers = async (
  page = 1,
  limit = 8,
  search = "",
  role = ""
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (role) {
    params.append("role", role);
  }

  const { data } = await api.get(`/players?${params.toString()}`);

  return data;
};

/**
 * Fetch a single player by their unique ID.
 *
 * Hits: GET /players/:id
 *
 * @async
 * @param {string} id - Unique identifier of the player.
 * @returns {Promise<Object>} The matching player object.
 */
export const getPlayerById = async (id) => {
  const {data}=await api.get(`/players/${id}`);
  return data.data;
}

/**
 * Fetch the top performer for each key metric for the Home page
 * performance highlights section.
 *
 * Hits: GET /players/highlights
 *
 * @async
 * @returns {Promise<Object>} Object containing bestBatsman, bestBowler,
 *   bestAverage, and bestStrikeRate player objects (or null if none found).
 */
export const getHomeHighlights = async () => {
  const { data } = await api.get("/players/highlights");
  return data.data;
};

/**
 * Create a new player (admin only).
 * Hits: POST /players
 */
export const createPlayer = async (playerData) => {
  const { data } = await api.post("/players", playerData);
  return data.data;
};

/**
 * Update an existing player by ID (admin only).
 * Hits: PATCH /players/:id
 */
export const updatePlayer = async (id, playerData) => {
  const { data } = await api.patch(`/players/${id}`, playerData);
  return data.data;
};

/**
 * Delete a player by ID (admin only).
 * Hits: DELETE /players/:id
 */
export const deletePlayer = async (id) => {
  const { data } = await api.delete(`/players/${id}`);
  return data;
};