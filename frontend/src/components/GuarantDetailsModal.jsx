import React from 'react';
import { X, Phone, Mail, Shield, Briefcase, FileText, Calendar, User, Home, ExternalLink, Download } from 'lucide-react';

const GuarantorDetailsModal = ({ isOpen, onClose, guarantor }) => {
    if (!isOpen || !guarantor) return null;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const IMAGE_BASE_URL = API_URL.replace('/api', '');

    const getImageUrl = (path) => {
        if (!path) return '';
        // Handle potential absolute Windows paths from backend
        let normalized = path.replace(/\\/g, '/');

        // If it contains 'uploads', extract everything from 'uploads' onwards
        if (normalized.includes('uploads/')) {
            normalized = normalized.substring(normalized.indexOf('uploads/'));
        }

        // Ensure it starts with a single slash
        if (!normalized.startsWith('/')) {
            normalized = '/' + normalized;
        }

        const baseUrl = API_URL.replace('/api', '');
        return `${baseUrl}${normalized}`;
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab
            window.open(url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">{guarantor.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${guarantor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {guarantor.status}
                                </span>
                                <span className="text-xs text-gray-400 font-medium tracking-tight">ID: {guarantor.idNumber}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-all text-gray-400 hover:text-gray-900 group">
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Profile Info */}
                        <div className="lg:col-span-4 space-y-8">
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contact Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Phone size={18} className="text-blue-500" /></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Phone</span>
                                            <span className="text-sm font-bold text-gray-700">{guarantor.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Mail size={18} className="text-emerald-500" /></div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Email</span>
                                            <span className="text-sm font-bold text-gray-700 break-all">{guarantor.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Work & Notes</h3>
                                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-sm text-amber-900 leading-relaxed italic">
                                    <Briefcase size={16} className="mb-2 text-amber-500" />
                                    {guarantor.workInfo || "No work information provided."}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Documents</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {guarantor.idPhoto && (
                                        <div className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 aspect-video bg-gray-50 shadow-sm transition-all hover:shadow-md">
                                            <img
                                                src={getImageUrl(guarantor.idPhoto)}
                                                alt="ID Card"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <a href={getImageUrl(guarantor.idPhoto)} target="_blank" rel="noreferrer" className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 hover:bg-white/40" title="View Full Image">
                                                    <ExternalLink size={20} />
                                                </a>
                                                <button
                                                    onClick={() => handleDownload(getImageUrl(guarantor.idPhoto), `ID_${guarantor.name.replace(/\s+/g, '_')}`)}
                                                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 hover:bg-white/40"
                                                    title="Download Image"
                                                >
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-lg font-bold">ID PHOTO</div>
                                        </div>
                                    )}
                                    {guarantor.workIdPhoto && (
                                        <div className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 aspect-video bg-gray-50 shadow-sm transition-all hover:shadow-md">
                                            <img
                                                src={getImageUrl(guarantor.workIdPhoto)}
                                                alt="Work ID"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <a href={getImageUrl(guarantor.workIdPhoto)} target="_blank" rel="noreferrer" className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 hover:bg-white/40" title="View Full Image">
                                                    <ExternalLink size={20} />
                                                </a>
                                                <button
                                                    onClick={() => handleDownload(getImageUrl(guarantor.workIdPhoto), `WorkID_${guarantor.name.replace(/\s+/g, '_')}`)}
                                                    className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 hover:bg-white/40"
                                                    title="Download Image"
                                                >
                                                    <Download size={20} />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-1 rounded-lg font-bold">WORK ID PHOTO</div>
                                        </div>
                                    )}
                                    {!guarantor.idPhoto && !guarantor.workIdPhoto && (
                                        <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                            <FileText size={32} className="mx-auto text-gray-200 mb-2" />
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No photos uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Leases History */}
                        <div className="lg:col-span-8">
                            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Shield size={18} className="text-blue-500" />
                                Guaranteed Leases
                            </h3>

                            {guarantor.leases && guarantor.leases.length > 0 ? (
                                <div className="space-y-4 uppercase">
                                    {guarantor.leases.map((lease) => (
                                        <div key={lease.id} className="p-5 rounded-3xl border border-gray-100 bg-white hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-900/[0.03] group">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                                                        <Home size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-800 tracking-tight">{lease.unit?.property?.name}</h4>
                                                        <p className="text-xs text-blue-600 font-black tracking-widest">UNIT: {lease.unit?.unitNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <span className="block text-[10px] text-gray-400 font-black tracking-widest leading-none">TENANT</span>
                                                        <span className="text-sm font-black text-gray-700">{lease.tenant?.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-[10px] text-gray-400 font-black tracking-widest leading-none">STATUS</span>
                                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${lease.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {lease.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center text-[10px] font-black tracking-[0.1em] text-gray-400">
                                                <div className="flex items-center gap-4">
                                                    <span>START: {formatDate(lease.startDate)}</span>
                                                    <span>END: {formatDate(lease.endDate)}</span>
                                                </div>
                                                <div className="text-gray-900">
                                                    RENT: ${lease.rentAmount}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                                    <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm mx-auto flex items-center justify-center text-gray-200 mb-4 border border-gray-50">
                                        <FileText size={40} />
                                    </div>
                                    <h4 className="text-gray-900 font-black tracking-tight mb-1">No Active Guarantees</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">This guarantor is not linked to any leases yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                        Close View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuarantorDetailsModal;
