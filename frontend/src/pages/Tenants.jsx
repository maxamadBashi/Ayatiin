import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const { data } = await axios.get('/tenants');
            setTenants(data);
        } catch (error) {
            console.log('Using dummy tenants');
            setTenants([
                { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-0123', status: 'active', unit: { unitNumber: '101' } },
                { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-0456', status: 'active', unit: { unitNumber: 'B-05' } },
                { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0789', status: 'inactive', unit: null },
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
        console.log('Edit tenant', tenant);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tenants</h1>
                <button className="btn-primary flex items-center gap-2">
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
        </div>
    );
};

export default Tenants;
