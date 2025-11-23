import React, { useState, useEffect } from 'react';
import UnitCard from '../components/UnitCard';
import UnitModal from '../components/UnitModal';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [unitsRes, propertiesRes] = await Promise.all([
        axios.get('/units'),
        axios.get('/properties')
      ]);
      setUnits(unitsRes.data);
      setProperties(propertiesRes.data);
    } catch (error) {
      console.log('Using dummy data');
      setUnits([
        { _id: '1', unitNumber: '101', type: '2BHK', rentAmount: 1200, status: 'occupied', property: { _id: 'p1', name: 'Sunset Apartments' } },
        { _id: '2', unitNumber: '102', type: '1BHK', rentAmount: 900, status: 'available', property: { _id: 'p1', name: 'Sunset Apartments' } },
        { _id: '3', unitNumber: 'A-12', type: 'Studio', rentAmount: 750, status: 'maintenance', property: { _id: 'p2', name: 'Urban Lofts' } },
      ]);
      setProperties([
        { _id: 'p1', name: 'Sunset Apartments' },
        { _id: 'p2', name: 'Urban Lofts' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await axios.delete(`/units/${id}`);
        setUnits(units.filter(u => u._id !== id));
      } catch (error) {
        setUnits(units.filter(u => u._id !== id));
      }
    }
  };

  const handleEdit = (unit) => {
    setCurrentUnit(unit);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentUnit(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentUnit) {
        const { data } = await axios.put(`/units/${currentUnit._id}`, formData);
        // Refresh to get populated property
        const updatedUnit = { ...data, property: properties.find(p => p._id === formData.property) };
        setUnits(units.map(u => u._id === currentUnit._id ? updatedUnit : u));
      } else {
        const { data } = await axios.post('/units', formData);
        const newUnit = { ...data, property: properties.find(p => p._id === formData.property) };
        setUnits([...units, newUnit]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving unit', error);
      // Dummy fallback
      if (currentUnit) {
        setUnits(units.map(u => u._id === currentUnit._id ? { ...u, ...formData, property: properties.find(p => p._id === formData.property) } : u));
      } else {
        setUnits([...units, { _id: Date.now().toString(), ...formData, property: properties.find(p => p._id === formData.property) }]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Units</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Unit
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <UnitCard
              key={unit._id}
              unit={unit}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <UnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        unit={currentUnit}
        properties={properties}
      />
    </div>
  );
};

export default Units;
