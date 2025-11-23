import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white py-5 px-8 flex items-center justify-between sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-black">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">AAYATIIN</span>
            </Link>

            {/* Center Links */}
            <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Features</Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Pricing</Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Support</Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Learning</Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Blog</Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        {user.role === 'customer' || user.role === 'tenant' ? (
                            <Link to="/customer/dashboard" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                                My Requests
                            </Link>
                        ) : (
                            <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm"
                        >
                            Log Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-900 hover:text-gray-600 font-bold text-sm">
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="hidden lg:block px-5 py-2.5 bg-[#FFE01B] text-gray-900 font-bold text-sm rounded-full hover:bg-yellow-400 transition-colors"
                        >
                            Sign Up Free
                        </Link>
                    </>
                )}
                <button className="text-gray-900">
                    <Search size={20} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
