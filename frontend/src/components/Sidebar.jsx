import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    DoorOpen,
    Users,
    FileText,
    CreditCard,
    Wrench,
    LogOut,
    MessageSquare,
    MapPin,
    DollarSign,
    Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800';
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/properties', icon: <Building2 size={20} />, label: 'Properties' },
        // Units & Tenants ku dar sidebar-ka
        { path: '/units', icon: <DoorOpen size={20} />, label: 'Units' },
        { path: '/tenants', icon: <Users size={20} />, label: 'Tenants' },
        { path: '/leases', icon: <FileText size={20} />, label: 'Leases' },
        { path: '/guarantors', icon: <Shield size={20} />, label: 'Guarantors' },
        { path: '/payments', icon: <CreditCard size={20} />, label: 'Payments' },
        { path: '/requests', icon: <MessageSquare size={20} />, label: 'Requests' },
        { path: '/maintenance', icon: <Wrench size={20} />, label: 'Maintenance' },
        { path: '/expenses', icon: <DollarSign size={20} />, label: 'Expenses' },
    ];

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-blue-400">AAYATIIN</h1>
                <p className="text-xs text-gray-400 mt-1">PROPERTY LTD</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path)}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
