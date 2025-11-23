import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Land = () => {
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
            // Filter for Land types
            const landProperties = data.filter(p =>
                p.type === 'Land' ||
                p.type === 'Land for Sale' ||
                p.type === 'Commercial Land' ||
                p.type === 'Residential Land' ||
                p.type === 'Farm Land' ||
                p.type === 'Investment Land'
            );
            setProperties(landProperties);
        } catch (error) {
            console.log('Error fetching properties', error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this land property?')) {
            try {
                await axios.delete(`/properties/${id}`);
                setProperties(properties.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting property', error);
                alert('Failed to delete property');
            }
        }
    };

    const handleEdit = (property) => {
        setCurrentProperty(property);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentProperty({ type: 'Land' }); // Set default type for new land
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (currentProperty && currentProperty._id) {
                const { data } = await axios.put(`/properties/${currentProperty._id}`, formData, config);
                setProperties(properties.map(p => p._id === currentProperty._id ? data : p));
            } else {
                const { data } = await axios.post('/properties', formData, config);
                // Only add to list if it's a land type (it should be, but good to check or just add)
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Land Management</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Add Land
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : properties.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No land properties found.</div>
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
                isLand={true}
            />
        </div>
    );
};

export default Land;
