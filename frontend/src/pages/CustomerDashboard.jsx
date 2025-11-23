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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
            <Navbar />

            <main className="max-w-7xl mx-auto py-10 px-6">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        📋 Your Requests
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Requests</span>
                    </h1>
                    <p className="text-xl text-gray-600">Track the status of your property bookings and purchases</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                        <p className="mt-6 text-gray-600 text-lg font-medium">Loading your requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                        <div className="inline-block p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                            <Home size={56} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Requests Yet</h3>
                        <p className="text-gray-600 text-lg mb-2">You haven't made any requests yet.</p>
                        <p className="text-gray-500 mb-8">Start by browsing our available properties and submit a booking or purchase request.</p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Home size={20} />
                            <span>Browse Properties</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-yellow-700 font-semibold uppercase tracking-wide mb-1">Pending</p>
                                        <p className="text-3xl font-extrabold text-yellow-900">{pendingCount}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-yellow-200 rounded-xl flex items-center justify-center">
                                        <Clock className="text-yellow-700" size={28} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-semibold uppercase tracking-wide mb-1">Approved</p>
                                        <p className="text-3xl font-extrabold text-green-900">{approvedCount}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-green-200 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="text-green-700" size={28} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-red-700 font-semibold uppercase tracking-wide mb-1">Rejected</p>
                                        <p className="text-3xl font-extrabold text-red-900">{rejectedCount}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-red-200 rounded-xl flex items-center justify-center">
                                        <XCircle className="text-red-700" size={28} />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 font-semibold uppercase tracking-wide mb-1">Completed</p>
                                        <p className="text-3xl font-extrabold text-blue-900">{completedCount}</p>
                                    </div>
                                    <div className="w-14 h-14 bg-blue-200 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="text-blue-700" size={28} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="text-blue-600" size={24} />
                                    <span>All Requests</span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Visit Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Request Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {requests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Home size={20} className="text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">
                                                                {request.property?.name || 'Unknown Property'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {request.property?.location || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="capitalize px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg text-xs font-bold shadow-sm">
                                                        {request.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {request.visitDate ? (
                                                        <div className="flex items-center text-sm font-semibold text-gray-900">
                                                            <Calendar size={16} className="text-blue-600 mr-2" />
                                                            {new Date(request.visitDate).toLocaleDateString()}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">Not set</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    {request.amount ? (
                                                        <div className="flex items-center text-sm font-bold text-green-600">
                                                            <DollarSign size={18} className="mr-1" />
                                                            {Number(request.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-gray-600">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-4 py-1.5 inline-flex items-center text-xs font-bold rounded-xl border-2 shadow-sm ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {request.message ? (
                                                        <div className="flex items-start text-sm text-gray-700 max-w-xs">
                                                            <MessageSquare size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span title={request.message} className="truncate font-medium">
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
                        <div className="mt-8 text-center">
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Home size={20} />
                                <span>Browse More Properties</span>
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default CustomerDashboard;
