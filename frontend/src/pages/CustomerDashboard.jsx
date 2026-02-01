import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import {
    Clock, CheckCircle, XCircle, Home, Calendar,
    DollarSign, MessageSquare, Wrench, Sparkles,
    Shield, ArrowRight, Plus, MapPin, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [tenantProfile, setTenantProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const [requestsRes, maintenanceRes, tenantRes] = await Promise.all([
                    axios.get('/requests/my'),
                    axios.get('/maintenance/my'),
                    axios.get('/tenants/me').catch(() => ({ data: null }))
                ]);
                setRequests(requestsRes.data);
                setMaintenanceRequests(maintenanceRes.data);
                setTenantProfile(tenantRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={14} />;
            case 'rejected': return <XCircle size={14} />;
            case 'completed': return <CheckCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const stats = {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    const StatCard = ({ title, value, icon, gradient }) => (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-[0.03] -mr-6 -mt-6 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    {icon}
                </div>
            </div>
            <div className="mt-5 relative z-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-500">
                {/* --- HERO SECTION --- */}
                <div className="relative rounded-[40px] overflow-hidden bg-slate-900 px-10 py-16 text-white shadow-2xl">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-300 mb-6">
                                <Sparkles size={12} />
                                <span>Dashboard Overview</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Activity</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                                Track your property journey, manage maintenance requests, and stay updated on your applications.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 px-8 py-5 bg-white text-slate-900 rounded-3xl font-black shadow-xl hover:scale-105 transition-all active:scale-95 group"
                            >
                                <Home size={20} className="text-blue-600" />
                                <span>Explore Properties</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing your data...</p>
                    </div>
                ) : (
                    <>
                        {/* --- QUICK KPI'S --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Active Requests" value={stats.pending} icon={<Clock size={20} />} gradient="from-amber-600 to-amber-400" />
                            <StatCard title="Approved" value={stats.approved} icon={<CheckCircle size={20} />} gradient="from-emerald-600 to-emerald-400" />
                            <StatCard title="Maintenance" value={maintenanceRequests.length} icon={<Wrench size={20} />} gradient="from-red-600 to-red-400" />
                            <StatCard title="Completed" value={stats.completed} icon={<Shield size={20} />} gradient="from-blue-600 to-blue-400" />
                        </div>

                        {/* --- REQUESTS TABLE --- */}
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recent Requests</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Property bookings & purchases</p>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <MessageSquare size={24} />
                                </div>
                            </div>

                            {requests.length === 0 ? (
                                <div className="px-10 py-16 text-center">
                                    <p className="text-slate-400 font-medium">No requests found in your history.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto px-6 pb-6 mt-4">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                                <th className="px-6 py-4">Property Identity</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Financials</th>
                                                <th className="px-6 py-4">Lifecycle</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {requests.map((request) => (
                                                <tr key={request._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-transform group-hover:scale-110">
                                                                <Home size={22} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-800 leading-none">{request.property?.name || 'Untitled Property'}</p>
                                                                <p className="text-xs font-semibold text-slate-400 mt-1.5 flex items-center gap-1">
                                                                    <MapPin size={10} />
                                                                    {request.property?.location || 'Location Pending'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="inline-flex px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-blue-100">
                                                            {request.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-lg font-black text-slate-800">${request.amount?.toLocaleString()}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">USD</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(request.status)}`}>
                                                                {getStatusIcon(request.status)}
                                                                {request.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                                {new Date(request.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* --- MAINTENANCE SECTION --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-red-50/30 to-white">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Maintenance Logs</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Active issues & history</p>
                                    </div>
                                    <button
                                        onClick={() => setIsMaintenanceModalOpen(true)}
                                        className="p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95 group"
                                    >
                                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>

                                {maintenanceRequests.length === 0 ? (
                                    <div className="px-10 py-16 text-center">
                                        <p className="text-slate-400 font-medium">No maintenance history reported.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto px-6 pb-6 mt-4">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                                                    <th className="px-6 py-4">Description</th>
                                                    <th className="px-6 py-4">Priority</th>
                                                    <th className="px-6 py-4 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {maintenanceRequests.map((req) => (
                                                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-5">
                                                            <p className="text-sm font-black text-slate-800 leading-snug max-w-xs">{req.description}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                                {new Date(req.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${req.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                    req.priority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                                }`}>
                                                                {req.priority}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${req.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                    req.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                                }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${req.status === 'completed' ? 'bg-emerald-500' : req.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                                                                {req.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                            <AlertCircle size={28} className="text-blue-400" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight mb-4 leading-tight">Need Support?</h3>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            Our team is here to assist you with any concerns regarding your tenancy or applications.
                                        </p>
                                    </div>
                                    <Link
                                        to="/contact"
                                        className="mt-12 w-full py-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-white/5 active:scale-95"
                                    >
                                        <span>Contact Support</span>
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* --- PREMIUM MAINTENANCE MODAL --- */}
            {isMaintenanceModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-8 border-b border-slate-50 bg-gradient-to-r from-red-50 to-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-500/20">
                                    <Wrench size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Report Issue</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Maintenance Request</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMaintenanceModalOpen(false)} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="mb-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-100">
                                    <Home size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">Assigned Residence</p>
                                    <p className="text-xs font-bold text-slate-800">
                                        {tenantProfile?.leases?.find(l => l.status === 'active')?.unit?.property?.name || 'Searching for unit...'}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const activeLease = tenantProfile?.leases?.find(l => l.status === 'active');
                                    if (!activeLease) {
                                        alert("You need an active lease to report maintenance issues.");
                                        return;
                                    }

                                    await axios.post('/maintenance', {
                                        description: e.target.description.value,
                                        priority: e.target.priority.value,
                                        property: activeLease.unit.property.id || activeLease.unit.property._id,
                                        unit: activeLease.unit.id || activeLease.unit._id
                                    });

                                    alert("✅ Maintenance request submitted successfully!");
                                    setIsMaintenanceModalOpen(false);
                                    const res = await axios.get('/maintenance/my');
                                    setMaintenanceRequests(res.data);
                                } catch (err) {
                                    alert("Failed to submit: " + (err.response?.data?.message || err.message));
                                }
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Issue Description</label>
                                    <textarea
                                        name="description"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-medium min-h-[120px]"
                                        placeholder="Describe the issue in detail..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Priority Level</label>
                                        <select
                                            name="priority"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-bold appearance-none"
                                        >
                                            <option value="low">Standard Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">Urgent Response</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span>Dispatch Request</span>
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
