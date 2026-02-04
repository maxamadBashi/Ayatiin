import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, FileText, Upload, Plus, ShieldCheck, Briefcase, Eye } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const GuarantorModal = ({ isOpen, onClose, onSubmit, guarantor }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        idNumber: '',
        workInfo: '',
        status: 'active'
    });
    const [idPhoto, setIdPhoto] = useState(null);
    const [workIdPhoto, setWorkIdPhoto] = useState(null);

    useEffect(() => {
        if (guarantor) {
            setFormData({
                name: guarantor.name || '',
                phone: guarantor.phone || '',
                email: guarantor.email || '',
                idNumber: guarantor.idNumber || '',
                workInfo: guarantor.workInfo || '',
                status: guarantor.status || 'active'
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                idNumber: '',
                workInfo: '',
                status: 'active'
            });
        }
    }, [guarantor, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (idPhoto) data.append('idPhoto', idPhoto);
        if (workIdPhoto) data.append('workIdPhoto', workIdPhoto);

        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-teal-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {guarantor ? 'Edit Guarantor' : 'New Guarantor Record'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Secure lease agreements with secondary verification</p>
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
                                <div className="flex items-center gap-2 mb-2 border-b border-teal-100 pb-2">
                                    <User size={18} className="text-teal-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Payer Identity</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter full name"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
                                        />
                                        <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Phone *</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Phone"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Email</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Verification */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-teal-100 pb-2">
                                    <ShieldCheck size={18} className="text-teal-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Verification</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="text-sm font-semibold text-slate-700">ID / Passport Number *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="idNumber"
                                            value={formData.idNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="NID or Passport #"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none"
                                        />
                                        <FileText size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 text-[11px] uppercase opacity-70">ID Photo</label>
                                        <div className="relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, setIdPhoto)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="flex items-center justify-center gap-2 px-3 py-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                                                <Upload size={16} />
                                                <span className="text-[10px] truncate max-w-[80px] font-bold">{idPhoto ? idPhoto.name : (guarantor?.idPhoto ? 'Change ID' : 'Upload')}</span>
                                            </div>
                                            {guarantor?.idPhoto && !idPhoto && (
                                                <div className="mt-2 flex items-center gap-2 text-[9px] text-teal-600 font-bold">
                                                    <a href={getImageUrl(guarantor.idPhoto)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                                        <Eye size={10} /> View Existing
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 text-[11px] uppercase opacity-70">Work ID</label>
                                        <div className="relative">
                                            <input type="file" onChange={(e) => handleFileChange(e, setWorkIdPhoto)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            <div className="flex items-center justify-center gap-2 px-3 py-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                                                <Upload size={16} />
                                                <span className="text-[10px] truncate max-w-[80px] font-bold">{workIdPhoto ? workIdPhoto.name : (guarantor?.workIdPhoto ? 'Change Work ID' : 'Upload')}</span>
                                            </div>
                                            {guarantor?.workIdPhoto && !workIdPhoto && (
                                                <div className="mt-2 flex items-center gap-2 text-[9px] text-teal-600 font-bold">
                                                    <a href={getImageUrl(guarantor.workIdPhoto)} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                                                        <Eye size={10} /> View Existing
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extra Info */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Briefcase size={18} className="text-teal-600" />
                                    Work Info & Notes
                                </label>
                                <textarea
                                    name="workInfo"
                                    value={formData.workInfo}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Company name, role, income bracket..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Account Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 focus:bg-white transition-all outline-none appearance-none"
                                >
                                    <option value="active">Active Verified</option>
                                    <option value="inactive">Suspended / Inactive</option>
                                </select>
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
                            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {guarantor ? 'Update Record' : 'Save Guarantor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GuarantorModal;
