import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Phone, Mail, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { lang, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('properties'), path: '/listings' },
        { name: t('about'), path: '/about' },
        { name: t('contact'), path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="group flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' : 'text-white'
                        }`}>
                        AAYATIIN
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'
                                }`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
                        </Link>
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all text-sm uppercase ${isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                    >
                        <Globe size={18} />
                        <span>{lang === 'en' ? 'SO' : 'EN'}</span>
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to={user.role === 'customer' || user.role === 'tenant' ? "/customer/dashboard" : "/admin/dashboard"}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 ${isScrolled
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30'
                                    }`}
                            >
                                <User size={18} />
                                <span>{user.role === 'customer' ? t('myAccount') : t('dashboard')}</span>
                            </Link>
                            <button
                                title={t('logout')}
                                onClick={handleLogout}
                                className={`p-2.5 rounded-xl transition-all duration-300 border ${isScrolled
                                    ? 'border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-100'
                                    : 'border-white/30 text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className={`px-6 py-2.5 font-bold transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                            >
                                {t('login')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                            >
                                {t('register')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`lg:hidden p-2 rounded-xl border transition-all ${isScrolled ? 'border-gray-200 text-gray-600' : 'border-white/30 text-white'
                        }`}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-blue-900/98 backdrop-blur-xl z-[60] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-between items-center mb-12">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">A</span>
                            </div>
                            <span className="text-2xl font-extrabold text-white tracking-tight">AAYATIIN</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 p-2 bg-white/10 rounded-xl text-white font-bold"
                            >
                                <Globe size={20} />
                                <span>{lang === 'en' ? 'SO' : 'EN'}</span>
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-xl text-white">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mb-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-3xl font-bold transition-all ${isActive(link.path) ? 'text-blue-400 translate-x-4' : 'text-white hover:text-blue-400'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'customer' || user.role === 'tenant' ? "/customer/dashboard" : "/admin/dashboard"}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-blue-900 font-bold rounded-xl shadow-xl"
                                >
                                    <User size={20} />
                                    <span>{user.role === 'customer' ? t('myAccount') : t('dashboard')}</span>
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="w-full py-4 border-2 border-white/20 text-white font-bold rounded-xl"
                                >
                                    {t('logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full block text-center py-4 bg-white/10 border-2 border-white/20 text-white font-bold rounded-xl"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full block text-center py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold rounded-xl shadow-xl"
                                >
                                    {t('register')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
