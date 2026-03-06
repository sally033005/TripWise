"use client";

import { ExpenseCategory, TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

interface ExpensesSectionProps {
    trip: TripResponseDTO;
    onUpdate: () => void;
}

export default function ExpensesSection({ trip, onUpdate }: ExpensesSectionProps) {
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState(trip.totalBudget || 0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categoryTotals = trip.expenses?.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>) || {};

    const categoryIcons: Record<ExpenseCategory, string> = {
        TRANSPORTATION: "🚗", FOOD: "🍜", ACCOMMODATION: "🏨", SHOPPING: "🛍️", OTHERS: "📦"
    };

    const handleUpdateBudget = async () => {
        try {
            await tripService.updateTripBudget(trip.id, tempBudget);
            setIsEditingBudget(false);
            onUpdate();
        } catch (err) {
            alert("Failed to update budget");
        }
    };

    const handleDeleteExpense = async (expenseId: number) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await tripService.deleteExpense(expenseId);
                onUpdate();
            } catch (err) {
                alert("Failed to delete expense");
            }
        }
    };

    const remaining = (trip.totalBudget || 0) - (trip.totalSpent || 0);

    return (
        <div className="space-y-8 transition-colors duration-300">
            {/* 1. Top Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 dark:bg-card border border-slate-800 p-10 rounded-[2.5rem] text-white flex flex-col justify-between min-h-[280px] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Expenses</p>
                            <h2 className="text-6xl font-black">${trip.totalSpent?.toLocaleString()}</h2>
                        </div>

                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Budget Goal</p>
                            {isEditingBudget ? (
                                <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/20">
                                    <input
                                        type="number"
                                        className="w-24 bg-transparent px-2 py-1 outline-none text-right font-bold text-white"
                                        value={tempBudget}
                                        onChange={(e) => setTempBudget(Number(e.target.value))}
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleUpdateBudget}
                                        className="bg-blue-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-black uppercase hover:bg-blue-600 transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="flex items-center justify-end gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setIsEditingBudget(true)}
                                >
                                    <span className="text-xl font-black text-white">
                                        ${trip.totalBudget?.toLocaleString() || '0'}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-end relative z-10">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all active:scale-95"
                        >
                            + Add Expense
                        </button>

                        <div className="text-right">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Status</p>
                            <p className={`text-lg font-black ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {remaining < 0 ? `Over by $${Math.abs(remaining)}` : `$${remaining} left`}
                            </p>
                        </div>
                    </div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                </div>

                {/* Breakdown Card */}
                <div className="bg-card border border-card-border p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-lg">🕒</span>
                        <h3 className="font-black text-main-text uppercase text-sm tracking-wider">Breakdown</h3>
                    </div>
                    <div className="space-y-5">
                        {Object.entries(categoryTotals).map(([cat, amount]) => (
                            <div key={cat} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-500 dark:text-slate-400 capitalize">{cat.toLowerCase()}</span>
                                    <span className="text-main-text">${amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-900 dark:bg-blue-500 rounded-full"
                                        style={{ width: `${(amount / (trip.totalSpent || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Spent by Person */}
            <div className="flex flex-wrap gap-4">
                {Object.entries(trip.spentByPerson || {}).map(([person, amount]) => (
                    <div key={person} className="bg-card border border-card-border px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-black">
                            {person[0].toUpperCase()}
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block font-bold uppercase">{person}</span>
                            <span className="font-black text-main-text">${amount.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black text-main-text px-2">Transactions</h3>
                <div className="bg-card border border-card-border rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Item</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Paid By</th>
                                <th className="px-8 py-5 text-right">Amount</th>
                                <th className="px-8 py-5 text-center w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {trip.expenses?.map((exp) => (
                                <tr key={exp.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 font-bold text-main-text">{exp.description}</td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full font-bold">
                                            {categoryIcons[exp.category as ExpenseCategory]} {exp.category.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-slate-500">{exp.paidBy}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-main-text">
                                        ${exp.amount.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button
                                            onClick={() => handleDeleteExpense(exp.id!)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddExpenseModal
                tripId={trip.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onUpdate}
            />
        </div>
    );
}