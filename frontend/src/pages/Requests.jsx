import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { MessageSquare, Check, X, Clock, Sparkles } from 'lucide-react';

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
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">CRM</span>
                            <Sparkles size={12} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Booking Requests</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Found {requests.length} Incoming Leads</p>
                    </div>
                </div>
            </div>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Pending</p>
                    <div className="flex items-end justify-between relative z-10">
                        <h3 className="text-3xl font-black text-slate-800">{pendingCount}</h3>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Approved</p>
                    <div className="flex items-end justify-between relative z-10">
                        <h3 className="text-3xl font-black text-slate-800">{approvedCount}</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Check size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Rejected</p>
                    <div className="flex items-end justify-between relative z-10">
                        <h3 className="text-3xl font-black text-slate-800">{rejectedCount}</h3>
                        <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                            <X size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Completed</p>
                    <div className="flex items-end justify-between relative z-10">
                        <h3 className="text-3xl font-black text-slate-800">{completedCount}</h3>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Check size={20} />
                        </div>
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
