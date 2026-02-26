export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ItineraryItem {
  id: number;
  startTime: string;
  endTime?: string;
  activity: string;
  location?: string;
  notes?: string;
}

export interface ReservationDTO {
  id: number;
  fileName: string;
  downloadUrl: string;
}

export interface TripResponseDTO {
  id: number;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  creator: User;
  collaborators: User[];

  // The daily itinerary is a mapping of date strings (e.g., "2024-07-01") to arrays of itinerary items for that day.
  dailyItinerary: {
    [key: string]: ItineraryItem[];
  };
  reservations: ReservationDTO[];
}