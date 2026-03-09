"use client";

import Link from "next/link";
import { TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useEffect, useState } from "react";

interface TripCardProps {
    trip: TripResponseDTO;
    isPast?: boolean;
    onRefresh: () => void;
    onEdit: (trip: TripResponseDTO) => void;
}

const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070", 
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073",
    "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073", 
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
];

export default function TripCard({ trip, isPast = false, onRefresh, onEdit }: TripCardProps) {
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);

    // 1. 初始化時拎返當前 User
    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        setCurrentUsername(storedUser);
    }, []);

    // 2. 權限判斷
    const isOwner = currentUsername?.toLowerCase() === trip.creatorName?.toLowerCase();
    const isMember = isOwner || trip.collaboratorNames?.some(name => name.toLowerCase() === currentUsername?.toLowerCase());

    const getCoverImageUrl = () => {
        if (trip.coverPhoto) {
            return `http://localhost:8080${trip.coverPhoto}`;
        }
        const seed = String(trip.id).charCodeAt(0) || 0;
        const index = seed % DEFAULT_IMAGES.length;
        return DEFAULT_IMAGES[index];
    };

    const getCountdown = (startDate: string) => {
        if (!startDate) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(startDate);
        const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Delete this journey?")) {
            try {
                await tripService.deleteTrip(trip.id);
                onRefresh();
            } catch (err: any) {
                alert(err.response?.data || "Delete failed");
            }
        }
    };

    return (
        <div className={`group bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col ${isPast ? 'grayscale-[0.5] opacity-90 hover:grayscale-0 hover:opacity-100' : ''}`}>
            <Link href={`/trips/${trip.id}`} className="flex flex-col h-full">
                <div className="relative h-52 w-full overflow-hidden">
                    <img
                        src={getCoverImageUrl()}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

                    {!isPast && (
                        <div className="absolute bottom-4 left-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                            🕒 {getCountdown(trip.startDate) > 0 ? `${getCountdown(trip.startDate)} Days Left` : "Happening Now!"}
                        </div>
                    )}

                    {/* Buttons Logic */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                        {isMember && (
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(trip); }}
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all text-slate-600 dark:text-slate-300"
                                title="Edit Trip"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                        )}

                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all text-slate-600 dark:text-slate-300"
                                title="Delete Trip"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-7 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                            {trip.title}
                        </h3>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium line-clamp-2 italic min-h-[40px]">
                        {trip.description ? `"${trip.description}"` : "No description provided."}
                    </p>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            <span className="mr-3 text-lg">📍</span>
                            {trip.destination}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs font-bold text-slate-400">
                                <span className="mr-3 text-lg opacity-70">📅</span>
                                {trip.startDate} — {trip.endDate}
                            </div>
                            
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                By {trip.creatorName}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}