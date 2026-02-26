"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { tripService } from "../../../services/api";
import { TripResponseDTO } from "../../../types";
import AddActivityModal from "@/app/components/AddActivityModal";
import FileUpload from "@/app/components/FileUpload";
import EditActivityModal from "@/app/components/EditActivityModal";

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

    useEffect(() => {
        if (id) {
            tripService.getTripById(Number(id)).then(setTrip);
        }
    }, [id]);

    if (!trip) return <div className="p-10 text-center">Loading Details...</div>;

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header */}
            <section className="border-b pb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">{trip.title}</h1>
                <p className="text-xl text-gray-500 mt-2">📍 {trip.destination}</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold">Itinerary</h2>
                    {Object.entries(trip.dailyItinerary).map(([date, items], index) => (
                        <div key={date}>
                            <h3 className="text-xl font-bold">
                                Day {index + 1} <span className="text-gray-400 text-sm">({date})</span>
                            </h3>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="group relative bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs font-bold text-blue-500 mb-1">{formatTime(item.startTime)}</div>
                                                <div className="font-bold text-gray-800 text-lg">{item.activity}</div>
                                                {item.location && <div className="text-sm text-gray-400 mt-1">📍 {item.location}</div>}
                                            </div>

                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-10 right-10 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                >
                    +
                </button>
                <AddActivityModal
                    tripId={Number(id)}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => window.location.reload()}
                />

                <div className="space-y-6">
                    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            Reservations <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded-full">{trip.reservations.length}</span>
                        </h2>

                        <div className="space-y-3">
                            {trip.reservations.map(res => (
                                <div key={res.id} className="group flex items-center gap-2">
                                    <a
                                        href={`http://localhost:8080${res.downloadUrl}`}
                                        target="_blank"
                                        className="flex items-center p-3 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all flex-1 min-w-0"
                                    >
                                        <span className="text-2xl mr-3">📄</span>
                                        <span className="text-sm font-medium text-gray-700 truncate">{res.fileName}</span>
                                    </a>

                                    <button
                                        onClick={async () => {
                                            if (confirm("Delete this file?")) {
                                                try {
                                                    await tripService.deleteReservation(res.id);
                                                    window.location.reload();
                                                } catch (err) {
                                                    alert("Failed to delete reservation.");
                                                }
                                            }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <FileUpload tripId={Number(id)} onSuccess={() => window.location.reload()} />
                    </div>
                </div>
            </div>
            <EditActivityModal
                tripId={Number(id)}
                item={editingItem}
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                onSuccess={() => window.location.reload()}
            />
        </main>
    );
}