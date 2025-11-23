import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

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
            setProperties(data);
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
                setProperties(properties.filter(p => p._id !== id));
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
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

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
            alert('Failed to save property');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Property
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
