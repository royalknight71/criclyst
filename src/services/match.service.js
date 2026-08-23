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