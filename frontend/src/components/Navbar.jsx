import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Get page title from path
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === 'dashboard') return 'Overview';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-8 flex items-center justify-between sticky top-0 z-30 h-20">
            {/* Left Side: Dynamic Breadcrumb/Title */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    <Menu size={20} />
                </button>
                <div className="hidden sm:block">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        <span>Console</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-blue-600">{getPageTitle()}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h2>
                </div>
            </div>

            {/* Right Side: Actions & Profile */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* Search Bar (Desktop) */}
                <div className="hidden md:flex items-center border border-slate-200 bg-slate-50/50 rounded-2xl px-4 py-2 w-64 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
                    <Search size={18} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 placeholder:text-slate-400 w-full ml-2 outline-none"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all duration-300 group">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-slate-100"></div>

                {/* User Profile Dropdown */}
                {user ? (
                    <div className="flex items-center gap-3 pl-2">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1.5">{user.role}</p>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="w-11 h-11 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-slate-500 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                            {/* Simple Dropdown Overlay logic can be added here if needed */}
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95"
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Navbar;
