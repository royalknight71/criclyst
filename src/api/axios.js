/**
 * Shared Axios instance for all API calls in the application.
 *
 * Pre-configured with a base URL pointing at the backend REST API
 * (http://localhost:3000/api). Service modules import this instance
 * so every request shares the same base path and configuration.
 */

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

export default api;