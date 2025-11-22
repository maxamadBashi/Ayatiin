import React, { useState, useEffect } from 'react';
import UnitCard from '../components/UnitCard';
import axios from '../utils/axios';
import { Plus } from 'lucide-react';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const { data } = await axios.get('/units');
      setUnits(data);
    } catch (error) {
      console.log('Using dummy units');
      setUnits([
        { _id: '1', unitNumber: '101', type: '2BHK', rentPrice: 1200, status: 'occupied', property: { name: 'Sunset Apartments' } },
        { _id: '2', unitNumber: '102', type: '1BHK', rentPrice: 900, status: 'available', property: { name: 'Sunset Apartments' } },
        { _id: '3', unitNumber: 'A-12', type: 'Studio', rentPrice: 750, status: 'maintenance', property: { name: 'Urban Lofts' } },
        { _id: '4', unitNumber: 'B-05', type: '3BHK', rentPrice: 1800, status: 'occupied', property: { name: 'Green Valley Homes' } },
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
    console.log('Edit unit', unit);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Units</h1>
        <button className="btn-primary flex items-center gap-2">
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
    </div>
  );
};

export default Units;
