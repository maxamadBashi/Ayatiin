import React, { useEffect, useState } from 'react';
import { Building2, Users, DoorOpen, Wrench } from 'lucide-react';
import axios from '../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    availableUnits: 0,
    maintenanceRequests: 0,
  });

  useEffect(() => {
    // Fetch stats from backend or use dummy data if backend not ready
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.log('Using dummy data for dashboard');
        setStats({
          totalProperties: 12,
          totalTenants: 45,
          totalUnits: 50,
          occupiedUnits: 45,
          availableUnits: 5,
          maintenanceRequests: 3,
        });
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="card flex items-center p-6">
      <div className={`p-4 rounded-full mr-4 ${color} bg-opacity-20`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Properties" 
          value={stats.totalProperties} 
          icon={<Building2 size={24} className="text-blue-600" />} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Total Tenants" 
          value={stats.totalTenants} 
          icon={<Users size={24} className="text-green-600" />} 
          color="bg-green-600" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${Math.round((stats.occupiedUnits / (stats.totalUnits || 1)) * 100)}%`} 
          icon={<DoorOpen size={24} className="text-purple-600" />} 
          color="bg-purple-600" 
        />
        <StatCard 
          title="Pending Maintenance" 
          value={stats.maintenanceRequests} 
          icon={<Wrench size={24} className="text-orange-600" />} 
          color="bg-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">Rent Payment Received</p>
                  <p className="text-sm text-gray-500">Unit 10{i} - John Doe</p>
                </div>
                <span className="text-sm text-green-600 font-medium">+$1,200</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Occupancy Status</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.availableUnits}</p>
              <p className="text-gray-500">Units Available</p>
            </div>
            <div className="w-px h-16 bg-gray-200 mx-8"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.occupiedUnits}</p>
              <p className="text-gray-500">Units Occupied</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
