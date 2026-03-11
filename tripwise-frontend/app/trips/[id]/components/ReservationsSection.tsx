"use client";

import { TripResponseDTO } from "@/types";
import { tripService, FILE_BASE_URL } from "@/services/api";
import { useState } from "react";
import { useParams } from "next/navigation";
import AddReservationModal from "@/app/trips/[id]/components/AddReservationModal";

const CATEGORY_MAP: Record<string, { icon: string; label: string; color: string; iconColor: string }> = {
    FLIGHT: { icon: "✈️", label: "Flight", color: "bg-indigo-50", iconColor: "text-indigo-600" },
    HOTEL: { icon: "🏨", label: "Hotel", color: "bg-blue-50", iconColor: "text-blue-600" },
    INSURANCE: { icon: "🛡️", label: "Insurance", color: "bg-green-50", iconColor: "text-green-600" },
    CAR_RENTAL: { icon: "🚗", label: "Car Rental", color: "bg-orange-50", iconColor: "text-orange-600" },
    TICKETS: { icon: "🎟️", label: "Tickets", color: "bg-purple-50", iconColor: "text-purple-600" },
    OTHERS: { icon: "📄", label: "Others", color: "bg-gray-50", iconColor: "text-gray-600" },
};

export default function ReservationsSection({ trip, onUpdate }: { trip: TripResponseDTO, onUpdate: () => void }) {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (resId: number) => {
        if (confirm("Delete this document?")) {
            try {
                await tripService.deleteReservation(resId);
                onUpdate();
            } catch (err) {
                alert("Failed to delete.");
            }
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Area */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h2 className="text-4xl font-black text-main-text tracking-tight">Reservations</h2>
                    <p className="text-slate-400 font-medium">Your travel documents at a glance</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black dark:bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                    <span className="text-xl">+</span> Add Reservation
                </button>
            </div>

            {/* Reservations List */}
            <div className="flex flex-col gap-4">
                {trip.reservations && trip.reservations.length > 0 ? (
                    trip.reservations.map(res => {
                        const meta = CATEGORY_MAP[res.category] || CATEGORY_MAP["OTHERS"];
                        return (
                            <div key={res.id} className="group bg-white dark:bg-card border border-card-border p-6 rounded-[2rem] transition-all hover:shadow-xl flex items-center justify-between">
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${meta.color} dark:bg-slate-800 shadow-sm`}>
                                        <span className={meta.iconColor}>{meta.icon}</span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
                                            {meta.label}
                                        </p>
                                        <h3 className="text-xl font-black text-main-text truncate mb-1">
                                            {res.description || meta.label}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                                            {res.fileName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <a
                                        href={res.downloadUrl?.startsWith('http')
                                            ? res.downloadUrl
                                            : `${FILE_BASE_URL}/api/reservations/download/${res.id}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-100 dark:bg-slate-800 text-main-text px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                                    >
                                        View File
                                    </a>

                                    <button
                                        onClick={() => handleDelete(res.id)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center bg-slate-50 dark:bg-card border-2 border-dashed border-card-border rounded-[3rem]">
                        <p className="text-slate-400 font-bold">Your travel wallet is empty</p>
                    </div>
                )}
            </div>

            <AddReservationModal
                tripId={id as string}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onUpdate}
            />
        </div>
    );
}