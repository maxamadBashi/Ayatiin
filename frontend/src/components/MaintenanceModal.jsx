import React, { useState, useEffect } from 'react';
import { X, Wrench, AlertTriangle, Clock, MessageSquare, Plus, Home, Activity } from 'lucide-react';

const MaintenanceModal = ({ isOpen, onClose, onSubmit, request, units }) => {
    const [formData, setFormData] = useState({
        unit: '',
        description: '',
        priority: 'medium',
        status: 'pending',
    });

    useEffect(() => {
        if (request) {
            setFormData({
                unit: request.unit?._id || request.unit || '',
                description: request.description || '',
                priority: request.priority || 'medium',
                status: request.status || 'pending',
            });
        } else {
            setFormData({
                unit: '',
                description: '',
                priority: 'medium',
                status: 'pending',
            });
        }
    }, [request, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {request ? 'Update Maintenance' : 'New Maintenance Request'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Track and manage property repair issues</p>
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
                            {/* Section 1: Assignment & Priority */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Home size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Property Details</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Affected Unit *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select a Unit</option>
                                            {units.map((unit) => (
                                                <option key={unit._id} value={unit._id}>
                                                    {unit.unitNumber} ({unit.property?.name})
                                                </option>
                                            ))}
                                        </select>
                                        <Home size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Priority Level
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="low">Low - Routine</option>
                                            <option value="medium">Medium - Normal</option>
                                            <option value="high">High - Urgent</option>
                                            <option value="critical">Critical - Emergency</option>
                                        </select>
                                        <AlertTriangle size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Progress Status */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Activity size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Tracking Status</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Current Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="pending">Pending Review</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <Clock size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Width Description */}
                        <div className="mt-10 space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <MessageSquare size={18} className="text-blue-600" />
                                Detailed Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Clearly describe the issue and its location within the unit..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {request ? 'Update Maintenance' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;
