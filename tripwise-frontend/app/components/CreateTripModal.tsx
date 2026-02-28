"use client";
import { useState } from "react";
import { tripService } from "@/services/api";

export default function CreateTripModal({ isOpen, onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        description: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tripService.createTrip(formData);
            onSuccess();
            onClose();
        } catch (err) { alert("Failed to create trip"); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-black mb-6 dark:text-white text-slate-900">Start New Journey ✈️</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        placeholder="Trip Title (e.g. Seoul Summer 2026)"
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                    />
                    <input 
                        placeholder="Where to?"
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, destination: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                        <input type="date" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={e => setFormData({...formData, endDate: e.target.value})} required />
                    </div>
                    <textarea 
                        placeholder="Short description..."
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-all">Create Trip</button>
                    </div>
                </form>
            </div>
        </div>
    );
}