import axios from 'axios';
import { TripResponseDTO, ItineraryItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://tripwise-qxu7.onrender.com/api'
        : 'http://localhost:8080/api');

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            import('js-cookie').then((Cookies) => {
                Cookies.default.remove('is_logged_in', { path: '/' });
            });
            localStorage.removeItem("username");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;

export const FILE_BASE_URL = API_BASE_URL.replace('/api', '');

export const tripService = {
    // 1. Get all trips for the user
    getAllTrips: async () => {
        const response = await api.get<TripResponseDTO[]>('/trips');
        return response.data;
    },

    // 2. Get details of a specific trip by ID
    getTripById: async (id: string) => {
        const response = await api.get<TripResponseDTO>(`/trips/${id}`);
        return response.data;
    },

    // 3. Detele reservation by ID
    deleteReservation: async (resId: number) => {
        await api.delete(`/reservations/${resId}`);
    },

    // 4. Add a new itinerary item to a trip
    addItineraryItem: async (tripId: string, itemData: any) => {
        const response = await api.post(`/trips/${tripId}/itinerary`, itemData);
        return response.data;
    },

    // 5. Delete an itinerary item from a trip
    deleteItineraryItem: async (tripId: string, itemId: number) => {
        await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
    },

    // 6. Edit an itinerary item in a trip
    updateItineraryItem: async (tripId: string, itemId: number, itemData: any) => {
        const response = await api.put(`/trips/${tripId}/itinerary/${itemId}`, itemData);
        return response.data;
    },

    // 7. Add a new expense to a trip
    addExpense: async (tripId: string, data: any) => {
        const response = await api.post(`/expenses/trip/${tripId}`, data);
        return response.data;
    },

    // 8. Delete an expense from a trip
    deleteExpense: async (expenseId: number) => {
        await api.delete(`/expenses/${expenseId}`);
    },

    // 9. Update the total budget of a trip
    updateTripBudget: async (tripId: string, totalBudget: number) => {
        await api.patch(`/trips/${tripId}/budget`, totalBudget, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // 10. Upload a cover photo for a trip
    uploadCoverPhoto: async (tripId: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post(`/trips/${tripId}/upload-cover`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    },

    // 11. Upload a reservation file with a category
    uploadReservation: async (tripId: string, file: File, category: string, description: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("description", description);

        const response = await api.post(`/trips/${tripId}/reservations/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        return response.data;
    },

    // 12. Create a new trip
    createTrip: async (tripData: any) => {
        const response = await api.post<TripResponseDTO>('/trips', tripData);
        return response.data;
    },

    // 13. Delete a trip
    deleteTrip: async (tripId: string) => {
        await api.delete(`/trips/${tripId}`);
    },

    // 14. Update an existing trip
    updateTrip: async (tripId: string, tripData: any) => {
        const response = await api.put<TripResponseDTO>(`/trips/${tripId}`, tripData);
        return response.data;
    },

    // 15. Add a collaborator (Invite)
    addCollaborator: async (tripId: string, username: string) => {
        const response = await api.post(`/trips/${tripId}/collaborators`, {
            username
        });
        return response.data;
    },

    // 16. Remove self from collaborators (Leave trip)
    leaveTrip: async (tripId: string) => {
        const response = await api.delete(`/trips/${tripId}/collaborators/self`);
        return response.data;
    },

    // 17. Remove a specific collaborator (Kick)
    kickCollaborator: async (tripId: string, username: string) => {
        const response = await api.delete(`/trips/${tripId}/collaborators/${username}`);
        return response.data;
    },
};