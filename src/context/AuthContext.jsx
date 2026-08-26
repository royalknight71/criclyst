/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authService
            .getProfile()
            .then((u) => setUser(u))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        const u = await authService.login(credentials);
        setUser(u);
        return u;
    };

    const register = async (data) => {
        return await authService.register(data);
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
