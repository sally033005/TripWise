import { tripService } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InviteModal from "./InviteModal";
import { TripResponseDTO } from "@/types";

interface Props {
    tripId: number;
    creatorName: string;
    collaboratorNames: string[];
    currentUsername?: string;
}

export default function CollaboratorList({ tripId, creatorName, collaboratorNames, currentUsername }: Props) {
    const normalizedCurrent = currentUsername?.toLowerCase();
    const normalizedCreator = creatorName?.toLowerCase();

    const isOwner = normalizedCurrent === normalizedCreator;
    const isCollaborator = collaboratorNames.some(name => name.toLowerCase() === normalizedCurrent);

    const showLeaveButton = !!normalizedCurrent && isCollaborator && !isOwner;
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [trip, setTrip] = useState<TripResponseDTO | null>(null);

    const refreshData = async () => {
        if (!isNaN(tripId)) {
            const updatedTrip = await tripService.getTripById(tripId);
            setTrip(updatedTrip);
        }
    };

    const getBgColor = (name: string, isOwner: boolean) => {
        if (isOwner) return "bg-slate-800 text-white border-yellow-400";
        const colors = ["bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-rose-100 text-rose-600"];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const router = useRouter();

    const handleLeave = async () => {
        if (!window.confirm("Are you sure you want to leave this trip?")) return;
        try {
            await tripService.leaveTrip(tripId);
            alert("You have left the trip.");
            router.push("/trips");
        } catch (err: any) {
            alert(err.response?.data || "Failed to leave trip.");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
                {/* Trip Owner */}
                <div title={`Owner: ${creatorName}`}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold z-30 transition-transform hover:scale-110 ${getBgColor(creatorName, true)}`}>
                    {creatorName[0]?.toUpperCase() || "?"}
                </div>

                {/* Collaborators */}
                {collaboratorNames.map((name, index) => (
                    <div
                        key={index}
                        title={name}
                        style={{ zIndex: 20 - index }}
                        className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold hover:z-40 transition-all cursor-default ${getBgColor(name, false)}`}
                    >
                        {name[0]?.toUpperCase() || "?"}
                    </div>
                ))}
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {collaboratorNames.length + 1} People
                </span>

                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                    Planning together
                </span>
            </div>

            {showLeaveButton ? (
                <div className="ml-auto pl-4 border-l border-slate-200">
                    <button
                        onClick={handleLeave}
                        className="flex items-center gap-1 text-[10px] uppercase tracking-tighter font-black text-rose-400 hover:text-rose-600 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Leave
                    </button>
                </div>
            ) : isOwner ? (
                <div className="ml-auto pl-4 border-l border-slate-200">
                    {/* Invite Button */}
                    <button
                        onClick={() => setIsInviteOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all"
                    >
                        <span className="text-lg">+</span> Invite Partner
                    </button>
                </div>
            ) : null}
            <InviteModal
                tripId={tripId}
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={(name) => {
                    refreshData();
                }}
            />
        </div>

    );
}