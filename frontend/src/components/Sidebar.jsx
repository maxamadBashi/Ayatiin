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
    Shield,
    DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/properties', icon: <Building2 size={20} />, label: 'Properties' },
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
        <div className="bg-slate-900 text-slate-300 w-64 min-h-screen flex flex-col border-r border-slate-800 shadow-2xl z-40">
            {/* Branding */}
            <div className="p-8 border-b border-slate-800/50">
                <div className="flex items-center gap-3 group px-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-black text-xl">A</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">AAYATIIN</h1>
                        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-1 group-hover:text-blue-400 transition-colors uppercase">Real Estate</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-2">Menu Navigation</p>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive(item.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                            {item.icon}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        {isActive(item.path) && (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-l-full"></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer / Account */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-4 w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group border border-transparent hover:border-red-500/20"
                >
                    <div className="group-hover:rotate-12 transition-transform duration-300">
                        <LogOut size={20} />
                    </div>
                    <span className="font-bold text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
