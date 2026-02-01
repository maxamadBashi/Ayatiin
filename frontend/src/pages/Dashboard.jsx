import React, { useEffect, useState, useMemo } from 'react';
import {
  Building2, Users, DoorOpen, Wrench, MessageSquare,
  Ban, Trash2, ArrowRight, DollarSign, CreditCard,
  TrendingUp, Shield, Plus, MoreHorizontal, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    totalIncome: 0,
    totalExpenses: 0,
    monthlyProfit: 0
  });

  const [revenueData, setRevenueData] = useState([
    { name: 'Jan', revenue: 4200 },
    { name: 'Feb', revenue: 3800 },
    { name: 'Mar', revenue: 5400 },
    { name: 'Apr', revenue: 4900 },
    { name: 'May', revenue: 6200 },
    { name: 'Jun', revenue: 5800 },
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
      console.log('Using dummy data for dashboard');
      setStats({
        totalProperties: 12,
        availableProperties: 5,
        rentedProperties: 5,
        soldProperties: 2,
        totalTenants: 45,
        totalCustomers: 100,
        totalUnits: 50,
        occupiedUnits: 45,
        availableUnits: 5,
        maintenanceRequests: 3,
        customerRequests: 2,
        totalIncome: 12500,
        totalExpenses: 4200,
        monthlyProfit: 8300
      });
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
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm('Are you sure you want to block/unblock this user?')) return;
    try {
      await axios.patch(`/auth/admin/users/${userId}/block`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`/auth/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const StatCard = ({ title, value, icon, gradient, trend }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="mt-6 relative z-10">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* --- HERO SECTION --- */}
      <div className="relative rounded-[40px] overflow-hidden bg-slate-900 px-10 py-12 text-white shadow-2xl">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-300 mb-4">
              <Shield size={12} />
              <span>System Status: Optimal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              {timeGreeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.name}</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              Here's what's happening across your property portfolio today. You have <span className="text-white font-bold">{stats.customerRequests} pending requests</span> to review.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateAdmin(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN KPI'S --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Gross Revenue"
          value={`$${stats?.totalIncome?.toLocaleString() || 0}`}
          icon={<DollarSign size={24} />}
          gradient="from-blue-600 to-blue-400"
          trend="+12.5%"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats?.monthlyProfit?.toLocaleString() || 0}`}
          icon={<CreditCard size={24} />}
          gradient="from-emerald-600 to-emerald-400"
          trend="+8.2%"
        />
        <StatCard
          title="Active Tenants"
          value={stats.totalTenants}
          icon={<Users size={24} />}
          gradient="from-indigo-600 to-indigo-400"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenanceRequests}
          icon={<Wrench size={24} />}
          gradient="from-red-600 to-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- ANALYTICS CHART --- */}
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Performance</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Earnings analytics (Last 6 Months)</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Monthly Sales
              </span>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{
                    fontWeight: 800,
                    color: '#1e293b'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- QUICK ACTION / STATUS --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 h-full">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Inventory Summary</h3>
            <div className="space-y-6">
              {[
                { label: 'Apartment Units', val: stats.totalUnits, sub: `${stats.occupiedUnits} Occupied`, icon: <Building2 />, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Available Units', val: stats.availableUnits, sub: 'Ready to lease', icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Maintenance', val: stats.maintenanceRequests, sub: 'Required fix', icon: <Wrench />, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'User Requests', val: stats.customerRequests, sub: 'Needs review', icon: <MessageSquare />, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                    {React.cloneElement(item.icon, { size: 24 })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                  </div>
                  <div className="text-2xl font-black text-slate-800">{item.val}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-black rounded-2xl transition-all flex items-center justify-center gap-2 group">
              <span>Detailed Portfolio</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* --- USER MANAGEMENT TABLE --- */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">User Directory</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage system access & roles</p>
          </div>
        </div>

        <div className="overflow-x-auto px-6 pb-6 mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:scale-110 transition-transform">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-none">{u.name}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === user._id || (u.role === 'superadmin' && user.role !== 'superadmin')}
                        className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none"
                      >
                        <option value="customer">Customer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">System Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${u.isBlocked
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                      {u.isBlocked ? 'Access Restricted' : 'Active Account'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end items-center gap-2">
                      {(user.role === 'admin' || user.role === 'manager' || user.role === 'superadmin') && u.role !== 'superadmin' && (
                        <button
                          onClick={() => handleBlockUser(u._id)}
                          className={`p-2.5 rounded-xl transition-all ${u.isBlocked ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}
                          title={u.isBlocked ? "Unblock User" : "Block User"}
                        >
                          <Ban size={18} />
                        </button>
                      )}
                      {user.role === 'superadmin' && u.role !== 'superadmin' && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2.5 rounded-xl text-slate-400 bg-slate-50 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
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
