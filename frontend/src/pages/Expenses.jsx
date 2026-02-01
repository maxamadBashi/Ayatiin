import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, Trash2, Edit, DollarSign, Sparkles } from 'lucide-react';
import ExpenseModal from '../components/ExpenseModal';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expensesRes, propertiesRes] = await Promise.all([
                axios.get('/expenses'),
                axios.get('/properties')
            ]);
            setExpenses(expensesRes.data);
            setProperties(propertiesRes.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`/expenses/${id}`);
                setExpenses(expenses.filter(e => e._id !== id));
            } catch (error) {
                console.error('Error deleting expense', error);
                const errorMessage = error.response?.data?.message || 'Failed to delete expense.';
                alert(errorMessage);
            }
        }
    };

    const handleEdit = (expense) => {
        setCurrentExpense(expense);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentExpense(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentExpense) {
                await axios.put(`/expenses/${currentExpense._id}`, formData);
            } else {
                await axios.post('/expenses', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving expense', error);
            const errorMessage = error.response?.data?.message || 'Error saving expense';
            alert(errorMessage);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                        <DollarSign size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full">Accounting</span>
                            <Sparkles size={12} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Expense Tracker</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monitoring {expenses.length} Records</p>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>New Expense</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                            <DollarSign size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet & Prop Burn</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                                ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Property</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400">Loading expenses...</td></tr>
                        ) : expenses.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400">No expenses recorded yet.</td></tr>
                        ) : expenses.map((expense) => (
                            <tr key={expense._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium uppercase">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{expense.property?.name || 'Company Global'}</td>
                                <td className="p-4 font-bold text-red-600">-${expense.amount.toLocaleString()}</td>
                                <td className="p-4 text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expense._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                expense={currentExpense}
                properties={properties}
            />
        </div>
    );
};

export default Expenses;
