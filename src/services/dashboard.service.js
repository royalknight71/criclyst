/**
 * Dashboard service.
 *
 * Encapsulates dashboard-related HTTP calls to the backend REST API
 * via the shared Axios instance.
 */

import api from "../api/axios";

/**
 * Fetch aggregate statistics for the home dashboard
 * (e.g. totals for players, teams and matches).
 *
 * Hits: GET /dashboard/stats
 *
 * @async
 * @returns {Promise<Object>} Aggregated dashboard stats object.
 */
export const getDashboardStats=async ()=>{
    const {data}=await api.get(
        "/dashboard/stats"
    )

    return data.data
}