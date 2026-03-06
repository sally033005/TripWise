"use client";
import { useState } from "react";
import api, { tripService } from "@/services/api";

interface InviteModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export default function InviteModal({ tripId, isOpen, onClose, onSuccess }: InviteModalProps) {
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

      onSuccess(inviteName);
      onClose();
    } catch (err: any) {
      const serverMessage = err.response?.data;
      setError(typeof serverMessage === 'string' ? serverMessage : "Failed to invite user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-black mb-2 text-slate-800 dark:text-white">Invite Travel Partner</h2>
        <p className="text-slate-500 text-sm mb-6">Enter the username of the person you want to plan with.</p>

        <div className="space-y-4">
          <input
            type="text"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="Username (e.g. Micky)"
            className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />

          {error && <p className="text-red-500 text-xs font-bold px-1">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}