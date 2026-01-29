import React, { useState, useEffect } from 'react';
import LeaseModal from '../components/LeaseModal';
import axios from '../utils/axios';
import { Plus, FileText, Trash2, Edit, Eye } from 'lucide-react';
import LeaseDetailsModal from '../components/LeaseDetailsModal';

const Leases = () => {
    const [leases, setLeases] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [guarantors, setGuarantors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLease, setCurrentLease] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedLease, setSelectedLease] = useState(null);

    const getRelation = (lease, field, list = [], idField = 'id') => {
        const val = lease[field];
        if (val && typeof val === 'object') return val;
        const idVal = val || lease[field + 'Id'] || lease[field + 'ID'];
        return list.find(item => item[idField] === idVal || item._id === idVal) || {};
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leasesRes, tenantsRes, unitsRes, propertiesRes, guarantorsRes] = await Promise.all([
                axios.get('/leases'),
                axios.get('/tenants'),
                axios.get('/units'),
                axios.get('/properties'),
                axios.get('/guarantors')
            ]);
            setLeases(leasesRes.data);
            setTenants(tenantsRes.data);
            setUnits(unitsRes.data);
            setProperties(propertiesRes.data);
            setGuarantors(guarantorsRes.data);
        } catch (error) {
            console.log('Using dummy data');
            setLeases([
                {
                    _id: '1',
                    tenant: { _id: 't1', name: 'John Doe' },
                    unit: { _id: 'u1', unitNumber: '101' },
                    startDate: '2023-01-01',
                    endDate: '2023-12-31',
                    rentAmount: 1200,
                    status: 'active'
                },
            ]);
            setTenants([{ _id: 't1', name: 'John Doe' }]);
            setUnits([{ _id: 'u1', unitNumber: '101', status: 'occupied' }]);
            setProperties([]);
            setGuarantors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lease?')) {
            try {
                await axios.delete(`/leases/${id}`);
                setLeases(leases.filter(l => l._id !== id));
            } catch (error) {
                setLeases(leases.filter(l => l._id !== id));
            }
        }
    };

    const handleEdit = (lease) => {
        setCurrentLease(lease);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentLease(null);
        setIsModalOpen(true);
    };

    const handleView = (lease) => {
        setSelectedLease(lease);
        setIsDetailsOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            let res;
            if (currentLease) {
                res = await axios.put(`/leases/${currentLease._id}`, formData);
                const updatedLease = res.data;
                setLeases(leases.map(l => l._id === currentLease._id ? updatedLease : l));
            } else {
                res = await axios.post('/leases', formData);
                const newLease = res.data;
                setLeases([newLease, ...leases]);
                setExpandedLeaseId(newLease._id || newLease.id);
            }
            setIsModalOpen(false);
            return { success: true };
        } catch (error) {
            console.error('Error saving lease', error);
            const message = error.response?.data?.message || 'Error saving lease. Please check all fields.';
            return { success: false, message };
        }
    };

    const [expandedLeaseId, setExpandedLeaseId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedLeaseId(expandedLeaseId === id ? null : id);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lease Contracts</h1>
                    <p className="text-gray-500 text-sm">Manage and view detailed lease agreements</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 font-bold"
                >
                    <Plus size={20} />
                    New Lease
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center w-12"></th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ref</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tenant</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property / Unit</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Rent</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">End Date</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {leases.map((lease) => (
                            <React.Fragment key={lease._id}>
                                <tr className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${expandedLeaseId === lease._id ? 'bg-blue-50/50' : ''}`} onClick={() => toggleExpand(lease._id)}>
                                    <td className="p-4 text-center">
                                        <div className={`transition-transform duration-200 ${expandedLeaseId === lease._id ? 'rotate-180' : ''}`}>
                                            <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-gray-400 uppercase">
                                        #{lease.id?.split('-')[0] || 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">
                                            {getRelation(lease, 'tenant', tenants).name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            {(() => {
                                                const u = getRelation(lease, 'unit', units);
                                                const p = getRelation(u, 'property', properties) || properties.find(prop => prop.id === u.propertyId || prop._id === u.propertyId) || {};
                                                return (
                                                    <>
                                                        <span className="font-medium text-blue-600">{p.name || 'Property'}</span>
                                                        <span className="mx-1.5 text-gray-300">/</span>
                                                        <span className="text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-xs">{u.unitNumber || 'Unit'}</span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">${lease.rentAmount?.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">{lease.rentCycle || 'monthly'}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 text-center">
                                        {new Date(lease.startDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 text-center">
                                        {new Date(lease.endDate).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${lease.status === 'active'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            <span className={`w-1 h-1 rounded-full mr-1.5 ${lease.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {lease.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleView(lease)}
                                                className="p-2 text-emerald-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100 active:scale-95"
                                                title="View Full Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(lease)}
                                                className="p-2 text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 active:scale-95"
                                                title="Edit Lease"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lease._id)}
                                                className="p-2 text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100 active:scale-95"
                                                title="Delete Lease"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedLeaseId === lease._id && (
                                    <tr className="bg-blue-50/20">
                                        <td colSpan="9" className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {/* Left Column: Guarantor & Witnesses */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                            Dammaanad-qaade (Guarantor)
                                                        </h4>
                                                        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Magaca Full</span>
                                                                <span className="font-semibold text-gray-800">{lease.guarantorName || lease.guarantor?.name || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Taleefanka</span>
                                                                <span className="font-semibold text-gray-800">{lease.guarantorPhone || lease.guarantor?.phone || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">ID / Passport</span>
                                                                <span className="font-semibold text-gray-800 font-mono">{lease.guarantorID || lease.guarantor?.idNumber || 'N/A'}</span>
                                                            </div>
                                                            {(lease.guarantor?.idPhoto || lease.guarantor?.workIdPhoto) && (
                                                                <div className="mt-3 pt-3 border-t border-gray-50 space-y-3">
                                                                    <div className="flex gap-4">
                                                                        {lease.guarantor?.idPhoto && (
                                                                            <div className="space-y-1">
                                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Sawirka ID</p>
                                                                                <a
                                                                                    href={`${import.meta.env.VITE_BACKEND_URL}/${lease.guarantor.idPhoto.replace(/\\/g, '/')}`}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    className="block w-16 h-16 rounded-lg border border-gray-100 overflow-hidden hover:opacity-80 transition-opacity bg-gray-50"
                                                                                >
                                                                                    <img
                                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${lease.guarantor.idPhoto.replace(/\\/g, '/')}`}
                                                                                        alt="Guarantor ID"
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                        {lease.guarantor?.workIdPhoto && (
                                                                            <div className="space-y-1">
                                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Work ID</p>
                                                                                <a
                                                                                    href={`${import.meta.env.VITE_BACKEND_URL}/${lease.guarantor.workIdPhoto.replace(/\\/g, '/')}`}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    className="block w-16 h-16 rounded-lg border border-gray-100 overflow-hidden hover:opacity-80 transition-opacity bg-gray-50"
                                                                                >
                                                                                    <img
                                                                                        src={`${import.meta.env.VITE_BACKEND_URL}/${lease.guarantor.workIdPhoto.replace(/\\/g, '/')}`}
                                                                                        alt="Work ID"
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                            Markhaatiyada (Witnesses)
                                                        </h4>
                                                        {[1, 2, 3].map(i => (
                                                            lease[`witness${i}Name`] && (
                                                                <div key={i} className="bg-white/50 rounded-lg border border-gray-100 p-3 space-y-2">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">{i}</div>
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Witness {i}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                                        <div>
                                                                            <p className="text-[9px] text-gray-400 uppercase">Magaca</p>
                                                                            <p className="font-semibold text-gray-700">{lease[`witness${i}Name`]}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[9px] text-gray-400 uppercase">Taleefanka</p>
                                                                            <p className="font-mono text-gray-600">{lease[`witness${i}Phone`]}</p>
                                                                        </div>
                                                                        <div className="col-span-2 pt-1">
                                                                            <p className="text-[9px] text-gray-400 uppercase">ID / Passport</p>
                                                                            <p className="font-mono text-gray-600">{lease[`witness${i}ID`]}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Center Column: Property & Vehicle */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                            Lease Financials
                                                        </h4>
                                                        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
                                                            <div className="flex justify-between items-end border-b border-gray-50 pb-2">
                                                                <span className="text-xs text-gray-400">Security Deposit</span>
                                                                <span className="text-lg font-bold text-gray-800">${lease.deposit?.toLocaleString() || '0'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Rent Cycle</span>
                                                                <span className="font-semibold text-gray-700 capitalize">{lease.rentCycle || 'Monthly'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-400">Auto Invoicing</span>
                                                                <span className={`font-bold ${lease.autoInvoice ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                    {lease.autoInvoice ? 'ENABLED' : 'DISABLED'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {(lease.vehicleMake || lease.weaponType) && (
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                                Additional Assets
                                                            </h4>
                                                            <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
                                                                {lease.vehicleMake && (
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="mt-0.5 text-gray-400 uppercase text-[10px] font-bold w-12">Vehicle</div>
                                                                        <div className="flex-1">
                                                                            <div className="text-sm font-bold text-gray-800">{lease.vehicleMake} {lease.vehicleModel}</div>
                                                                            <div className="text-xs text-blue-600 font-mono">{lease.vehiclePlate}</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {lease.weaponType && (
                                                                    <div className="flex items-start gap-3 pt-3 border-t border-gray-50">
                                                                        <div className="mt-0.5 text-gray-400 uppercase text-[10px] font-bold w-12">Weapon</div>
                                                                        <div className="flex-1">
                                                                            <div className="text-sm font-bold text-gray-800">{lease.weaponType}</div>
                                                                            <div className="text-xs text-red-600 font-mono">{lease.weaponLicense}</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Column: Conditions & Notes */}
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                                        Special Conditions & Notes
                                                    </h4>
                                                    <div className="bg-white p-5 rounded-xl border border-gray-100 min-h-[160px] relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                                            <FileText size={48} className="text-blue-600" />
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed italic">
                                                            {lease.conditions || 'No specific terms or conditions were recorded for this lease agreement.'}
                                                        </p>
                                                    </div>
                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                                                            onClick={(e) => { e.stopPropagation(); alert('Printing agreement feature coming soon!'); }}
                                                        >
                                                            PRINT AGREEMENT
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <LeaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                lease={currentLease}
                tenants={tenants}
                units={units}
                properties={properties}
                guarantors={guarantors}
                onRefreshData={fetchData}
            />

            <LeaseDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                lease={selectedLease}
                allTenants={tenants}
                allUnits={units}
                allGuarantors={guarantors}
                allProperties={properties}
            />
        </div>
    );
};

export default Leases;
