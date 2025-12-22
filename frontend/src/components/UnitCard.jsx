import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const UnitCard = ({ unit, onDelete, onEdit }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'text-green-600 bg-green-50';
            case 'occupied': return 'text-blue-600 bg-blue-50';
            case 'maintenance': return 'text-orange-600 bg-orange-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'available': return <CheckCircle size={16} />;
            case 'occupied': return <XCircle size={16} />;
            case 'maintenance': return <AlertTriangle size={16} />;
            default: return null;
        }
    };

    return (
        <div className="card border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Unit {unit.unitNumber}</h3>
                    <p className="text-sm text-gray-500">{unit.property?.name || 'Unknown Property'}</p>
                </div>
                <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${getStatusColor(unit.status)}`}>
                    {getStatusIcon(unit.status)}
                    <span className="capitalize">{unit.status}</span>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-end">
                <div>
                    <p className="text-xs text-gray-500 uppercase">Type</p>
                    <p className="font-medium">{unit.type}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Rent</p>
                    <p className="text-lg font-bold text-blue-600">
                        ${typeof unit.rentAmount !== 'undefined' ? unit.rentAmount : unit.rentPrice}
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                    onClick={() => onEdit(unit)}
                    className="text-sm text-gray-600 hover:text-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(unit._id)}
                    className="text-sm text-red-500 hover:text-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UnitCard;
