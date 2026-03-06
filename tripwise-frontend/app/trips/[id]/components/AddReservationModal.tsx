"use client";

import { useState } from "react";
import { tripService } from "@/services/api";

interface Props {
    tripId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    { label: "Flight", value: "FLIGHT", icon: "✈️" },
    { label: "Hotel", value: "HOTEL", icon: "🏨" },
    { label: "Insurance", value: "INSURANCE", icon: "🛡️" },
    { label: "Car Rental", value: "CAR_RENTAL", icon: "🚗" },
    { label: "Tickets", value: "TICKETS", icon: "🎟️" },
    { label: "Others", value: "OTHERS", icon: "📄" },
];

export default function AddReservationModal({ tripId, isOpen, onClose, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState("FLIGHT");
    const [description, setDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");
        setIsUploading(true);
        try {
            await tripService.uploadReservation(tripId, file, category, description);
            onSuccess();
            onClose();
        } catch (err) {
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-card-border w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-main-text">Add Reservation</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-main-text">✕</button>
                </div>

                <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                            Category
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${category === cat.value
                                        ? "bg-blue-500 border-blue-500 text-white"
                                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    <span className="text-xl mb-1">{cat.icon}</span>
                                    <span className="text-[10px] font-bold">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                            Details / Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Confirmation #12345, Terminal 1..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm text-main-text focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                        />
                    </div>

                    {/* File Input */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
                            Document File
                        </label>
                        <div className="relative border-2 border-dashed border-card-border rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div className="text-slate-400">
                                {file ? (
                                    <p className="text-blue-500 font-bold text-sm">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-2xl mb-1">📁</p>
                                        <p className="text-xs font-bold uppercase tracking-tighter">Click to select file</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !file}
                        className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isUploading ? "Uploading..." : "Save Reservation"}
                    </button>
                </div>
            </div>
        </div>
    );
}