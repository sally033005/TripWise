import axios from 'axios';
import { TripResponseDTO, ItineraryItem } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const tripService = {
    // 1. Get all trips for the user
    getAllTrips: async () => {
        const response = await api.get<TripResponseDTO[]>('/trips');
        return response.data;
    },

    // 2. Get details of a specific trip by ID
    getTripById: async (id: number) => {
        const response = await api.get<TripResponseDTO>(`/trips/${id}`);
        return response.data;
    },

    // 3. Detele reservation by ID
    deleteReservation: async (resId: number) => {
        await api.delete(`/reservations/${resId}`);
    },

    // 4. Add a new itinerary item to a trip
    addItineraryItem: async (tripId: number, itemData: any) => {
        const response = await api.post(`/trips/${tripId}/itinerary`, itemData);
        return response.data;
    },

    // 5. Delete an itinerary item from a trip
    deleteItineraryItem: async (tripId: number, itemId: number) => {
        await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
    },

    // 6. Edit an itinerary item in a trip
    updateItineraryItem: async (tripId: number, itemId: number, itemData: any) => {
        const response = await api.put(`/trips/${tripId}/itinerary/${itemId}`, itemData);
        return response.data;
    },

    // 7. Add a new expense to a trip
    addExpense: async (tripId: number, data: any) => {
        const response = await api.post(`/expenses/trip/${tripId}`, data);
        return response.data;
    },

    // 8. Delete an expense from a trip
    deleteExpense: async (expenseId: number) => {
        await api.delete(`/expenses/${expenseId}`);
    },

    // 9. Update the total budget of a trip
    updateTripBudget: async (tripId: number, totalBudget: number) => {
        await api.patch(`/trips/${tripId}/budget`, totalBudget, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // 10. Upload a cover photo for a trip
    uploadCoverPhoto: async (tripId: number, file: File) => {
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
    uploadReservation: async (tripId: number, file: File, category: string, description: string) => {
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
};