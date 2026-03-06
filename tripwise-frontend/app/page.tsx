"use client";
import { useEffect, useState } from "react";
import { tripService } from "../services/api";
import { TripResponseDTO } from "../types";
import CreateTripModal from "./components/CreateTripModal";
import EditTripModal from "./components/EditTripModal";
import TripCard from "./components/TripCard";

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

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingTrips = trips
    .filter(trip => trip.endDate >= todayStr)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const pastTrips = trips
    .filter(trip => trip.endDate < todayStr)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

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

        {/* Upcoming Trips */}
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
              {upcomingTrips.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onRefresh={fetchTrips}
                  onEdit={setEditingTrip}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-xs tracking-widest">
              No upcoming trips yet ✈️
            </div>
          )}
        </section>

        {/* Memories */}
        <section className="pb-10">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 opacity-60 italic">Memories</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 opacity-40" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {pastTrips.length} Completed
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {pastTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                isPast
                onRefresh={fetchTrips}
                onEdit={setEditingTrip}
              />
            ))}
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