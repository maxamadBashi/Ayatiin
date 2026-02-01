import React, { useState, useEffect } from 'react';
import { X, Building2, Hash, Layout, Banknote, Bed, Bath, Check, Info, Plus } from 'lucide-react';

const UnitModal = ({ isOpen, onClose, onSubmit, unit, properties }) => {
    const [formData, setFormData] = useState({
        property: '',
        unitNumber: '',
        type: '',
        rentAmount: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available',
    });

    useEffect(() => {
        if (unit) {
            setFormData({
                property: unit.property?._id || unit.property || '',
                unitNumber: unit.unitNumber || '',
                type: unit.type || '',
                rentAmount: unit.rentAmount || '',
                bedrooms: unit.bedrooms || '',
                bathrooms: unit.bathrooms || '',
                status: unit.status || 'available',
            });
        } else {
            setFormData({
                property: '',
                unitNumber: '',
                type: '',
                rentAmount: '',
                bedrooms: '',
                bathrooms: '',
                status: 'available',
            });
        }
    }, [unit, isOpen]);

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
                            {unit ? 'Edit Unit' : 'Add New Unit'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Define unit details and link to property</p>
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
                            {/* Section 1: Connection & Number */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Building2 size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Property & Identification</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Property *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="property"
                                            value={formData.property}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="">Select a Property</option>
                                            {properties.map((prop) => (
                                                <option key={prop._id} value={prop._id}>
                                                    {prop.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Layout size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Unit Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="unitNumber"
                                            value={formData.unitNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., A-101"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Hash size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Unit Type *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., 2BHK Apartment"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Layout size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Finances & Capacity */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Banknote size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Rent & Features</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Rent Amount ($) *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="rentAmount"
                                            value={formData.rentAmount}
                                            onChange={handleChange}
                                            required
                                            placeholder="0.00"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Banknote size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            Bedrooms
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="bedrooms"
                                                value={formData.bedrooms}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                            />
                                            <Bed size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            Bathrooms
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="bathrooms"
                                                value={formData.bathrooms}
                                                onChange={handleChange}
                                                placeholder="0"
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                            />
                                            <Bath size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Availability Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="available">Available</option>
                                            <option value="occupied">Occupied</option>
                                            <option value="maintenance">Under Maintenance</option>
                                        </select>
                                        <Check size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
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
                            {unit ? 'Update Unit' : 'Save Unit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UnitModal;
