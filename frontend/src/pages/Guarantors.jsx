import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, Edit, Trash2, Shield, Phone, Mail, User, Eye } from 'lucide-react';
import GuarantorModal from '../components/GuarantorModal';
import GuarantorDetailsModal from '../components/GuarantDetailsModal';

const Guarantors = () => {
    const [guarantors, setGuarantors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGuarantor, setCurrentGuarantor] = useState(null);
    const [selectedGuarantor, setSelectedGuarantor] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchGuarantors();
    }, []);

    const fetchGuarantors = async () => {
        try {
            const { data } = await axios.get('/guarantors');
            setGuarantors(data);
        } catch (error) {
            console.error('Error fetching guarantors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setCurrentGuarantor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (guarantor) => {
        setCurrentGuarantor(guarantor);
        setIsModalOpen(true);
    };

    const handleView = (guarantor) => {
        setSelectedGuarantor(guarantor);
        setIsDetailsOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this guarantor?')) return;
        try {
            await axios.delete(`/guarantors/${id}`);
            setGuarantors(guarantors.filter(g => g._id !== id));
        } catch (error) {
            alert('Failed to delete guarantor');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (currentGuarantor) {
                await axios.put(`/guarantors/${currentGuarantor._id}`, formData);
            } else {
                await axios.post('/guarantors', formData);
            }
            fetchGuarantors();
            setIsModalOpen(false);
        } catch (error) {
            alert('Error saving guarantor: ' + error.response?.data?.message || error.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading guarantors...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Shield className="text-blue-600" />
                        Guarantor Management
                    </h1>
                    <p className="text-gray-500 text-sm">Manage reliable guarantors for lease contracts</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg active:scale-95 font-bold"
                >
                    <Plus size={20} />
                    Add New Guarantor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guarantors.map(guarantor => (
                    <div key={guarantor._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{guarantor.name}</h3>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${guarantor.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {guarantor.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleView(guarantor)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="View Details"><Eye size={18} /></button>
                                <button onClick={() => handleEdit(guarantor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(guarantor._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone size={16} className="text-gray-400" />
                                {guarantor.phone}
                            </div>
                            {guarantor.email && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    {guarantor.email}
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Shield size={16} className="text-gray-400" />
                                ID: {guarantor.idNumber}
                            </div>
                        </div>

                        {guarantor.workInfo && (
                            <div className="mt-4 pt-4 border-t text-xs text-gray-500 italic line-clamp-2">
                                {guarantor.workInfo}
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            {guarantor.idPhoto && <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">ID Photo Attached</span>}
                            {guarantor.workIdPhoto && <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">Work ID Attached</span>}
                        </div>
                    </div>
                ))}
            </div>

            {guarantors.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                    <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No guarantors found. Start by adding one!</p>
                </div>
            )}

            <GuarantorDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                guarantor={selectedGuarantor}
            />

            <GuarantorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                guarantor={currentGuarantor}
            />
        </div>
    );
};

export default Guarantors;
