import React, { useState, useEffect } from 'react';
import MaintenanceModal from '../components/MaintenanceModal';
import axios from '../utils/axios';
import { Plus, AlertCircle } from 'lucide-react';

const Maintenance = () => {
    const [requests, setRequests] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsRes, unitsRes] = await Promise.all([
                axios.get('/maintenance'),
                axios.get('/units')
            ]);
            setRequests(requestsRes.data);
            setUnits(unitsRes.data);
        } catch (error) {
            console.log('Using dummy data');
            setRequests([
                {
                    _id: '1',
                    property: { name: 'Sunset Apartments' },
                    unit: { _id: 'u1', unitNumber: '101', property: { name: 'Sunset Apartments' } },
                    description: 'Leaking faucet in kitchen',
                    priority: 'medium',
                    status: 'pending',
                    createdAt: '2023-11-20'
                },
            ]);
            setUnits([
                { _id: 'u1', unitNumber: '101', property: { name: 'Sunset Apartments' } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (request) => {
        setCurrentRequest(request);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentRequest(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentRequest) {
                const { data } = await axios.put(`/maintenance/${currentRequest._id}`, formData);
                // Manually populate for immediate UI update
                const updatedRequest = {
                    ...data,
                    unit: units.find(u => u._id === formData.unit),
                    property: units.find(u => u._id === formData.unit)?.property
                };
                setRequests(requests.map(r => r._id === currentRequest._id ? updatedRequest : r));
            } else {
                const { data } = await axios.post('/maintenance', formData);
                // Manually populate for immediate UI update
                const newRequest = {
                    ...data,
                    unit: units.find(u => u._id === formData.unit),
                    property: units.find(u => u._id === formData.unit)?.property
                };
                setRequests([...requests, newRequest]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving request', error);
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this maintenance request?')) {
            try {
                await axios.delete(`/maintenance/${id}`);
                setRequests(requests.filter(req => req._id !== id));
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Failed to delete request');
            }
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    New Request
                </button>
            </div>

            <div className="grid gap-4">
                {requests.map((req) => (
                    <div key={req._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${getPriorityColor(req.priority)}`}>
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{req.description}</h3>
                                <p className="text-sm text-gray-500">
                                    {req.property?.name || req.unit?.property?.name} • Unit {req.unit?.unitNumber}
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
                            <button
                                onClick={() => handleEdit(req)}
                                className="text-sm text-gray-600 hover:text-blue-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(req._id)}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <MaintenanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                request={currentRequest}
                units={units}
            />
        </div >
    );
};

export default Maintenance;
