import React from 'react';
import { MapPin, Home } from 'lucide-react';

const PropertyCard = ({ property, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'rented': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-48 w-full bg-gray-200 relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${property.images[0].startsWith('/') ? '' : '/'}${property.images[0]}`}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Home size={48} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(property.status)}`}>
            {property.status || 'Available'}
          </span>
          {property.units && property.units.length > 0 && (
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-gray-800 shadow-sm border border-gray-100">
              {property.units.filter(u => u.status === 'available').length} / {property.units.length} UNITS FREE
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(property)}
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(property._id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-3">
          <MapPin size={16} />
          <span className="text-sm">
            {property.city}{property.address ? `, ${property.address}` : ''}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
