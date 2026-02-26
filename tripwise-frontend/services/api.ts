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
    }
};