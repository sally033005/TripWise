import { ExpenseCategory, TripResponseDTO } from "@/types";
import { tripService } from "@/services/api";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

export default function ExpensesSection({ trip }: { trip: TripResponseDTO }) {
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState(trip.totalBudget || 0);

    const handleUpdateBudget = async () => {
        try {
            await tripService.updateTripBudget(trip.id, tempBudget);
            setIsEditingBudget(false);
            window.location.reload();
        } catch (err) {
            alert("Failed to update budget");
        }
    };

    const handleDeleteExpense = async (expenseId: number) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await tripService.deleteExpense(expenseId);
                window.location.reload();
            } catch (err) {
                alert("Failed to delete expense");
            }
        }
    };

    const remaining = (trip.totalBudget || 0) - (trip.totalSpent || 0);
    const progress = trip.totalBudget ? (trip.totalSpent / trip.totalBudget) * 100 : 0;

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Simple mapping of categories to emojis for quick visual identification
    const categoryIcons: Record<ExpenseCategory, string> = {
        TRANSPORTATION: "🚗",
        FOOD: "🍜",
        ACCOMMODATION: "🏨",
        SHOPPING: "🛍️",
        OTHERS: "📦"
    };

    return (
        <div className="space-y-8">
            {/* 1. Budget Dashboard */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Spent</p>
                        <h2 className="text-4xl font-black text-gray-900">${trip.totalSpent?.toLocaleString()}</h2>
                    </div>

                    {/* Editable Budget Section */}
                    <div className="text-right">
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                        {isEditingBudget ? (
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-blue-200">
                                <input
                                    type="number"
                                    className="w-28 bg-transparent px-2 py-1 outline-none text-right font-bold text-blue-600"
                                    value={tempBudget}
                                    onChange={(e) => setTempBudget(Number(e.target.value))}
                                    autoFocus
                                />
                                <button
                                    onClick={handleUpdateBudget}
                                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditingBudget(false)}
                                    className="text-gray-400 px-2 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div
                                className="group flex items-center justify-end gap-2 cursor-pointer"
                                onClick={() => setIsEditingBudget(true)}
                            >
                                <span className="text-xl font-bold text-gray-800">
                                    ${trip.totalBudget?.toLocaleString() || '0'}
                                </span>
                                <button className="p-1.5 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                            </div>
                        )}
                        <p className={`text-xs font-bold mt-2 ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {remaining < 0 ? `Over by $${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()} remaining`}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out ${progress > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            </div>

            {/* 2. Spent by Person (Quick View) */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {Object.entries(trip.spentByPerson || {}).map(([person, amount]) => (
                    <div key={person} className="bg-blue-50 px-4 py-2 rounded-2xl flex-shrink-0">
                        <span className="text-xs text-blue-400 block font-bold uppercase">{person}</span>
                        <span className="font-bold text-blue-700">${amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* 3. Expense List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Transactions</h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm bg-black text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        + Add Expense
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                    {trip.expenses?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Paid By</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center w-20">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {trip.expenses.map((exp) => (
                                    <tr key={exp.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">{exp.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                                {categoryIcons[exp.category]} {exp.category.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-600">{exp.paidBy}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            ${exp.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDeleteExpense(exp.id!)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center text-gray-400">No expenses recorded yet.</div>
                    )}
                </div>
            </div>

            <AddExpenseModal
                tripId={trip.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}