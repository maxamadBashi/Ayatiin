import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from '../utils/axios';
import PublicPropertyCard from '../components/PublicPropertyCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import RequestModal from '../components/RequestModal';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [requestType, setRequestType] = useState('booking'); // 'booking' or 'purchase'
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        fetchProperties();

        // Check if we returned from login with a pending action
        if (location.state?.pendingAction && user) {
            const { property, type } = location.state.pendingAction;
            setSelectedProperty(property);
            setRequestType(type);
            setIsRequestModalOpen(true);
            // Clear state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [user, location]);

    const fetchProperties = async () => {
        try {
            // Fetch ALL properties - no filtering
            const { data } = await axios.get('/properties');
            // Show all properties regardless of status or type
            setProperties(data || []);
        } catch (error) {
            console.error('Error fetching properties:', error);
            // Even if error, set empty array so page doesn't break
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (property, type) => {
        if (!user) {
            // Redirect to login with state to return here
            navigate('/login', {
                state: {
                    from: '/',
                    pendingAction: { property, type }
                }
            });
            return;
        }
        setSelectedProperty(property);
        setRequestType(type);
        setIsRequestModalOpen(true);
    };

    const handleRequestSubmit = async (formData) => {
        try {
            await axios.post('/requests', {
                ...formData,
                property: selectedProperty._id,
                type: requestType
            });
            
            // Show success message
            const successMessage = `✅ Request submitted successfully!\n\nYour ${requestType} request for "${selectedProperty?.name}" has been sent to the admin.\n\nYou can track the status in "My Requests" page.`;
            alert(successMessage);
            
            setIsRequestModalOpen(false);
            setSelectedProperty(null);
            
            // Optionally refresh properties or show a toast notification
        } catch (error) {
            console.error('Error submitting request:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit request. Please try again.';
            alert(`❌ Error: ${errorMessage}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
            {/* Hero Section with Gradient */}
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
                    <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        🏠 Your Dream Home Awaits
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        WELCOME TO AAYATIIN
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        PROPERTY LTD SMART in Somalia, Mogadishu & Hargeisa
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => document.getElementById('properties-section').scrollIntoView({ behavior: 'smooth' })}
                            className="group px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                        >
                            <span>Explore Properties</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <Link
                            to={user ? "/customer/dashboard" : "/register"}
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                        >
                            {user ? "My Requests" : "Get Started"}
                        </Link>
                    </div>
                </div>
            </div>

            <Navbar />

            {/* Main Content */}
            <div id="properties-section" className="max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        ✨ Premium Properties
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Property</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Browse our curated selection of properties in Mogadishu and Hargeisa for rent or purchase
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                        <p className="mt-6 text-gray-600 text-lg font-medium">Loading amazing properties...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
                            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Available</h3>
                        <p className="text-gray-600">Check back soon for new listings!</p>
                    </div>
                ) : (
                    <>
                        {/* Show count of properties */}
                        <div className="mb-6 text-center">
                            <p className="text-gray-600">
                                Showing <span className="font-bold text-blue-600">{properties.length}</span> {properties.length === 1 ? 'property' : 'properties'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <PublicPropertyCard
                                    key={property._id}
                                    property={property}
                                    onBook={(p) => handleAction(p, 'booking')}
                                    onBuy={(p) => handleAction(p, 'purchase')}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Request Modal */}
            <RequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleRequestSubmit}
                property={selectedProperty}
                type={requestType}
            />
        </div>
    );
};

export default Home;
