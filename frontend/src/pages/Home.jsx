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
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Top Blue Banner */}
            <div className="bg-[#1e3a8a] text-white py-12 text-center px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Aayatiin</h2>
                <p className="text-blue-100 mb-6">Explore Properties in Somalia, Mogadishu</p>
                <button
                    onClick={() => document.getElementById('properties-section').scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-2 bg-white text-[#1e3a8a] font-bold rounded-md hover:bg-gray-100 transition-colors"
                >
                    Explore
                </button>
            </div>

            <Navbar />

            {/* Main Content */}
            <div id="properties-section" className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#0f172a] mb-3">Find Your Dream Property</h1>
                    <p className="text-gray-500 text-lg">
                        Browse properties in Mogadishu and Hargeisa for rent or purchase
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading properties...</p>
                    </div>
                ) : (
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
