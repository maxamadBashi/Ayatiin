import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Home, Activity, Plus } from 'lucide-react';

const TenantModal = ({ isOpen, onClose, onSubmit, tenant, units }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        unit: '', // Add unit to form data
        status: 'active',
    });

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || '',
                email: tenant.email || '',
                phone: tenant.phone || '',
                // Ensure unit is correctly populated for editing an existing tenant
                unit: tenant.unit?._id || tenant.unit?.id || '',
                status: tenant.status || 'active',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                unit: '',
                status: 'active',
            });
        }
    }, [tenant, isOpen, units]);

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
                            {tenant ? 'Edit Tenant' : 'Add New Tenant'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Manage personal information and unit assignment</p>
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
                            {/* Section 1: Personal Details */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <User size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Contact Details</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter tenant's full name"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="example@email.com"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+252..."
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Assignment */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Home size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Lease Assignment</h3>
                                </div>


                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Assigned Unit
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select Unit</option>
                                            {units.filter(u => u.status === 'available' || (tenant && (u._id === tenant.unit?._id || u.id === tenant.unit?.id))).map(unitOption => (
                                                <option key={unitOption._id || unitOption.id} value={unitOption._id || unitOption.id}>
                                                    {unitOption.unitNumber} ({unitOption.property?.name || 'Unknown Property'})
                                                </option>
                                            ))}
                                        </select>
                                        <Home size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
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
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <Activity size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {tenant ? 'Update Tenant' : 'Save Tenant'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TenantModal;
