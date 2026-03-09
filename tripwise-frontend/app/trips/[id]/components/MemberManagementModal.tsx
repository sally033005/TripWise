"use client";

import { useState } from "react";
import { tripService } from "@/services/api";

interface Props {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  collaborators: string[];
}

export default function MemberManagementModal({ tripId, isOpen, onClose, creatorName, collaborators }: Props) {
  const [inviteName, setInviteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!inviteName.trim()) return;
    setLoading(true);
    setError("");
    try {
      await tripService.addCollaborator(tripId, inviteName);
      setInviteName("");
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data || "User not found or already added.");
    } finally {
      setLoading(false);
    }
  };

  const handleKick = async (username: string) => {
    if (!window.confirm(`Are you sure you want to remove ${username}?`)) return;
    try {
      await tripService.kickCollaborator(tripId, username);
      window.location.reload();
    } catch (err: any) {
      alert("Failed to remove collaborator.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Manage Members</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Coordinate your travel squad.</p>
        </div>

        {/* Member List Section */}
        <div className="px-8 max-h-[300px] overflow-y-auto space-y-3">
          {/* Owner Row */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {creatorName[0].toUpperCase()}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{creatorName}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">Owner</span>
          </div>

          {/* Collaborators Rows */}
          {collaborators.map((name) => (
            <div key={name} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {name[0].toUpperCase()}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">{name}</span>
              </div>
              <button
                onClick={() => handleKick(name)}
                className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Invite Section */}
        <div className="p-8 mt-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Invite Partner</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Username"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            />
            <button
              onClick={handleInvite}
              disabled={loading || !inviteName.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "..." : "Add"}
            </button>
          </div>
          {error && <p className="text-rose-500 text-[10px] font-bold mt-2 px-1">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex justify-end">
          <button onClick={onClose} className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}