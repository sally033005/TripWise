"use client";

import { useEffect, useState } from "react";
import { tripService } from "../services/api";
import { TripResponseDTO } from "../types";
import Link from "next/link"

export default function Home() {
  const [trips, setTrips] = useState<TripResponseDTO[]>([]);

  useEffect(() => {
    tripService.getAllTrips()
      .then(data => setTrips(data))
      .catch(err => console.error("Error fetching trips:", err));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">TripWise</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <div key={trip.id} className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{trip.title}</h2>
              <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                {trip.destination}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">📅</span>
                {trip.startDate} — {trip.endDate}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">👤</span>
                Hosted by {trip.creator?.username ?? "Anonymous"}
              </div>
            </div>

            <Link href={`/trips/${trip.id}`}>
              <button className="mt-6 w-full py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}