import React, { useState, useEffect } from 'react';
import MaintenanceModal from '../components/MaintenanceModal';
import axios from '../utils/axios';
import { Plus, AlertCircle, Sparkles } from 'lucide-react';

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
            const errorMessage = error.response?.data?.message || 'Error saving maintenance request';
            alert(errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this maintenance request?')) {
            try {
                await axios.delete(`/maintenance/${id}`);
                setRequests(requests.filter(req => req._id !== id));
            } catch (error) {
                console.error('Error deleting request:', error);
                const errorMessage = error.response?.data?.message || 'Failed to delete request';
                alert(errorMessage);
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full">Operations</span>
                            <Sparkles size={12} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Maintenance Requests</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Directing {requests.length} Active Issues</p>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>New Request</span>
                </button>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-amber-600/10 border-t-amber-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Scanning systems...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Systems Operational</h3>
                        <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">No pending maintenance requests found. All properties are currently in top condition.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`p-4 rounded-2xl ${getPriorityColor(req.priority)} group-hover:scale-110 transition-transform`}>
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{req.description}</h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            {req.property?.name || req.unit?.property?.name}
                                        </p>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest leading-none bg-blue-50 px-2 py-0.5 rounded">
                                            Unit {req.unit?.unitNumber}
                                        </p>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${req.status === 'completed' ? 'bg-emerald-500 text-white' :
                                    req.status === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {req.status}
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(req)}
                                        className="p-3 bg-white text-slate-900 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(req._id)}
                                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-black text-[10px] uppercase tracking-widest"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
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
