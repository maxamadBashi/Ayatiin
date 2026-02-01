import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import axios from '../utils/axios';
import { Plus, Building2, Sparkles, Home } from 'lucide-react';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data } = await axios.get('/properties');
            const buildingProperties = data.filter(p => !p.type.includes('Land'));
            setProperties(buildingProperties);
        } catch (error) {
            console.log('Using dummy properties');
            setProperties([
                { _id: '1', name: 'Sunset Apartments', address: '123 Main St, City', type: 'residential', description: 'Luxury apartments with ocean view' },
                { _id: '2', name: 'Green Valley Homes', address: '456 Oak Ave, Suburb', type: 'residential', description: 'Family friendly community with parks' },
                { _id: '3', name: 'Urban Lofts', address: '789 Downtown Blvd', type: 'commercial', description: 'Modern lofts in the heart of the city' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await axios.delete(`/properties/${id}`);
                setProperties(properties.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting property', error);
                const errorMessage = error.response?.data?.message || 'Failed to delete property. It might have existing units.';
                alert(errorMessage);
            }
        }
    };

    const handleEdit = (property) => {
        setCurrentProperty(property);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentProperty(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (currentProperty) {
                const { data } = await axios.put(`/properties/${currentProperty._id}`, formData, config);
                setProperties(properties.map(p => p._id === currentProperty._id ? data : p));
            } else {
                const { data } = await axios.post('/properties', formData, config);
                setProperties([...properties, data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving property', error);
            const errorMessage = error.response?.data?.message || 'Failed to save property';
            alert(errorMessage);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Management</span>
                            <Sparkles size={12} className="text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Properties</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Found {properties.length} Active Buildings</p>
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 group"
                >
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                        <Plus size={18} />
                    </div>
                    <span>New Property</span>
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Inventory syncing...</p>
                </div>
            ) : properties.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Home size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Portfolio is Empty</h3>
                    <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">Start building your real estate empire by adding your first property to the system.</p>
                    <button
                        onClick={handleAdd}
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Register Asset
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property._id}
                            property={property}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <PropertyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                property={currentProperty}
            />
        </div>
    );
};

export default Properties;
