import { TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useEffect, useState } from "react";
import FileUpload from "@/app/components/FileUpload";
import { useParams } from "next/navigation";

export default function ReservationsSection() {
    const { id } = useParams();
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);

    useEffect(() => {
        if (id) {
            tripService.getTripById(Number(id)).then(setTrip);
        }
    }, [id]);

    if (!trip) return <div className="p-10 text-center">Loading Details...</div>;

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                    <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            Reservations <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded-full">{trip.reservations.length}</span>
                        </h2>

                        <div className="space-y-3">
                            {trip.reservations.map(res => (
                                <div key={res.id} className="group flex items-center gap-2">
                                    <a
                                        href={`http://localhost:8080/api/reservations/download/${res.id}`}
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
    );
}