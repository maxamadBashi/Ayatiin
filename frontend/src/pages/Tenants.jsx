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
            console.error('Error fetching tenants', error);
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
                await axios.put(`/tenants/${currentTenant._id}`, formData);
                fetchData();
            } else {
                await axios.post('/tenants', formData);
                fetchData();
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving tenant', error);
            const message = error.response?.data?.message || error.message || 'Error saving tenant';
            alert(message);
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
