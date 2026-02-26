import { TripResponseDTO } from "@/types";

interface OverviewProps {
    trip: TripResponseDTO;
}

export default function OverviewSection({ trip }: OverviewProps) {
    // Calculate days remaining until the trip starts
    const getDaysRemaining = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(trip.startDate);

        const diffTime = start.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const daysRemaining = getDaysRemaining();

    return (
        <div className="space-y-8">
            {/* 1. Countdown Hero Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-blue-100 font-medium mb-2 uppercase tracking-widest text-sm">
                        {daysRemaining > 0 ? "Upcoming Adventure" : "Trip in Progress"}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-black">
                            {daysRemaining > 0 ? daysRemaining : "Live"}
                        </span>
                        <span className="text-2xl font-bold opacity-80">
                            {daysRemaining > 0 ? "Days to go" : "Now"}
                        </span>
                    </div>
                    <p className="mt-6 text-blue-100 flex items-center gap-2">
                        📅 {trip.startDate} — {trip.endDate}
                    </p>
                </div>

                {/* 2. Decorative Palm Tree Emoji */}
                <div className="absolute -right-10 -bottom-10 text-[12rem] opacity-10 rotate-12">
                    ✈️
                </div>
            </div>

            {/* 3. Summarize key trip details in a clean grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-sm font-bold mb-2 uppercase">Destination</div>
                    <div className="text-2xl font-black text-gray-800">{trip.destination}</div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-sm font-bold mb-2 uppercase">Total Budget</div>
                    <div className="text-2xl font-black text-gray-800">
                        ${trip.totalBudget.toLocaleString()}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="text-gray-400 text-sm font-bold mb-2 uppercase">Reservations</div>
                    <div className="text-2xl font-black text-gray-800">
                        {trip.reservations.length} Files
                    </div>
                </div>
            </div>
        </div>
    );
}