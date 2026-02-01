import React, { useState, useEffect } from 'react';
import { X, Receipt, Users, Banknote, Calendar, CreditCard, Plus, Info, Layout, CheckCircle2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, payment, leases }) => {
    const [formData, setFormData] = useState({
        lease: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'rent',
        method: 'bank_transfer',
        status: 'pending',
    });

    useEffect(() => {
        if (payment) {
            setFormData({
                lease: payment.lease?._id || payment.lease || '',
                amount: payment.amount || '',
                date: payment.date ? new Date(payment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                type: payment.type || 'rent',
                method: payment.method || 'bank_transfer',
                status: payment.status || 'pending',
            });
        } else {
            setFormData({
                lease: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                type: 'rent',
                method: 'bank_transfer',
                status: 'pending',
            });
        }
    }, [payment, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    const selectedLease = leases.find(l => (l._id || l.id) === formData.lease);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {payment ? 'Edit Payment' : 'Record New Payment'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Process and track incoming rent and deposits</p>
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
                            {/* Section 1: Source & Lease */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-emerald-100 pb-2">
                                    <Users size={18} className="text-emerald-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Payer Information</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Active Lease (Tenant) *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="lease"
                                            value={formData.lease}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Lease</option>
                                            {leases.map((lease) => (
                                                <option key={lease._id || lease.id} value={lease._id || lease.id}>
                                                    {lease.tenant?.name} - {lease.unit?.unitNumber} (${lease.rentAmount})
                                                </option>
                                            ))}
                                        </select>
                                        <Receipt size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {selectedLease && (
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-widest">
                                            <Info size={14} />
                                            Lease Summary
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Total Rent Due:</span>
                                                <span className="font-bold text-slate-800">${selectedLease.rentAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">This Payment:</span>
                                                <span className="font-extrabold text-emerald-600">${formData.amount || 0}</span>
                                            </div>
                                            <div className="flex justify-between text-sm border-t border-emerald-200 pt-2 mt-2">
                                                <span className="text-slate-600 font-medium">Remaining Bal:</span>
                                                <span className="font-black text-rose-600">
                                                    ${(selectedLease.rentAmount || 0) - (formData.amount || 0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Transaction Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-emerald-100 pb-2">
                                    <Banknote size={18} className="text-emerald-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Transaction Details</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Received Amount ($) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            placeholder="0.00"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                        />
                                        <Banknote size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Payment Date *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Calendar size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            Category
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none"
                                            >
                                                <option value="rent">Rent</option>
                                                <option value="deposit">Deposit</option>
                                                <option value="maintenance">Maint.</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <Layout size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            Method
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="method"
                                                value={formData.method}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none"
                                            >
                                                <option value="bank_transfer">Bank</option>
                                                <option value="cash">Cash</option>
                                                <option value="mobile_money">Mobile</option>
                                                <option value="check">Check</option>
                                            </select>
                                            <CreditCard size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="pending">Pending Review</option>
                                            <option value="paid">Payment Verified</option>
                                            <option value="overdue">Overdue / Late</option>
                                        </select>
                                        <CheckCircle2 size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {payment ? 'Update Record' : 'Post Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
