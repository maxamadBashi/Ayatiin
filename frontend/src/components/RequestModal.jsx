import React, { useState, useEffect } from 'react';
import { X, Calendar, Banknote, MessageSquare, Sparkles, Home, MapPin, Plus } from 'lucide-react';

const RequestModal = ({ isOpen, onClose, onSubmit, property, type }) => {
    const [formData, setFormData] = useState({
        visitDate: '',
        amount: '',
        message: '',
    });
    const [amountError, setAmountError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        if (property?.price) {
            setFormData((prev) => ({
                ...prev,
                amount: property.price.toString(),
            }));
            setAmountError('');
        } else {
            setFormData((prev) => ({
                ...prev,
                amount: '',
            }));
        }
    }, [isOpen, property, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'amount' && property?.price) {
            const num = Number(value || '0');
            const expected = Number(property.price);
            if (Number.isNaN(num)) {
                setAmountError('Please enter a valid number.');
            } else if (num !== expected) {
                setAmountError(
                    `Amount must match property price: $${expected.toLocaleString()}`
                );
            } else {
                setAmountError('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (property?.price) {
            const num = Number(formData.amount || '0');
            const expected = Number(property.price);
            if (Number.isNaN(num) || num !== expected) {
                alert(
                    `Please enter the correct amount for this property: $${expected.toLocaleString()}.`
                );
                return;
            }
        }

        onSubmit(formData);
        setFormData({ visitDate: '', amount: '', message: '' });
        setAmountError('');
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                                {type === 'booking' ? 'Book Property' : 'Purchase Request'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">Submit your interest for this property</p>
                        </div>
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
                    {/* Property Summary Card */}
                    <div className="mx-8 mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-5">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                            <Home className="text-indigo-600" size={32} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Target Property</p>
                            <h3 className="text-lg font-bold text-slate-800">{property?.name}</h3>
                            {property?.location && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>{property.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 1: Logistics */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-indigo-100 pb-2">
                                    <Calendar size={18} className="text-indigo-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Logistics</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Preferred Visit Date *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="visitDate"
                                            value={formData.visitDate}
                                            onChange={handleChange}
                                            min={today}
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Calendar size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Financial Offer */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-indigo-100 pb-2">
                                    <Banknote size={18} className="text-indigo-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Financial Offer</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        {type === 'booking' ? 'Monthly Rent ($) *' : 'Purchase Offer ($) *'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            placeholder="0.00"
                                            className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold ${amountError ? 'border-red-500' : 'border-slate-200'}`}
                                        />
                                        <Banknote size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                    {amountError && <p className="text-xs text-red-500 font-medium">{amountError}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Full Width Message */}
                        <div className="mt-10 space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <MessageSquare size={18} className="text-indigo-600" />
                                Personal Message / Note
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell the owner more about your request..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Submit {type === 'booking' ? 'Booking' : 'Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
