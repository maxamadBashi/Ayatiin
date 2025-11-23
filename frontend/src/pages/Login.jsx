import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            // Redirect based on role or previous location
            if (location.state?.from) {
                navigate(location.state.from);
            } else {
                const role = result.user.role;
                if (role === 'customer' || role === 'tenant') {
                    navigate('/');
                } else {
                    navigate('/admin/dashboard');
                }
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#1e3a8a] items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                    alt="Luxury Home"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 text-white px-12 text-center">
                    <h2 className="text-4xl font-bold mb-6">Welcome Back to Aayatiin</h2>
                    <p className="text-lg text-blue-100">Sign in to continue your journey to finding the perfect property.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                        <p className="mt-2 text-gray-600">Please enter your details to access your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-sm text-[#1e3a8a] hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#1e3a8a] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl">
                            Sign In
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-[#1e3a8a] hover:underline">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
