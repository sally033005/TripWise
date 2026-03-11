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
            // Set a cookie to indicate the user is logged in (expires in 1 day)
            Cookies.set('is_logged_in', 'true', { expires: 1, path: '/' });

            window.dispatchEvent(new Event("storage"));
        }
        return response.data;
    },

    // Logout
    logout: async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            // Clear client-side auth state regardless of server response
            Cookies.remove('is_logged_in', { path: '/' });
            localStorage.removeItem("username");
            window.location.href = "/login";
        }
    }
};