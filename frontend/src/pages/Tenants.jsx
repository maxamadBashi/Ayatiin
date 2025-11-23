import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import TenantModal from '../components/TenantModal';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

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
            setTenants(tenantsRes.data);
            setUnits(unitsRes.data);
        } catch (error) {
            console.log('Using dummy tenants');
            setTenants([
                { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0123', status: 'active', unit: { _id: 'u1', unitNumber: '101' } },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0456', status: 'active', unit: { _id: 'u2', unitNumber: 'B-05' } },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0789', status: 'inactive', unit: null },
            ]);
            setUnits([
                { _id: 'u1', unitNumber: '101', status: 'occupied' },
                { _id: 'u2', unitNumber: 'B-05', status: 'occupied' },
                { _id: 'u3', unitNumber: '102', status: 'available' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tenant?')) {
            try {
                await axios.delete(`/tenants/${id}`);
                setTenants(tenants.filter(t => t._id !== id));
            } catch (error) {
                setTenants(tenants.filter(t => t._id !== id));
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
                const { data } = await axios.put(`/tenants/${currentTenant._id}`, formData);
                const updatedTenant = { ...data, unit: units.find(u => u._id === formData.unit) };
                setTenants(tenants.map(t => t._id === currentTenant._id ? updatedTenant : t));
            } else {
                const { data } = await axios.post('/tenants', formData);
                const newTenant = { ...data, unit: units.find(u => u._id === formData.unit) };
                setTenants([...tenants, newTenant]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving tenant', error);
            // Dummy fallback
            if (currentTenant) {
                setTenants(tenants.map(t => t._id === currentTenant._id ? { ...t, ...formData, unit: units.find(u => u._id === formData.unit) } : t));
            } else {
                setTenants([...tenants, { _id: Date.now().toString(), ...formData, unit: units.find(u => u._id === formData.unit) }]);
            }
            setIsModalOpen(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Tenant
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
