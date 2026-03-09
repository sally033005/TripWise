"use client";

import { tripService } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InviteModal from "./InviteModal";

interface Props {
    tripId: string;
    creatorName: string;
    collaboratorNames: string[];
    currentUsername?: string;
}

export default function CollaboratorList({ tripId, creatorName, collaboratorNames, currentUsername }: Props) {
    const router = useRouter();
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Normalize usernames for case-insensitive comparison
    const normalizedCurrent = currentUsername?.trim().toLowerCase();
    const normalizedCreator = creatorName?.trim().toLowerCase();

    const isOwner = !!normalizedCurrent && normalizedCurrent === normalizedCreator;
    const isCollaborator = collaboratorNames.some(
        name => name.trim().toLowerCase() === normalizedCurrent
    );

    // Only show "Leave Trip" button if user is a collaborator but not the owner
    const showLeaveButton = isCollaborator && !isOwner;

    const getBgColor = (name: string, isOwner: boolean) => {
        if (isOwner) return "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100";
        const colors = [
            "bg-blue-100 text-blue-600 border-blue-200", 
            "bg-emerald-100 text-emerald-600 border-emerald-200", 
            "bg-rose-100 text-rose-600 border-rose-200",
            "bg-amber-100 text-amber-600 border-amber-200"
        ];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const handleLeave = async () => {
        if (!window.confirm("Are you sure you want to leave this trip?")) return;
        try {
            await tripService.leaveTrip(tripId); 
            alert("You have left the trip.");
            router.push("/");
        } catch (err: any) {
            alert(err.response?.data || "Failed to leave trip.");
        }
    };

    return (
        <div className="flex items-center gap-5">
            <div className="flex items-center">
                <div className="flex -space-x-3 overflow-hidden">
                    <div 
                        title={`Owner: ${creatorName}`}
                        className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center font-black z-30 shadow-sm transition-transform hover:scale-110 cursor-help ${getBgColor(creatorName, true)}`}
                    >
                        {creatorName[0]?.toUpperCase() || "O"}
                        <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                    </div>

                    {collaboratorNames.map((name, index) => (
                        <div
                            key={`${name}-${index}`}
                            title={`Collaborator: ${name}`}
                            className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center font-bold hover:z-40 transition-all cursor-default shadow-sm ${getBgColor(name, false)}`}
                            style={{ zIndex: 20 - index }}
                        >
                            {name[0]?.toUpperCase() || "?"}
                        </div>
                    ))}
                </div>

                <div className="ml-4 flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {collaboratorNames.length + 1} Members
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                        Collaborating
                    </span>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
                {showLeaveButton && (
                    <button
                        onClick={handleLeave}
                        className="flex items-center gap-1.5 px-4 py-2 text-[10px] uppercase font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-rose-100 dark:border-rose-900/50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Leave Trip
                    </button>
                )}

                {isOwner && (
                    <button
                        onClick={() => setIsInviteOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                        <span className="text-base">+</span> INVITE PARTNER
                    </button>
                )}
            </div>

            <InviteModal
                tripId={tripId}
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </div>
    );
}