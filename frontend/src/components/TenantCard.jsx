import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

const TenantCard = ({ tenant, onDelete, onEdit }) => {
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {tenant.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span className="truncate">{tenant.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-gray-400" />
          <span>{tenant.phone}</span>
        </div>
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <span className="text-gray-500">Unit: </span>
          <span className="font-medium">{tenant.unit?.unitNumber || 'Not Assigned'}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button 
          onClick={() => onEdit(tenant)}
          className="text-sm text-gray-600 hover:text-blue-600"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(tenant._id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TenantCard;
