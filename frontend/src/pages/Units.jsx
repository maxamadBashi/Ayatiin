import React, { useState, useEffect } from 'react';
import UnitCard from '../components/UnitCard';
import UnitModal from '../components/UnitModal';
import axios from '../utils/axios';
import { Plus, LayoutGrid, Sparkles, Home } from 'lucide-react';

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
      // Augment units with full property objects
      const augmentedUnits = unitsRes.data.map(unit => ({
        ...unit,
        property: propertiesRes.data.find(p => (p._id || p.id) === unit.propertyId)
      }));

      setUnits(augmentedUnits);
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

  const [deleteMessage, setDeleteMessage] = useState({ type: '', text: '' });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await axios.delete(`/units/${id}`);
        setUnits(units.filter(u => u._id !== id));
        setDeleteMessage({ type: 'success', text: 'Unit deleted successfully' });
        setTimeout(() => setDeleteMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error deleting unit', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete unit. It might be occupied or in maintenance.';
        setDeleteMessage({ type: 'error', text: errorMessage });
        setTimeout(() => setDeleteMessage({ type: '', text: '' }), 5000);
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
        const updatedUnit = { ...data, property: properties.find(p => p._id === formData.property) };
        setUnits(units.map(u => u._id === currentUnit._id ? updatedUnit : u));
      } else {
        const { data } = await axios.post('/units', formData);
        // After creating/updating, re-fetch all data to ensure property names are populated
        await fetchData();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving unit', error);
      const errorMessage = error.response?.data?.message || 'Failed to save unit';
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 bg-slate-100 rounded-3xl p-8">
      {deleteMessage.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border ${
          deleteMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="font-bold">{deleteMessage.type === 'success' ? '✓' : '✗'}</span>
            <span>{deleteMessage.text}</span>
          </div>
        </div>
      )}
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-lg border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <LayoutGrid size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">Inventory</span>
              <Sparkles size={12} className="text-amber-400" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Units</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Managing {units.length} Individual Spaces</p>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 group"
        >
          <div className="p-1.5 bg-white/10 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus size={18} />
          </div>
          <span>New Unit</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Inventory syncing...</p>
        </div>
      ) : units.length === 0 ? (
        <div className="bg-slate-50 rounded-[40px] p-20 text-center border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Home size={40} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">No units registered</h3>
          <p className="text-slate-400 font-medium mb-8 max-w-sm mx-auto">Create individual units or rooms within your properties to start managing rentals.</p>
          <button
            onClick={handleAdd}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Add Unit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
