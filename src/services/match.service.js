/**
 * Match service.
 *
 * Encapsulates all match-related HTTP calls to the backend REST API
 * via the shared Axios instance. Each function maps to a GET endpoint
 * under /matches filtered by match status and returns the unwrapped
 * response payload.
 */

import api from "../api/axios";

/**
 * Fetch all matches that are currently live.
 *
 * Hits: GET /matches?status=live
 *
 * @async
 * @returns {Promise<Array<Object>>} List of live match objects.
 */
export const getLiveMatch=async ()=>{
    const {data}=await api.get(
        "/matches?status=live"
    )
    return data.data
}

/**
 * Fetch upcoming matches sorted by date (earliest first).
 *
 * Hits: GET /matches?status=upcoming&sortBy=matchDate&order=asc
 *
 * @async
 * @returns {Promise<Array<Object>>} List of upcoming match objects.
 */
export const getUpcomingMatches=async ()=>{
    const {data}=await api.get(
        "/matches?status=upcoming&sortBy=matchDate&order=asc"
    )
    return data.data;
}

/**
 * Fetch recently completed matches sorted by date (latest first).
 *
 * Hits: GET /matches?status=completed&sortBy=matchDate&order=desc
 *
 * @async
 * @returns {Promise<Array<Object>>} List of completed match objects.
 */
export const getRecentMatches=async()=>{
    const {data}=await api.get(
        "/matches?status=completed&sortBy=matchDate&order=desc"
    )
    return data.data
}

/**
 * Fetch a paginated list of matches with optional status/format filters
 * and sorting.
 *
 * Hits: GET /matches?page=&limit=[&status=][&format=][&sortBy=][&order=]
 * The `status`, `format`, `sortBy` and `order` params are only appended
 * when non-empty.
 *
 * @async
 * @param {Object} [options={}] - Query options.
 * @param {number} [options.page=1] - 1-based page number for pagination.
 * @param {number} [options.limit=8] - Number of matches per page.
 * @param {string} [options.status=""] - Match status filter ("live",
 *   "upcoming" or "completed").
 * @param {string} [options.format=""] - Match format filter ("odi",
 *   "test" or "t20i").
 * @param {string} [options.sortBy=""] - Sort field ("matchDate", "venue",
 *   "format" or "status").
 * @param {string} [options.order=""] - Sort direction ("asc" or "desc").
 * @returns {Promise<Object>} Paginated response containing `data`
 *   (match list) and `pagination` metadata (previous/next links).
 */
export const getMatches = async ({
    page = 1,
    limit = 8,
    status = "",
    format = "",
    sortBy = "",
    order = "",
} = {}) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (status) {
        params.append("status", status);
    }

    if (format) {
        params.append("format", format);
    }

    if (sortBy) {
        params.append("sortBy", sortBy);
    }

    if (order) {
        params.append("order", order);
    }

    const { data } = await api.get(`/matches?${params.toString()}`);

    return data;
};

/**
 * Fetch a single match by its unique ID with all reference fields
 * (teams, winner, toss winner, man of the match) populated.
 *
 * Hits: GET /matches/:id
 *
 * @async
 * @param {string} id - Unique identifier of the match.
 * @returns {Promise<Object>} The matching match object.
 */
export const getMatchById = async (id) => {
    const { data } = await api.get(`/matches/${id}`);

    return data.data;
};

/**
 * Create a new match (admin only).
 * Hits: POST /matches
 */
export const createMatch = async (matchData) => {
    const { data } = await api.post("/matches", matchData);
    return data.data;
};

/**
 * Update an existing match by ID (admin only).
 * Hits: PATCH /matches/:id
 */
export const updateMatch = async (id, matchData) => {
    const { data } = await api.patch(`/matches/${id}`, matchData);
    return data.data;
};

/**
 * Delete a match by ID (admin only).
 * Hits: DELETE /matches/:id
 */
export const deleteMatch = async (id) => {
    const { data } = await api.delete(`/matches/${id}`);
    return data;
};