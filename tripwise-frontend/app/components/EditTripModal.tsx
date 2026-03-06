"use client";
import { useState, useEffect } from "react";
import { tripService } from "@/services/api";
import { TripResponseDTO } from "@/types";

export default function EditTripModal({ isOpen, onClose, onSuccess, trip }: { 
    isOpen: boolean, onClose: () => void, onSuccess: () => void, trip: TripResponseDTO 
}) {

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        description: "",
        totalBudget: 0
    });

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
        
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert("End date cannot be earlier than start date");
            return;
        }

        try {
            await tripService.updateTrip(trip.id, formData);
            onSuccess();
            onClose();
        } catch (err) { alert("Update failed"); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-black mb-6 dark:text-white text-slate-900">Edit Journey ✏️</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">Trip Title</label>
                        <input 
                            value={formData.title}
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900"
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">Destination</label>
                        <input 
                            value={formData.destination}
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900"
                            onChange={e => setFormData({...formData, destination: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">Start Date</label>
                            <input 
                                type="date" 
                                value={formData.startDate} 
                                min={today} 
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900"
                                onChange={e => {
                                    const newStart = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        startDate: newStart,
                                        
                                        endDate: new Date(prev.endDate) < new Date(newStart) ? newStart : prev.endDate
                                    }));
                                }} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">End Date</label>
                            <input 
                                type="date" 
                                value={formData.endDate} 
                                min={formData.startDate} 
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900"
                                onChange={e => setFormData({...formData, endDate: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">Budget ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-400 font-bold">$</span>
                            <input 
                                type="number"
                                value={formData.totalBudget}
                                placeholder="Total Budget"
                                className="w-full p-4 pl-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900"
                                onChange={e => setFormData({...formData, totalBudget: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-2 tracking-widest">Notes</label>
                        <textarea 
                            value={formData.description}
                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-slate-900 h-24 resize-none"
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}