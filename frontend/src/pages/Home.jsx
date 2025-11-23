import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import PublicPropertyCard from '../components/PublicPropertyCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import RequestModal from '../components/RequestModal'; // We might need to create/update this

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
            const { data } = await axios.get('/properties');
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
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
            alert('Request submitted successfully! Admin will review it.');
            setIsRequestModalOpen(false);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('Failed to submit request.');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[#F6F6F4] py-20 lg:py-32">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#E2E666] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E899DC] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-[#99E8DB] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-8 text-[#241c15]">
                        Find your home.<br />
                        Live your life.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Aayatiin Property is the world's leading real estate platform. It's like a
                        <span className="font-semibold text-teal-600"> second home</span> that helps millions of customers—from small apartments to big villas—find their dream place, engage their future, and build their life.
                    </p>
                    <button
                        onClick={() => document.getElementById('properties-section').scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-[#007C89] text-white font-bold text-lg rounded-full hover:bg-[#006A75] transition-transform hover:scale-105 shadow-lg"
                    >
                        Browse Properties
                    </button>
                </div>
            </div>

            {/* Properties Grid */}
            <div id="properties-section" className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-medium text-[#241c15] mb-4">Featured Properties</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our hand-picked selection of premium properties available for rent and purchase.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading properties...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties.map((property) => (
                            <PublicPropertyCard
                                key={property._id}
                                property={property}
                                onBook={(p) => handleAction(p, 'booking')}
                                onBuy={(p) => handleAction(p, 'purchase')}
                            />
                        ))}
                    </div>
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
