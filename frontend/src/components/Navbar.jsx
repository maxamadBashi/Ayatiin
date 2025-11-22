import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Smart Choice Management System
            </h2>

            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'Staff'}</p>
                </div>
                <UserCircle size={32} className="text-gray-400" />
            </div>
        </header>
    );
};

export default Navbar;
