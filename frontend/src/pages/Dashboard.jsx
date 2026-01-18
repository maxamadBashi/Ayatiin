import React, { useEffect, useState } from 'react';
import { Building2, Users, DoorOpen, Wrench, MessageSquare, Ban, Trash2, ArrowRight, DollarSign, CreditCard, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import CreateAdminModal from '../components/CreateAdminModal';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    soldProperties: 0,
    totalTenants: 0,
    totalCustomers: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    availableUnits: 0,
    maintenanceRequests: 0,
    customerRequests: 0,
    landProperties: 0,
  });

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
  ]);

  const [users, setUsers] = useState([]);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/auth/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await axios.patch(`/auth/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      alert('Role updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm('Are you sure you want to block/unblock this user?')) return;
    try {
      await axios.patch(`/auth/admin/users/${userId}/block`);
      fetchUsers();
      alert('User status updated');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`/auth/admin/users/${userId}`);
      fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
      <div className={`p-4 rounded-full mr-4 ${color} bg-opacity-10`}>
        {React.cloneElement(icon, { className: `text-${color.replace('bg-', '')}` })}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
    </div>
  );

  console.log('Dashboard Render Check:', { MapPin: typeof MapPin !== 'undefined' ? 'Defined' : 'Undefined', Building2, Users });
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Export Report</button>
          {(user?.role === 'superadmin' || user?.role === 'manager' || user?.role === 'admin') && (
            <button
              onClick={() => setShowCreateAdmin(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Create Admin User
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/properties" className="block">
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<Building2 size={24} />}
            color="bg-blue-600"
          />
        </Link>
        <Link to="/land" className="block">
          <StatCard
            title="Total Land"
            value={stats.landProperties}
            icon={typeof MapPin !== 'undefined' ? <MapPin size={24} /> : <Building2 size={24} />}
            color="bg-emerald-600"
          />
        </Link>
        <Link to="/units" className="block">
          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            icon={<DoorOpen size={24} />}
            color="bg-indigo-600"
          />
        </Link>
        <Link to="/tenants" className="block">
          <StatCard
            title="Total Tenants"
            value={stats.totalTenants}
            icon={<Users size={24} />}
            color="bg-purple-600"
          />
        </Link>
        <Link to="/maintenance" className="block">
          <StatCard
            title="Maintenance Pending"
            value={stats.maintenanceRequests}
            icon={<Wrench size={24} />}
            color="bg-red-600"
          />
        </Link>
        <Link to="/payments" className="block">
          <StatCard
            title="Total Income"
            value={`$${stats?.totalIncome?.toLocaleString() || 0}`}
            icon={<DollarSign size={24} />}
            color="bg-blue-600"
          />
        </Link>
        <Link to="/expenses" className="block">
          <StatCard
            title="Total Expenses"
            value={`$${stats?.totalExpenses?.toLocaleString() || 0}`}
            icon={<DollarSign size={24} />}
            color="bg-red-600"
          />
        </Link>
        <Link to="/admin/dashboard" className="block">
          <StatCard
            title="Monthly Profit"
            value={`$${stats?.monthlyProfit?.toLocaleString() || 0}`}
            icon={<CreditCard size={24} />}
            color="bg-emerald-600"
          />
        </Link>
        <Link to="/requests" className="block">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="p-4 rounded-full mr-4 bg-yellow-600 bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
              <MessageSquare size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
              <div className="flex items-center justify-between mt-1">
                <h3 className="text-2xl font-bold text-gray-800">{stats.customerRequests}</h3>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-yellow-600 transition-colors" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Click to view booking/purchase requests</p>
            </div>
          </div>
        </Link>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'manager' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === user._id || (u.role === 'superadmin' && user.role !== 'superadmin')}
                      className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>

                    {(user.role === 'admin' || user.role === 'manager' || user.role === 'superadmin') && u.role !== 'superadmin' && (
                      <button
                        onClick={() => handleBlockUser(u._id)}
                        className={`p-1 rounded hover:bg-gray-100 ${u.isBlocked ? 'text-green-600' : 'text-red-600'}`}
                        title={u.isBlocked ? "Unblock User" : "Block User"}
                      >
                        <Ban size={18} />
                      </button>
                    )}

                    {user.role === 'superadmin' && u.role !== 'superadmin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1 rounded hover:bg-gray-100 text-red-600"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateAdminModal
        isOpen={showCreateAdmin}
        onClose={() => setShowCreateAdmin(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default Dashboard;
