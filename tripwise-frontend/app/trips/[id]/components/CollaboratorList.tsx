"use client";

import { tripService } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MemberManagementModal from "./MemberManagementModal";

interface Props {
    tripId: string;
    creatorName: string;
    collaboratorNames: string[];
    currentUsername?: string;
}

export default function CollaboratorList({ tripId, creatorName, collaboratorNames, currentUsername }: Props) {
    const router = useRouter();
    const [isManageOpen, setIsManageOpen] = useState(false);

    const normalizedCurrent = currentUsername?.trim().toLowerCase();
    const normalizedCreator = creatorName?.trim().toLowerCase();

    const isOwner = !!normalizedCurrent && normalizedCurrent === normalizedCreator;
    const isCollaborator = collaboratorNames.some(
        name => name.trim().toLowerCase() === normalizedCurrent
    );

    const showLeaveButton = isCollaborator && !isOwner;

    const getBgColor = (name: string, isOwner: boolean) => {
        if (isOwner) return "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100";
        const colors = ["bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-rose-100 text-rose-600", "bg-amber-100 text-amber-600"];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return `${colors[index]} border-white dark:border-slate-900`;
    };

    const handleLeave = async () => {
        if (!window.confirm("Are you sure you want to leave this trip?")) return;
        try {
            await tripService.leaveTrip(tripId);
            router.push("/");
        } catch (err: any) {
            alert(err.response?.data || "Failed to leave trip.");
        }
    };

    return (
        <div className="flex items-center gap-5 bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Avatars Stack */}
            <div className="flex items-center -space-x-3">
                <div title={`Owner: ${creatorName}`} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black z-30 shadow-sm ${getBgColor(creatorName, true)}`}>
                    {creatorName[0].toUpperCase()}
                    <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                </div>
                {collaboratorNames.map((name, index) => (
                    <div key={name} title={name} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shadow-sm transition-all ${getBgColor(name, false)}`} style={{ zIndex: 20 - index }}>
                        {name[0].toUpperCase()}
                    </div>
                ))}
                
                <div className="pl-6 flex flex-col">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {collaboratorNames.length + 1} People
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Planning</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="ml-auto">
                {isOwner ? (
                    <button
                        onClick={() => setIsManageOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        Manage Group
                    </button>
                ) : showLeaveButton ? (
                    <button
                        onClick={handleLeave}
                        className="px-5 py-2.5 border-2 border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all"
                    >
                        Leave Trip
                    </button>
                ) : null}
            </div>

            <MemberManagementModal
                tripId={tripId}
                isOpen={isManageOpen}
                onClose={() => setIsManageOpen(false)}
                creatorName={creatorName}
                collaborators={collaboratorNames}
            />
        </div>
    );
}