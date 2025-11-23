import React, { useState, useEffect } from 'react';
import LeaseModal from '../components/LeaseModal';
import axios from '../utils/axios';
import { Plus, FileText, Trash2, Edit } from 'lucide-react';

const Leases = () => {
    const [leases, setLeases] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLease, setCurrentLease] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leasesRes, tenantsRes, unitsRes] = await Promise.all([
                axios.get('/leases'),
                axios.get('/tenants'),
                axios.get('/units')
            ]);
            setLeases(leasesRes.data);
            setTenants(tenantsRes.data);
            setUnits(unitsRes.data);
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

    const handleSubmit = async (formData) => {
        try {
            if (currentLease) {
                const { data } = await axios.put(`/leases/${currentLease._id}`, formData);
                const updatedLease = {
                    ...data,
                    tenant: tenants.find(t => t._id === formData.tenant),
                    unit: units.find(u => u._id === formData.unit)
                };
                setLeases(leases.map(l => l._id === currentLease._id ? updatedLease : l));
            } else {
                const { data } = await axios.post('/leases', formData);
                const newLease = {
                    ...data,
                    tenant: tenants.find(t => t._id === formData.tenant),
                    unit: units.find(u => u._id === formData.unit)
                };
                setLeases([...leases, newLease]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving lease', error);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lease Contracts</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Lease
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-medium text-gray-500">Tenant</th>
                            <th className="p-4 text-sm font-medium text-gray-500">Unit</th>
                            <th className="p-4 text-sm font-medium text-gray-500">Start Date</th>
                            <th className="p-4 text-sm font-medium text-gray-500">End Date</th>
                            <th className="p-4 text-sm font-medium text-gray-500">Rent</th>
                            <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="p-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leases.map((lease) => (
                            <tr key={lease._id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{lease.tenant?.name}</td>
                                <td className="p-4 text-gray-600">{lease.unit?.unitNumber}</td>
                                <td className="p-4 text-gray-600">{new Date(lease.startDate).toLocaleDateString()}</td>
                                <td className="p-4 text-gray-600">{new Date(lease.endDate).toLocaleDateString()}</td>
                                <td className="p-4 font-medium text-gray-800">${lease.rentAmount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lease.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {lease.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(lease)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lease._id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
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
            />
        </div>
    );
};

export default Leases;
