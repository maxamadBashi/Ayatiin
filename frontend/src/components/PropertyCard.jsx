import React from 'react';
import { MapPin, Home } from 'lucide-react';

const PropertyCard = ({ property, onDelete, onEdit }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Home className="text-blue-600" size={24} />
        </div>
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
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
      
      <div className="flex items-center gap-2 text-gray-500 mb-3">
        <MapPin size={16} />
        <span className="text-sm">{property.location}</span>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>
    </div>
  );
};

export default PropertyCard;
