import React, { useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Shield, Plus } from 'lucide-react';

const CreateAdminModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/auth/admin/register', formData);
            onSuccess();
            onClose();
            setFormData({ name: '', email: '', password: '', role: 'admin' });
        } catch (err) {
            console.error('Create Admin Error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            Create New User
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Assign system roles and access levels</p>
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
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Shield size={18} />
                                </div>
                                <p className="text-sm font-semibold">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 1: Identity */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <User size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">User Identity</h3>
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
                                            placeholder="Enter full name"
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
                                            placeholder="email@example.com"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Security */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Shield size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Security & Access</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        System Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="customer">Customer Access</option>
                                            <option value="admin">System Admin</option>
                                        </select>
                                        <Shield size={18} className="absolute left-4 top-3.5 text-slate-400" />
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
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus size={20} />
                            )}
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAdminModal;
