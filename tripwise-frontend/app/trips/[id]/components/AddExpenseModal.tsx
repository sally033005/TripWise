"use client";

import { useState } from "react";
import { tripService } from "@/services/api";

interface AddExpenseModalProps {
    tripId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddExpenseModal({ tripId, isOpen, onClose, onSuccess }: AddExpenseModalProps) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        category: "FOOD",
        paidBy: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await tripService.addExpense(tripId, {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onSuccess();
            onClose();
            setFormData({ description: "", amount: "", category: "FOOD", paidBy: "" }); // Reset Form
        } catch (err) {
            alert("Failed to add expense");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Expense 💸</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">What did you buy?</label>
                        <input
                            type="text" required placeholder="e.g. Ichiran Ramen"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Amount ($)</label>
                            <input
                                type="number" required placeholder="0.00" step="0.01"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                            <select
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="FOOD">🍜 Food</option>
                                <option value="TRANSPORTATION">🚗 Transport</option>
                                <option value="ACCOMMODATION">🏨 Stay</option>
                                <option value="SHOPPING">🛍️ Shopping</option>
                                <option value="OTHERS">📦 Others</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Who paid?</label>
                        <input
                            type="text" required placeholder="e.g. Tsz / John"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.paidBy}
                            onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Save Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
}