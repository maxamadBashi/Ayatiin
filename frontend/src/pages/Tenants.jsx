import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import TenantModal from '../components/TenantModal';
import axios from '../utils/axios';
import { Plus, Users, Sparkles, UserPlus } from 'lucide-react';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTenant, setCurrentTenant] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tenantsRes, unitsRes] = await Promise.all([
                axios.get('/tenants'),
                axios.get('/units')
            ]);

            const unitsData = unitsRes.data;

            // Augment tenants with their assigned unit from active lease
            const augmentedTenants = tenantsRes.data.map(tenant => {
                const activeLease = tenant.leases?.find(lease => lease.status === 'active');
                let assignedUnit = null;
                let assignedProperty = null;

                if (activeLease && activeLease.unit) {
                    assignedUnit = activeLease.unit;
                    assignedProperty = activeLease.unit.property; // Now this should be the full property object
                }

                const augmentedTenant = {
                    ...tenant,
                    unit: assignedUnit,
                    property: assignedProperty
                };
                return augmentedTenant;
            });

            setTenants(augmentedTenants);
            setUnits(unitsData);

        } catch (error) {
            console.error('Frontend (Tenants.jsx): Error fetching tenant data:', error); // DEBUG LOG
            // Dummy data with full property objects for units in leases and standalone units
            setTenants([
                { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0123', status: 'active', unit: { _id: 'u1', unitNumber: '101', property: { id: 'p1', name: 'Sunset Apartments' } } },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0456', status: 'active', unit: { _id: 'u2', unitNumber: 'B-05', property: { id: 'p1', name: 'Sunset Apartments' } } },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0789', status: 'inactive', unit: null },
            ]);
            setUnits([
                { _id: 'u1', unitNumber: '101', status: 'occupied', property: { id: 'p1', name: 'Sunset Apartments' } },
                { _id: 'u2', unitNumber: 'B-05', status: 'occupied', property: { id: 'p1', name: 'Sunset Apartments' } },
                { _id: 'u3', unitNumber: '102', status: 'available', property: { id: 'p2', name: 'Urban Lofts' } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const [deleteMessage, setDeleteMessage] = useState({ type: '', text: '' });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await axios.delete(`/tenants/${id}`);
                setTenants(tenants.filter(t => t._id !== id));
                setDeleteMessage({ type: 'success', text: 'Tenant deleted successfully' });
                setTimeout(() => setDeleteMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                console.error('Frontend (Tenants.jsx): Error deleting tenant', error); // DEBUG LOG
                const errorMessage = error.response?.data?.message || 'Failed to delete tenant. They might have an active lease.';
                setDeleteMessage({ type: 'error', text: errorMessage });
                setTimeout(() => setDeleteMessage({ type: '', text: '' }), 5000);
            }
        }
    };

    const handleEdit = (tenant) => {
        setCurrentTenant(tenant);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentTenant(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentTenant) {
                await axios.put(`/tenants/${currentTenant._id}`, formData);
            } else {
                await axios.post('/tenants', formData);
            }
            fetchData(); // Refresh data after any change
            setIsModalOpen(false);
        } catch (error) {
            console.error('Frontend (Tenants.jsx): Error saving tenant:', error); // DEBUG LOG
            const message = error.response?.data?.message || error.message || 'Error saving tenant';
            alert(message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 bg-slate-100 rounded-3xl p-8">
            {deleteMessage.text && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${deleteMessage.type === 'success'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <span className="font-bold">{deleteMessage.type === 'success' ? '✓' : '✗'}</span>
                        <span>{deleteMessage.text}</span>
                    </div>
                </div>
            )}
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-lg border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Users size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Community</span>
                            <Sparkles size={12} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tenants</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Directing {tenants.length} Active Residents</p>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>Add Resident</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Resident database syncing...</p>
                </div>
            ) : tenants.length === 0 ? (
                <div className="bg-slate-50 rounded-[40px] p-20 text-center border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <UserPlus size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">No active tenants</h3>
                    <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">Start by registering your first resident to manage their leases and payments.</p>
                    <button
                        onClick={handleAdd}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Register Tenant
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tenants.map((tenant) => (
                        <TenantCard
                            key={tenant._id}
                            tenant={tenant}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <TenantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                tenant={currentTenant}
                units={units}
            />
        </div>
    );
};

export default Tenants;
