"use client";
import { useState, useEffect } from "react";
import { tripService } from "@/services/api";
import { TripResponseDTO } from "@/types";

export default function EditTripModal({ isOpen, onClose, onSuccess, trip }: { 
    isOpen: boolean, onClose: () => void, onSuccess: () => void, trip: TripResponseDTO 
}) {
    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        description: "",
        totalBudget: 0
    });

    // Pre-fill form with existing trip data when modal opens
    useEffect(() => {
        if (trip) {
            setFormData({
                title: trip.title,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
                description: trip.description || "",
                totalBudget: trip.totalBudget || 0
            });
        }
    }, [trip]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tripService.updateTrip(trip.id, formData);
            onSuccess();
            onClose();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-black mb-6 dark:text-white">Edit Journey ✏️</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        value={formData.title}
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                    />
                    <input 
                        value={formData.destination}
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        onChange={e => setFormData({...formData, destination: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={formData.startDate} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                        <input type="date" value={formData.endDate} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-4 text-slate-400">$</span>
                        <input 
                            type="number"
                            value={formData.totalBudget}
                            placeholder="Total Budget"
                            className="w-full p-4 pl-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            onChange={e => setFormData({...formData, totalBudget: Number(e.target.value)})}
                        />
                    </div>
                    <textarea 
                        value={formData.description}
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-24 resize-none"
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}