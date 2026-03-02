import Cookies from 'js-cookie';
import api from "./api";

export const authService = {
    // Register
    register: async (userData: any) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    // Login
    login: async (credentials: any) => {
        const response = await api.post("/auth/login", credentials);
        if (response.data && response.data.username) {
            localStorage.setItem("username", response.data.username);
            window.dispatchEvent(new Event("storage")); 
        }
        return response.data;
    },

    // Logout
    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout API failed, but clearing local data anyway.");
        } finally {
            localStorage.removeItem("username");
            window.location.href = "/login";
        }
    }
};