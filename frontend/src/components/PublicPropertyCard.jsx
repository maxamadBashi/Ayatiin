import React from 'react';
import { MapPin, Bed, Bath, Square, Home } from 'lucide-react';

const PublicPropertyCard = ({ property, onBook, onBuy }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48">
                <img
                    src={property.images && property.images.length > 0
                        ? `http://localhost:5000/${property.images[0]}`
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {property.status}
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{property.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin size={16} className="mr-1" />
                            {property.location || property.address}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                            ${property.price?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {property.status === 'rented' ? '/month' : ''}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 my-4">
                    <div className="flex flex-col items-center text-gray-600">
                        <Bed size={20} className="mb-1 text-blue-500" />
                        <span className="text-sm font-medium">{property.bedrooms || 0} Beds</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <Bath size={20} className="mb-1 text-blue-500" />
                        <span className="text-sm font-medium">{property.bathrooms || 0} Baths</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-600">
                        <Home size={20} className="mb-1 text-blue-500" />
                        <span className="text-sm font-medium">{property.type}</span>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => onBook(property)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={() => onBuy(property)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicPropertyCard;
