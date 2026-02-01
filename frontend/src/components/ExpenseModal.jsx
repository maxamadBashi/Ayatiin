import React, { useState, useEffect } from 'react';
import { X, Wallet, Tag, Calendar, MessageSquare, Banknote, Building2, Plus } from 'lucide-react';

const ExpenseModal = ({ isOpen, onClose, onSubmit, expense, properties }) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        property: '',
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                category: expense.category || '',
                amount: expense.amount || '',
                description: expense.description || '',
                date: new Date(expense.date).toISOString().split('T')[0],
                property: expense.property?._id || expense.property || '',
            });
        } else {
            setFormData({
                category: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                property: '',
            });
        }
    }, [expense, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {expense ? 'Edit Expense' : 'Log New Expense'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Record business costs and property expenditures</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 1: Classification */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-red-100 pb-2">
                                    <Tag size={18} className="text-red-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Classification</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Expense Category *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="maintenance">Maintenance & Repairs</option>
                                            <option value="utility">Utility (Water/Electricity)</option>
                                            <option value="salary">Staff Salary</option>
                                            <option value="marketing">Marketing & Ads</option>
                                            <option value="legal">Legal & Insurance</option>
                                            <option value="other">Other Expenses</option>
                                        </select>
                                        <Wallet size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Related Property
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="property"
                                            value={formData.property}
                                            onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Company Global / None</option>
                                            {properties.map(p => (
                                                <option key={p._id} value={p._id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <Building2 size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Financials */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-red-100 pb-2">
                                    <Banknote size={18} className="text-red-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Financial Details</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Amount Invoiced ($) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                            placeholder="0.00"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none font-bold text-red-600"
                                        />
                                        <Banknote size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Transaction Date *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Calendar size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Width Description */}
                        <div className="mt-10 space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <MessageSquare size={18} className="text-red-600" />
                                Note / Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                placeholder="Why was this expense incurred?"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md px-8 py-6 border-t border-slate-100 flex justify-end gap-4 z-20">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all duration-200 active:scale-95 border border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {expense ? 'Update Expense' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
