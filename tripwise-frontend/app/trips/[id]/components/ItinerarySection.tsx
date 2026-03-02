"use client";

import { TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useEffect, useState } from "react";
import AddActivityModal from "@/app/trips/[id]/components/AddActivityModal";
import { useParams } from "next/navigation";
import EditActivityModal from "@/app/trips/[id]/components/EditActivityModal";

export default function ItinerarySection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const formatTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getAllDates = (start: string, end: string) => {
        const dates = [];
        let current = new Date(start);
        const last = new Date(end);
        while (current <= last) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const handleDeleteItem = async (itemId: number) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            await tripService.deleteItineraryItem(Number(id), itemId);
            window.location.reload();
        } catch (err) {
            alert("Failed to delete itinerary item.");
        }
    };

    useEffect(() => {
        if (id) {
            tripService.getTripById(Number(id)).then((data) => {
                setTrip(data);
                if (data.startDate) {
                    setSelectedDate(data.startDate.split('T')[0]);
                }
            });
        }
    }, [id]);

    if (!trip) return <div className="p-10 text-center text-main-text">Loading Itinerary...</div>;

    const allDates = getAllDates(trip.startDate, trip.endDate);

    return (
        <div className="space-y-8 min-h-screen pb-24 transition-colors duration-300">
            <div className="space-y-6 relative">
                {/* 📅 Date Selector */}
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                    {allDates.map((date, index) => (
                        <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`flex-shrink-0 min-w-[100px] px-4 py-3 rounded-2xl font-bold transition-all border ${selectedDate === date
                                    ? "bg-blue-600 text-white border-blue-600 shadow-lg dark:shadow-blue-900/20 scale-105"
                                    : "bg-card text-slate-400 border-card-border hover:border-slate-300 dark:hover:border-slate-600"
                                }`}
                        >
                            <div className="text-[10px] uppercase opacity-70">Day {index + 1}</div>
                            <div className="text-sm">{date.split('-').slice(1).join('/')}</div>
                        </button>
                    ))}
                </div>

                {/* 📍 Content Container */}
                <div className="max-w-3xl">
                    {selectedDate && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-card-border pb-4">
                                <h2 className="text-2xl font-black text-main-text">
                                    Day {allDates.indexOf(selectedDate) + 1}
                                </h2>
                                <span className="bg-card text-slate-500 border border-card-border px-3 py-1 rounded-full text-sm font-bold">
                                    {selectedDate}
                                </span>
                            </div>

                            { (trip.dailyItinerary?.[selectedDate] ?? []).length > 0 ? (
                                <div className="space-y-4">
                                    {trip.dailyItinerary[selectedDate].map((item) => (
                                        <div key={item.id} className="group relative bg-card border border-card-border p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className="text-center min-w-[60px]">
                                                        <div className="text-sm font-black text-blue-600 dark:text-blue-400">{formatTime(item.startTime)}</div>
                                                        {/* Timeline Line */}
                                                        <div className="w-0.5 h-10 bg-blue-100 dark:bg-slate-800 mx-auto my-1"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-main-text text-lg">{item.activity}</div>
                                                        {item.location && (
                                                            <div className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                                                📍 {item.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* ⛱️ Empty State */
                                <div className="py-20 text-center bg-card border-2 border-dashed border-card-border rounded-3xl">
                                    <p className="text-slate-400 font-medium">No plans for today ⛱️</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-4 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                                    >
                                        + Add something to do
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ➕ Floating Action Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 right-10 bg-blue-600 dark:bg-blue-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all z-50"
                >
                    +
                </button>
            </div>

            {/* Modals remain the same */}
            <AddActivityModal
                tripId={Number(id)}
                isOpen={isModalOpen}
                initialDate={selectedDate}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => window.location.reload()}
            />
            <EditActivityModal
                tripId={Number(id)}
                item={editingItem}
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}