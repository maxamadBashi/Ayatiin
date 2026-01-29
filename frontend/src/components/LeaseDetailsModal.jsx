import React from 'react';
import {
    X, User, Shield, Home, DollarSign, Calendar, Car, Swords,
    Users, Download, ArrowLeft, CheckCircle2, FileText,
    Eye, MapPin, Mail, Phone, Hash, Briefcase, Info, Clock, ExternalLink
} from 'lucide-react';

const LeaseDetailsModal = ({ isOpen, onClose, lease, allTenants = [], allUnits = [], allGuarantors = [], allProperties = [] }) => {
    if (!isOpen || !lease) return null;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendBaseUrl = API_URL.replace('/api', '');

    const getImageUrl = (path) => {
        if (!path) return '';
        let normalized = path.replace(/\\/g, '/');
        if (normalized.includes('uploads/')) {
            normalized = normalized.substring(normalized.indexOf('uploads/'));
        }
        if (!normalized.startsWith('/')) {
            normalized = '/' + normalized;
        }
        return `${backendBaseUrl}${normalized}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTimestamp = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRelation = (field1, field2, list = [], idField1 = 'id', idField2 = '_id') => {
        const val = lease[field1] || lease[field2];
        if (val && typeof val === 'object') return val;
        if (val && typeof val === 'string') {
            return list.find(item => item[idField1] === val || item[idField2] === val) || {};
        }
        const idVal = lease[field1 + 'Id'] || lease[field1 + 'ID'] || lease[field2 + 'Id'] || lease[field2 + 'ID'];
        if (idVal) {
            return list.find(item => item[idField1] === idVal || item[idField2] === idVal) || {};
        }
        return {};
    };

    const tenant = getRelation('tenant', 'Tenant', allTenants);
    const unit = getRelation('unit', 'Unit', allUnits);
    const propertyId = unit.propertyId || unit.PropertyId || (typeof unit.property === 'string' ? unit.property : null);
    const property = getRelation('property', 'Property', allProperties) ||
        (unit.property && typeof unit.property === 'object' ? unit.property :
            (propertyId ? allProperties.find(p => p.id === propertyId || p._id === propertyId) : {})) || {};

    const guarantor = getRelation('guarantor', 'Guarantor', allGuarantors);

    const gName = guarantor.name || lease.guarantorName || 'N/A';
    const gPhone = guarantor.phone || lease.guarantorPhone || 'N/A';
    const gEmail = guarantor.email || 'N/A';
    const gID = guarantor.idNumber || lease.guarantorID || 'N/A';
    const gWork = guarantor.workInfo || 'N/A';

    const handleExport = () => {
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>Lease Agreement</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
                .section { margin-bottom: 25px; }
                .section-header { font-size: 18px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 15px; }
                .grid { display: flex; flex-wrap: wrap; }
                .field { width: 50%; margin-bottom: 10px; }
                .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; }
                .value { font-size: 14px; font-weight: bold; color: #0f172a; }
                .footer { margin-top: 50px; font-size: 10px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>LEASE AGREEMENT</h1>
                    <p>Reference: ${lease.id?.toUpperCase() || 'N/A'}</p>
                    <p>Status: ${lease.status?.toUpperCase() || 'N/A'}</p>
                </div>

                <div class="section">
                    <div class="section-header">TENANT INFORMATION</div>
                    <div class="grid">
                        <div class="field"><div class="label">Full Name</div><div class="value">${tenant.name || 'N/A'}</div></div>
                        <div class="field"><div class="label">Phone</div><div class="value">${tenant.phone || 'N/A'}</div></div>
                        <div class="field"><div class="label">Email</div><div class="value">${tenant.email || 'N/A'}</div></div>
                        <div class="field"><div class="label">ID Number</div><div class="value">${tenant.idNumber || 'N/A'}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">PROPERTY & UNIT</div>
                    <div class="grid">
                        <div class="field"><div class="label">Property</div><div class="value">${property.name || 'N/A'}</div></div>
                        <div class="field"><div class="label">Unit Number</div><div class="value">${unit.unitNumber || 'N/A'}</div></div>
                        <div class="field"><div class="label">Location</div><div class="value">${property.location || property.address || 'N/A'}</div></div>
                        <div class="field"><div class="label">Unit Type</div><div class="value">${unit.type || 'N/A'}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">FINANCIAL TERMS</div>
                    <div class="grid">
                        <div class="field"><div class="label">Monthly Rent</div><div class="value">$${lease.rentAmount?.toLocaleString()}</div></div>
                        <div class="field"><div class="label">Security Deposit</div><div class="value">$${lease.deposit?.toLocaleString() || '0'}</div></div>
                        <div class="field"><div class="label">Rent Cycle</div><div class="value">${lease.rentCycle || 'Monthly'}</div></div>
                        <div class="field"><div class="label">Effective Date</div><div class="value">${formatDate(lease.startDate)}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">GUARANTOR INFORMATION</div>
                    <div class="grid">
                        <div class="field"><div class="label">Name</div><div class="value">${gName}</div></div>
                        <div class="field"><div class="label">Phone</div><div class="value">${gPhone}</div></div>
                        <div class="field"><div class="label">ID Card</div><div class="value">${gID}</div></div>
                        <div class="field"><div class="label">Occupation</div><div class="value">${gWork}</div></div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-header">LEGAL CONDITIONS</div>
                    <p>${lease.conditions || 'No additional conditions recorded.'}</p>
                </div>

                <div class="footer">
                    <p>Generated by Ayatiin Property Management System © 2026</p>
                    <p>Document ID: ${lease.id || 'N/A'}</p>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Lease_Agreement_${tenant.name?.replace(/\s+/g, '_') || 'Export'}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const InfoCard = ({ icon: Icon, label, value, colorClass = "text-slate-700" }) => (
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <Icon size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-sm font-semibold truncate ${colorClass}`}>{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
                {/* Clean Modern Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                            <FileText size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lease Agreement</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${lease.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {lease.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                <Hash size={14} className="text-slate-300" />
                                {lease.id?.split('-')[0].toUpperCase() || 'N/A'} • {formatTimestamp(lease.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
                        >
                            <Download size={16} />
                            Download Word
                        </button>
                        <button onClick={onClose} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN: PRIMARY ENTITIES (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Tenant Info */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Tenant Details</h3>
                                </div>
                                <div className="space-y-4">
                                    <InfoCard icon={User} label="Legal Name" value={tenant.name} />
                                    <InfoCard icon={Phone} label="Phone Number" value={tenant.phone} />
                                    <InfoCard icon={Mail} label="Email Address" value={tenant.email} />
                                    <InfoCard icon={Hash} label="ID / Passport" value={tenant.idNumber} />
                                </div>
                            </div>

                            {/* Property Info */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Home size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Property Asset</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Building / Complex</p>
                                        <p className="text-lg font-bold text-slate-800">{property.name || 'N/A'}</p>
                                        <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
                                            <MapPin size={12} />
                                            <span className="truncate">{property.location || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Unit #</p>
                                            <p className="text-base font-bold text-slate-800">{unit.unitNumber || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Unit Type</p>
                                            <p className="text-base font-bold text-slate-800">{unit.type || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE COLUMN: FINANCIALS & AGREEMENT (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Financial Summary */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                        <DollarSign size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Financial Terms</h3>
                                </div>
                                <div className="mb-6 p-6 bg-slate-900 rounded-[1.25rem] text-white">
                                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-1">Monthly Rent</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">${lease.rentAmount?.toLocaleString()}</span>
                                        <span className="text-xs opacity-60">/{lease.rentCycle || 'month'}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <InfoCard icon={Shield} label="Security Deposit" value={`$${lease.deposit?.toLocaleString() || '0'}`} />
                                    <InfoCard icon={Clock} label="Payment Cycle" value={lease.rentCycle} className="capitalize" />
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto Invoicing</span>
                                        </div>
                                        <span className={`text-xs font-bold ${lease.autoInvoice ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {lease.autoInvoice ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Agreement Dates */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                        <Calendar size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Lease Dates</h3>
                                </div>
                                <div className="space-y-4 relative">
                                    <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100"></div>
                                    <div className="flex items-start gap-4 relative">
                                        <div className="mt-1 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border-2 border-white shadow-sm z-10">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Effective Date</p>
                                            <p className="text-sm font-bold text-slate-800">{formatDate(lease.startDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 relative">
                                        <div className="mt-1 w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border-2 border-white shadow-sm z-10">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiration Date</p>
                                            <p className="text-sm font-bold text-slate-800">{formatDate(lease.endDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: GUARANTOR & ASSETS (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Guarantor Info */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <Shield size={18} />
                                        </div>
                                        <h3 className="font-bold text-slate-800">Guarantor</h3>
                                    </div>
                                    {guarantor.id && <CheckCircle2 className="text-blue-500" size={16} />}
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <InfoCard icon={User} label="Name" value={gName} />
                                        <InfoCard icon={Phone} label="Phone" value={gPhone} />
                                    </div>

                                    {guarantor.id ? (
                                        <div className="pt-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { label: 'Document ID', photo: guarantor.idPhoto },
                                                    { label: 'Work Link', photo: guarantor.workIdPhoto }
                                                ].map((doc, idx) => (
                                                    <div key={idx} className="group cursor-pointer">
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{doc.label}</p>
                                                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group-hover:border-blue-400 transition-colors">
                                                            {doc.photo ? (
                                                                <>
                                                                    <img src={getImageUrl(doc.photo)} alt={doc.label} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                                                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                        <ExternalLink size={20} className="text-white" />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <FileText size={24} strokeWidth={1} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {guarantor.workInfo && (
                                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Briefcase size={14} className="text-slate-400" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Work Details</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{guarantor.workInfo}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center border border-dashed border-slate-200 rounded-2xl">
                                            <p className="text-xs text-slate-400 italic">No linked profile</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assets & Witnesses Miniature */}
                            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                        <Users size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Legal Witnesses</h3>
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => lease[`witness${i}Name`] && (
                                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    {i}
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 truncate">{lease[`witness${i}Name`]}</p>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter ml-2 truncate">
                                                {lease[`witness${i}Phone`]}
                                            </span>
                                        </div>
                                    ))}
                                    {!lease.witness1Name && <p className="text-xs text-slate-300 italic text-center py-2">No witnesses recorded</p>}
                                </div>
                            </div>
                        </div>

                        {/* FULL WIDTH: CONDITIONS SECTION */}
                        <div className="lg:col-span-12">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">Legal Terms & Special Conditions</h3>
                                </div>
                                <div className="relative z-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                                        {lease.conditions || 'No additional legal terms or special conditions have been defined for this specific lease agreement.'}
                                    </p>
                                </div>
                                {/* Subtle decorative element */}
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                                    <FileText size={160} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Simplified Professional Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Secure Document</p>
                        </div>
                        <p className="text-[10px] font-medium tracking-tight">Report ID: {lease._id || 'N/A'}</p>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                        Ayatiin PMS © 2026 • Verified Output
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LeaseDetailsModal;
