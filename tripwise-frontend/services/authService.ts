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
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);

            Cookies.set('is_logged_in', 'true', { expires: 1, path: '/' });
            window.dispatchEvent(new Event("storage"));
        }
        return response.data;
    },

    // Logout
    logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        Cookies.remove('is_logged_in');
        window.location.href = "/login";
    }
};