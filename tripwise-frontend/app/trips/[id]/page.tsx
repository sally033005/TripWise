"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tripService } from "../../../services/api";
import { TripResponseDTO } from "../../../types";
import OverviewSection from "./components/OverviewSection";
import ItinerarySection from "./components/ItinerarySection";
import ExpensesSection from "./components/ExpensesSection";
import ReservationsSection from "./components/ReservationsSection";

type TabType = 'overview' | 'itinerary' | 'expenses' | 'reservations';

export default function TripDetail({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const tripId = unwrappedParams.id;

    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTab = (searchParams.get('tab') as TabType) || 'overview';
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);

    const refreshData = async () => {
        if (tripId) {
            const data = await tripService.getTripById(tripId);
            setTrip(data);
        }
    };

    useEffect(() => {
        refreshData();
    }, [tripId]);

    const handleTabChange = (tab: TabType) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    if (!trip) return <div className="p-10 text-center text-main-text">Loading Details...</div>;

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-8 transition-colors duration-300">
            {/* 1. Page Header */}
            <section className="border-b border-card-border pb-4">
                <h1 className="text-4xl font-extrabold text-main-text">{trip.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">📍 {trip.destination}</p>
            </section>

            {/* 2. Tabs Navigation */}
            <div className="flex border-b border-card-border gap-8">
                {(['overview', 'itinerary', 'expenses', 'reservations'] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* 3. Tab Content Area */}
            <div className="py-2">
                {activeTab === 'overview' && <OverviewSection trip={trip} />}
                {activeTab === 'itinerary' && <ItinerarySection trip={trip} onUpdate={refreshData} />}
                {activeTab === 'expenses' && <ExpensesSection trip={trip} onUpdate={refreshData} />}
                {activeTab === 'reservations' && <ReservationsSection trip={trip} onUpdate={refreshData} />}
            </div>
        </main>
    );
}