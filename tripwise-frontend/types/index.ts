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
  filePath: string;
  downloadUrl: string;
  category: string;
  description?: string;
}

export interface TripResponseDTO {
  id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  creatorName: string;
  collaboratorNames: string[];
  totalBudget: number;
  totalSpent: number;
  spentByPerson: Record<string, number>;
  expenses: ExpenseDTO[];
  coverPhoto?: string;

  dailyItinerary: {
    [key: string]: ItineraryItem[];
  };
  reservations: ReservationDTO[];
}

export enum ExpenseCategory {
  TRANSPORTATION = "TRANSPORTATION",
  FOOD = "FOOD",
  ACCOMMODATION = "ACCOMMODATION",
  SHOPPING = "SHOPPING",
  OTHERS = "OTHERS"
}

export interface ExpenseDTO {
  id?: number;
  description: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string;
}
