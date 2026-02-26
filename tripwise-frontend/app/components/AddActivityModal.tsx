"use client";

import { useState } from "react";
import { tripService } from "@/services/api";

interface Props {
  tripId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddActivityModal({ tripId, isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    activity: '',
    location: '',
    startTime: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tripService.addItineraryItem(tripId, formData);
      onSuccess(); // Refresh parent component to show new activity
      onClose();  // Close the modal after successful submission
    } catch (err) {
      alert("Failed to add activity. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Activity 📝</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">What's the plan?</label>
            <input 
              type="text" required placeholder="e.g. Dinner at Shibuya"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Date & Time</label>
            <input 
              type="datetime-local" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Location (Optional)</label>
            <input 
              type="text" placeholder="Search location..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <div className="flex gap-3 mt-8">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all">Save Activity</button>
          </div>
        </form>
      </div>
    </div>
  );
}