import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import { Clock, CheckCircle, XCircle, Home, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axios.get('/requests/my');
                setRequests(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="inline mr-1" />;
            case 'rejected': return <XCircle size={16} className="inline mr-1" />;
            case 'completed': return <CheckCircle size={16} className="inline mr-1" />;
            default: return <Clock size={16} className="inline mr-1" />;
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;
    const rejectedCount = requests.filter(r => r.status === 'rejected').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
                    <p className="text-gray-600 mt-2">Track the status of your property bookings and purchases.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading your requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                        <Home size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg font-medium mb-2">You haven't made any requests yet.</p>
                        <p className="text-gray-500 text-sm mb-6">Start by browsing our available properties and submit a booking or purchase request.</p>
                        <Link 
                            to="/" 
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <>
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
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">Approved</p>
                                        <p className="text-2xl font-bold text-green-800 mt-1">{approvedCount}</p>
                                    </div>
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-red-700 font-medium">Rejected</p>
                                        <p className="text-2xl font-bold text-red-800 mt-1">{rejectedCount}</p>
                                    </div>
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 font-medium">Completed</p>
                                        <p className="text-2xl font-bold text-blue-800 mt-1">{completedCount}</p>
                                    </div>
                                    <CheckCircle className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">All Requests</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <Home size={18} className="text-gray-400 mr-2" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.property?.name || 'Unknown Property'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {request.property?.location || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="capitalize px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {request.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {request.visitDate ? (
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Calendar size={16} className="text-gray-400 mr-2" />
                                                            {new Date(request.visitDate).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {request.amount ? (
                                                        <div className="flex items-center text-sm font-semibold text-green-600">
                                                            <DollarSign size={16} className="mr-1" />
                                                            {Number(request.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {request.message ? (
                                                        <div className="flex items-start text-sm text-gray-600 max-w-xs">
                                                            <MessageSquare size={16} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span title={request.message} className="truncate">
                                                                {request.message.length > 40 ? `${request.message.substring(0, 40)}...` : request.message}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No message</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Browse More Properties CTA */}
                        <div className="mt-6 text-center">
                            <Link 
                                to="/" 
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Home size={18} className="mr-2" />
                                Browse More Properties
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CustomerDashboard;
