/**
 * Authentication service.
 *
 * Encapsulates all auth-related HTTP calls to the backend REST API
 * via the shared Axios instance.
 */

import api from "../api/axios";

/**
 * Register a new user.
 *
 * Hits: POST /users/register
 *
 * @async
 * @param {Object} data - Registration payload (name, email, password).
 * @returns {Promise<Object>} Created user object (without password).
 */
export const register = async (data) => {
    const { data: res } = await api.post("/users/register", data);
    return res.data;
};

/**
 * Log in an existing user.
 *
 * Hits: POST /users/login
 *
 * @async
 * @param {Object} data - Login payload (email, password).
 * @returns {Promise<Object>} Authenticated user object.
 */
export const login = async (data) => {
    const { data: res } = await api.post("/users/login", data);
    return res.user;
};

/**
 * Log out the current user (blacklists the JWT cookie server-side).
 *
 * Hits: POST /users/logout
 *
 * @async
 * @returns {Promise<void>}
 */
export const logout = async () => {
    await api.post("/users/logout");
};

/**
 * Fetch the currently authenticated user's profile.
 *
 * Hits: GET /users/profile
 *
 * @async
 * @returns {Promise<Object>} Authenticated user object.
 */
export const getProfile = async () => {
    const { data: res } = await api.get("/users/profile");
    return res.data;
};
