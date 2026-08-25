/**
 * Shared Axios instance for all API calls in the application.
 *
 * Pre-configured with a base URL pointing at the backend REST API.
 * Uses the Vite environment variable VITE_API_URL when available,
 * falling back to http://localhost:3000/api for local development.
 * Service modules import this instance so every request shares the
 * same base path and configuration.
 */

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export default api;