"use client";
import { useEffect, useState } from "react";
import { tripService } from "../services/api";
import { TripResponseDTO } from "../types";
import Link from "next/link";
import CreateTripModal from "./components/CreateTripModal";
import EditTripModal from "./components/EditTripModal";

export default function Home() {
  const [trips, setTrips] = useState<TripResponseDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripResponseDTO | null>(null);

  const fetchTrips = () => {
    tripService.getAllTrips()
      .then(setTrips)
      .catch(err => console.error("Error fetching trips:", err));
  };

  useEffect(() => { fetchTrips(); }, []);

  // Split trips into upcoming and past based on endDate
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips.filter(trip => trip.endDate >= todayStr);
  const pastTrips = trips.filter(trip => trip.endDate < todayStr);

  const getCoverImageUrl = (path: string | null | undefined) => {
    return path
      ? `http://localhost:8080${path}`
      : "https://images.unsplash.com/photo-1514894780063-5881f76e84d4?q=80&w=2070";
  };

  const getCountdown = (startDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const TripCard = ({ trip, isPast = false }: { trip: TripResponseDTO, isPast?: boolean }) => (
    <div key={trip.id} className={`group bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col ${isPast ? 'grayscale-[0.5] opacity-90 hover:grayscale-0 hover:opacity-100' : ''}`}>
      <Link href={`/trips/${trip.id}`} className="flex flex-col h-full">
        {/* Card Image Area */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={getCoverImageUrl(trip.coverPhoto)}
            alt={trip.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

          {/* Countdown Badge - only shows on upcoming trips */}
          {!isPast && (
            <div className="absolute bottom-4 left-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
              🕒 {getCountdown(trip.startDate)} Days Left
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
            <button
              onClick={(e) => { e.preventDefault(); setEditingTrip(trip); }}
              className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all text-slate-600 dark:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (confirm("Delete this journey?")) {
                  await tripService.deleteTrip(trip.id);
                  fetchTrips();
                }
              }}
              className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all text-slate-600 dark:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-7 flex flex-col flex-grow">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium line-clamp-2 italic min-h-[40px]">
            {trip.description ? `"${trip.description}"` : "No description provided."}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex items-center text-sm font-bold text-slate-600 dark:text-slate-300">
              <span className="mr-3 text-lg">📍</span>
              {trip.destination}
            </div>
            <div className="flex items-center text-xs font-bold text-slate-400">
              <span className="mr-3 text-lg opacity-70">📅</span>
              {trip.startDate} — {trip.endDate}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">My Travels</h1>
            <p className="text-slate-400 font-medium mt-1">Plan your next adventure together</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest"
          >
            <span className="text-lg">+</span> New Trip
          </button>
        </div>

        {/* Upcoming Trips Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Upcoming Journeys</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              {upcomingTrips.length} Active
            </span>
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No upcoming trips yet ✈️</p>
            </div>
          )}
        </section>

        {/* Past Trips Section */}
        <section className="pb-10">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 opacity-60 italic">Memories</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 opacity-40" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {pastTrips.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} isPast={true} />)}
          </div>
        </section>
      </div>

      <CreateTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTrips} />
      {editingTrip && (
        <EditTripModal
          isOpen={!!editingTrip}
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onSuccess={fetchTrips}
        />
      )}
    </main>
  );
}