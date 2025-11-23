import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { MessageSquare, Check, X, Clock } from 'lucide-react';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get('/requests');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) {
            return;
        }
        
        try {
            await axios.patch(`/requests/${id}/status`, { status });
            fetchRequests();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update status';
            alert(errorMessage);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Booking & Purchase Requests</h1>
                <p className="text-gray-600">Manage customer requests for booking or purchasing properties</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-700 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-yellow-800 mt-1">{pendingCount}</p>
                        </div>
                        <Clock className="text-yellow-600" size={24} />
                    </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700 font-medium">Approved</p>
                            <p className="text-2xl font-bold text-blue-800 mt-1">{approvedCount}</p>
                        </div>
                        <Check className="text-blue-600" size={24} />
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700 font-medium">Rejected</p>
                            <p className="text-2xl font-bold text-red-800 mt-1">{rejectedCount}</p>
                        </div>
                        <X className="text-red-600" size={24} />
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-green-800 mt-1">{completedCount}</p>
                        </div>
                        <Check className="text-green-600" size={24} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm">
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Property</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Visit Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Message</th>
                                    <th className="px-6 py-3">Request Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.customer?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{req.customer?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.property?.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{req.property?.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {req.visitDate ? (
                                                <div className="text-gray-900">
                                                    {new Date(req.visitDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.amount ? (
                                                <div className="font-semibold text-green-600">
                                                    ${Number(req.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            {req.message ? (
                                                <div className="text-sm text-gray-700" title={req.message}>
                                                    {req.message.length > 50 ? `${req.message.substring(0, 50)}...` : req.message}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No message</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                        className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} className="inline mr-1" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={16} className="inline mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {req.status === 'approved' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(req._id, 'completed')}
                                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                                                    title="Mark Completed"
                                                >
                                                    <Check size={16} className="inline mr-1" />
                                                    Complete
                                                </button>
                                            )}
                                            {(req.status === 'rejected' || req.status === 'completed') && (
                                                <span className="text-xs text-gray-400">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                            No requests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Requests;
