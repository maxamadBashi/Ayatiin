import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        logout();
    };

    return (
        <header className="bg-white shadow-sm py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
            {/* Left Side - Logo and My Requests (when logged in) */}
            <div className="flex items-center gap-6">
                <Link to="/" className="text-2xl font-bold text-[#1e3a8a] tracking-tight">
                    AAYATIIN
                </Link>
                {user && (user.role === 'customer' || user.role === 'tenant') && (
                    <Link
                        to="/customer/dashboard"
                        className="px-6 py-2 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-blue-900 transition-colors"
                    >
                        My Requests
                    </Link>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {user.role !== 'customer' && user.role !== 'tenant' && (
                            <Link
                                to="/admin/dashboard"
                                className="px-6 py-2 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-blue-900 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/register"
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                        >
                            Register
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-[#1e3a8a] text-white font-medium rounded-md hover:bg-blue-900 transition-colors"
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
