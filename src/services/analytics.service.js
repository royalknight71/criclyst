/**
 * Analytics service.
 *
 * Encapsulates analytics-related HTTP calls to the backend REST API
 * via the shared Axios instance. All statistics are computed in the
 * database by the backend aggregation endpoint.
 */

import api from "../api/axios";

/**
 * Fetch aggregated player analytics for the dashboard.
 *
 * Hits: GET /players/analytics[?country=][&role=]
 * The `country` and `role` filters are only appended when non-empty;
 * when omitted the analytics cover every player in the database.
 *
 * @async
 * @param {string} [country=""] - Optional country filter.
 * @param {string} [role=""] - Optional role filter.
 * @returns {Promise<Object>} Analytics payload containing `overview`,
 *   `roleDistribution`, `countryDistribution` and top-5 leaderboards
 *   (`topRunScorers`, `topWicketTakers`, `topBattingAverages`,
 *   `topStrikeRates`).
 */
export const getPlayerAnalytics = async (country = "", role = "") => {
  const params = new URLSearchParams();

  if (country.trim()) {
    params.append("country", country.trim());
  }

  if (role.trim()) {
    params.append("role", role.trim());
  }

  const query = params.toString();

  const { data } = await api.get(
    `/players/analytics${query ? `?${query}` : ""}`
  );

  return data.data;
};
