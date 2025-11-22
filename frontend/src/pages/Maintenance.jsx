import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, AlertCircle } from 'lucide-react';

const Maintenance = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/maintenance');
            setRequests(data);
        } catch (error) {
            setRequests([
                {
                    _id: '1',
                    property: { name: 'Sunset Apartments' },
                    unit: { unitNumber: '101' },
                    description: 'Leaking faucet in kitchen',
                    priority: 'medium',
                    status: 'pending',
                    createdAt: '2023-11-20'
                },
                {
                    _id: '2',
                    property: { name: 'Urban Lofts' },
                    unit: { unitNumber: 'A-12' },
                    description: 'AC not cooling',
                    priority: 'high',
                    status: 'in-progress',
                    createdAt: '2023-11-18'
                },
            ]);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-orange-600 bg-orange-50';
            case 'low': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            <div className="grid gap-4">
                {requests.map((req) => (
                    <div key={req._id} className="card flex justify-between items-center">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${getPriorityColor(req.priority)}`}>
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{req.description}</h3>
                                <p className="text-sm text-gray-500">
                                    {req.property?.name} • Unit {req.unit?.unitNumber}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Reported on {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    req.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {req.status}
                            </span>
                            <button className="text-sm text-gray-600 hover:text-blue-600">Update</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Maintenance;
