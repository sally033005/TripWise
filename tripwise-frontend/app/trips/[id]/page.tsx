"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tripService } from "../../../services/api";
import { TripResponseDTO } from "../../../types";
import AddActivityModal from "@/app/components/AddActivityModal";
import FileUpload from "@/app/components/FileUpload";
import EditActivityModal from "@/app/components/EditActivityModal";
import ExpensesSection from "./components/ExpensesSection";
import OverviewSection from "./components/OverviewSection";
import ItinerarySection from "./components/ItinerarySection";
import ReservationsSection from "./components/ReservationsSection";

type TabType = 'overview' | 'itinerary' | 'expenses' | 'reservations';

export default function TripDetail() {
    const { id } = useParams();
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const [editingItem, setEditingItem] = useState<any>(null);

    const handleDeleteItem = async (itemId: number) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            await tripService.deleteItineraryItem(Number(id), itemId);
            // After deletion, we can either refetch the trip details or simply reload the page to reflect changes.
            window.location.reload();
        } catch (err) {
            alert("Failed to delete itinerary item.");
        }
    };

    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedDay, setSelectedDay] = useState<string | null>(null); // To track which day's itinerary is being viewed

    useEffect(() => {
        if (id) {
            tripService.getTripById(Number(id)).then(setTrip);
        }
    }, [id]);

    if (!trip) return <div className="p-10 text-center">Loading Details...</div>;

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header */}
            <section className="border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">{trip.title}</h1>
                <p className="text-gray-500">📍 {trip.destination}</p>
            </section>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 gap-8">
                {['overview', 'itinerary', 'expenses', 'reservations'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as TabType)}
                        className={`pb-4 text-sm font-bold capitalize transition-all ${
                            activeTab === tab 
                            ? "border-b-2 border-blue-600 text-blue-600" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="py-6">
                {activeTab === 'overview' && <OverviewSection trip={trip} />}
                {activeTab === 'itinerary' && <ItinerarySection />}
                {activeTab === 'expenses' && <ExpensesSection trip={trip} />}
                {activeTab === 'reservations' && <ReservationsSection />}
            </div>
        </main>
    );
}