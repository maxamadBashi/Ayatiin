import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
            {/* Left Side - Logo and My Requests (when logged in) */}
            <div className="flex items-center gap-6">
                <Link to="/" className="group flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                        AAYATIIN
                    </span>
                </Link>
                {user && (user.role === 'customer' || user.role === 'tenant') && (
                    <Link
                        to="/customer/dashboard"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                    >
                        <User size={18} />
                        <span>My Requests</span>
                    </Link>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        {user.role !== 'customer' && user.role !== 'tenant' && (
                            <Link
                                to="/admin/dashboard"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Login
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
