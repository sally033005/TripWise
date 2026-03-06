import { TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useRef, useState, useEffect } from "react";
import CollaboratorList from "./CollaboratorList";

interface OverviewProps {
    trip: TripResponseDTO;
}

export default function OverviewSection({ trip }: OverviewProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && trip.id) {
            try {
                await tripService.uploadCoverPhoto(trip.id, file);
                window.location.reload();
            } catch (err) {
                alert("Failed to upload cover photo");
            }
        }
    };

    const coverImageUrl = trip.coverPhoto
        ? `http://localhost:8080${trip.coverPhoto}`
        : "https://images.unsplash.com/photo-1514894780063-5881f76e84d4?q=80&w=2070";

    const calculateDays = () => {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const getCountdown = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(trip.startDate);
        const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const totalActivities = Object.values(trip.dailyItinerary || {}).reduce(
        (acc, day) => acc + (day?.length || 0), 0
    );

    const [currentUsername, setCurrentUsername] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        if (storedUser) {
            setCurrentUsername(storedUser);
        }
    }, []);

    return (
        <div className="space-y-6 pb-10 transition-colors duration-300">
            {/* 1. Main Banner Card */}
            <div className="relative h-[350px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl group bg-card">
                <img
                    src={coverImageUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 right-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-all border border-white/30"
                        title="Change cover photo"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </button>
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                    <h1 className="text-4xl font-black mb-2">{trip.title || trip.destination}</h1>
                    <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                        <span className="flex items-center gap-1">📍 {trip.destination}</span>
                        <span className="flex items-center gap-1">📅 {trip.startDate} - {trip.endDate}</span>
                    </div>
                </div>
            </div>

            {/* 2. Info Grid (Three Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Countdown", value: `${getCountdown()} Days`, sub: "until trip starts", icon: "🕒" },
                    { label: "Total Spent", value: `$${trip.totalSpent.toLocaleString()}`, sub: "spent so far", icon: "💰" },
                    { label: "Itinerary", value: `${totalActivities} Items`, sub: "planned activities", icon: "📅" }
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-card p-8 rounded-[2rem] border border-card-border shadow-sm flex flex-col justify-between transition-all duration-300"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-4">
                                <span className="text-base">{item.icon}</span> {item.label}
                            </div>

                            <div className="text-4xl font-black text-main-text transition-colors">
                                {item.value}
                            </div>
                        </div>

                        <p className="text-slate-500 dark:text-slate-300 text-sm mt-4 font-medium">
                            {item.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* 3. Quick Summary Section */}
            <div className="bg-card p-8 rounded-[2rem] border border-card-border shadow-sm transition-all duration-300">
                <h4 className="text-lg font-black text-main-text mb-4">Quick Summary</h4>
                <p className="text-slate-500 dark:text-slate-300 leading-relaxed font-medium">
                    You are traveling to <span className="text-main-text font-bold">{trip.destination}</span> for <span className="text-main-text font-bold">{calculateDays()} days</span>.
                    You have <span className="text-main-text font-bold">{trip.reservations.length}</span> reservations.
                </p>
            </div>

            {/* 4. Collaborators Section */}
            <div className="bg-card p-8 rounded-[2rem] border border-card-border shadow-sm transition-all duration-300">
                <h4 className="text-lg font-black text-main-text mb-4">Travel Partners</h4>
                <CollaboratorList
                    tripId={trip.id}
                    creatorName={trip.creatorName}
                    collaboratorNames={trip.collaboratorNames || []}
                    currentUsername={currentUsername}
                />
            </div>
        </div>
    );
}