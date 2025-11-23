import React from 'react';
import { MapPin, Bed, Bath, Square, Home } from 'lucide-react';

const PublicPropertyCard = ({ property, onBook, onBuy }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            {/* Image Section */}
            <div className="relative h-56">
                <img
                    src={property.images && property.images.length > 0
                        ? `http://localhost:5000/${property.images[0]}`
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={property.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-[#1e3a8a] shadow-sm">
                    {property.status}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{property.description || 'Beautiful property for you'}</p>
                </div>

                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-2xl font-bold text-[#4f46e5]">
                            ${property.price?.toLocaleString() || 'N/A'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">{property.location || 'Unknown'}</p>
                    </div>
                </div>

                {/* Amenities Footer */}
                <div className="flex items-center justify-between py-3 border-t border-gray-100 text-gray-500 text-sm mb-4">
                    <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms || 0} beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath size={16} />
                        <span>{property.bathrooms || 0} baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Square size={16} />
                        <span>{property.area || 1200} sq.ft</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onBook(property)}
                        className="flex-1 bg-[#1e3a8a] text-white py-2.5 rounded-lg hover:bg-blue-900 transition-colors font-medium text-sm"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={() => onBuy(property)}
                        className="flex-1 border border-[#1e3a8a] text-[#1e3a8a] py-2.5 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicPropertyCard;
