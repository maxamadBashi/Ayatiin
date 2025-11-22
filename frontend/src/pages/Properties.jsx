import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

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
                { _id: '1', name: 'Sunset Apartments', location: '123 Main St, City', description: 'Luxury apartments with ocean view' },
                { _id: '2', name: 'Green Valley Homes', location: '456 Oak Ave, Suburb', description: 'Family friendly community with parks' },
                { _id: '3', name: 'Urban Lofts', location: '789 Downtown Blvd', description: 'Modern lofts in the heart of the city' },
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
                // For dummy data simulation
                setProperties(properties.filter(p => p._id !== id));
            }
        }
    };

    const handleEdit = (property) => {
        console.log('Edit property', property);
        // Implement edit modal logic here
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
                <button className="btn-primary flex items-center gap-2">
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
        </div>
    );
};

export default Properties;
