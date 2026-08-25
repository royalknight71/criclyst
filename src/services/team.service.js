/**
 * Team service.
 *
 * Encapsulates all team-related HTTP calls to the backend REST API
 * via the shared Axios instance. Each function maps to an endpoint
 * under /teams and returns the unwrapped response payload.
 */

import api from "../api/axios";

/**
 * Fetch a paginated list of teams with optional search and format filters.
 *
 * Hits: GET /teams?page=&limit=[&search=][&format=]
 * The `search` and `format` query params are only appended when non-empty.
 *
 * @async
 * @param {number} [page=1] - 1-based page number for pagination.
 * @param {number} [limit=8] - Number of teams per page.
 * @param {string} [search=""] - Free-text search (team name or country).
 * @param {string} [format=""] - Match format filter ("odi", "test", "t20i").
 * @returns {Promise<Object>} Paginated response containing `data` (team list),
 *   `totalPages` and `totalTeams`.
 */
export const getTeams = async (
  page = 1,
  limit = 8,
  search = "",
  format = ""
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (format) {
    params.append("format", format);
  }

  const { data } = await api.get(`/teams?${params.toString()}`);

  return data;
};

/**
 * Fetch a single team by its unique ID.
 *
 * Hits: GET /teams/:id
 *
 * @async
 * @param {string} id - Unique identifier of the team.
 * @returns {Promise<Object>} The matching team object.
 */
export const getTeamById = async (id) => {
  const { data } = await api.get(`/teams/${id}`);

  return data.data;
};

/**
 * Create a new team.
 *
 * Hits: POST /teams
 *
 * @async
 * @param {Object} teamData - Team object to create (name, country, format, etc.).
 * @returns {Promise<Object>} The created team object.
 */
export const createTeam = async (teamData) => {
  const { data } = await api.post("/teams", teamData);

  return data.data;
};

/**
 * Update an existing team by ID.
 *
 * Hits: PATCH /teams/:id
 *
 * @async
 * @param {string} id - Unique identifier of the team to update.
 * @param {Object} teamData - Fields to update.
 * @returns {Promise<Object>} The updated team object.
 */
export const updateTeam = async (id, teamData) => {
  const { data } = await api.patch(`/teams/${id}`, teamData);

  return data.data;
};

/**
 * Delete a team by ID.
 *
 * Hits: DELETE /teams/:id
 *
 * @async
 * @param {string} id - Unique identifier of the team to delete.
 * @returns {Promise<Object>} Response with success message.
 */
export const deleteTeam = async (id) => {
  const { data } = await api.delete(`/teams/${id}`);

  return data;
};
