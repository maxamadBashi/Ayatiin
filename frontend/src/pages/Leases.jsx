import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, FileText } from 'lucide-react';

const Leases = () => {
    const [leases, setLeases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeases();
    }, []);

    const fetchLeases = async () => {
        try {
            const { data } = await axios.get('/leases');
            setLeases(data);
        } catch (error) {
            setLeases([
                {
                    _id: '1',
                    tenant: { name: 'John Doe' },
                    unit: { unitNumber: '101' },
                    startDate: '2023-01-01',
                    endDate: '2023-12-31',
                    monthlyRent: 1200,
                    status: 'active'
                },
                {
                    _id: '2',
                    tenant: { name: 'Jane Smith' },
                    unit: { unitNumber: 'B-05' },
                    startDate: '2023-03-15',
                    endDate: '2024-03-14',
                    monthlyRent: 1800,
                    status: 'active'
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Lease Contracts</h1>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Lease
                </button>
            </div>

            <div className="card overflow-hidden">
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
                                <td className="p-4 font-medium">{lease.tenant?.name}</td>
                                <td className="p-4">{lease.unit?.unitNumber}</td>
                                <td className="p-4">{new Date(lease.startDate).toLocaleDateString()}</td>
                                <td className="p-4">{new Date(lease.endDate).toLocaleDateString()}</td>
                                <td className="p-4">${lease.monthlyRent}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lease.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {lease.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leases;
