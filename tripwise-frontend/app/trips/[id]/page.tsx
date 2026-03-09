"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tripService } from "../../../services/api";
import { TripResponseDTO } from "../../../types";
import OverviewSection from "./components/OverviewSection";
import ItinerarySection from "./components/ItinerarySection";
import ExpensesSection from "./components/ExpensesSection";
import ReservationsSection from "./components/ReservationsSection";
import ForbiddenPage from "./components/ForbiddenPage"; 
import ErrorPage from "./components/ErrorPage";        

type TabType = 'overview' | 'itinerary' | 'expenses' | 'reservations';

export default function TripDetail({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const tripId = unwrappedParams.id;

    const router = useRouter();
    const searchParams = useSearchParams();

    const activeTab = (searchParams.get('tab') as TabType) || 'overview';
    
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorStatus, setErrorStatus] = useState<number | null>(null);

    const refreshData = async () => {
        setLoading(true);
        try {
            if (tripId) {
                const data = await tripService.getTripById(tripId);
                setTrip(data);
                setErrorStatus(null);
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            setErrorStatus(err.response?.status || 500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [tripId]);

    const handleTabChange = (tab: TabType) => {
        router.push(`?tab=${tab}`, { scroll: false });
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">
                    Loading Journey...
                </div>
            </div>
        );
    }

    if (errorStatus === 403) {
        return <ForbiddenPage />;
    }

    if (errorStatus === 404 || !trip) {
        return <ErrorPage message="Trip not found" subtitle="The journey you are looking for doesn't exist." />;
    }

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-8 transition-colors duration-300">
            <section className="border-b border-card-border pb-4">
                <h1 className="text-4xl font-extrabold text-main-text">{trip.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">📍 {trip.destination}</p>
            </section>

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

            <div className="py-2">
                {activeTab === 'overview' && <OverviewSection trip={trip} />}
                {activeTab === 'itinerary' && <ItinerarySection trip={trip} onUpdate={refreshData} />}
                {activeTab === 'expenses' && <ExpensesSection trip={trip} onUpdate={refreshData} />}
                {activeTab === 'reservations' && <ReservationsSection trip={trip} onUpdate={refreshData} />}
            </div>
        </main>
    );
}