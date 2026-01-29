import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import PublicPropertyCard from '../components/PublicPropertyCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, CheckCircle2 } from 'lucide-react';

const Listings = () => {
    const { t } = useLanguage();
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'All',
        status: 'All',
        priceRange: 'All'
    });

    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [requestType, setRequestType] = useState('booking');

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, properties]);

    const fetchProperties = async () => {
        try {
            const { data } = await axios.get('/properties');
            setProperties(data || []);
            setFilteredProperties(data || []);
        } catch (error) {
            console.error('Error fetching properties', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = properties;

        if (searchTerm) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.type !== 'All') {
            result = result.filter(p => p.type === filters.type);
        }

        if (filters.status !== 'All') {
            result = result.filter(p => p.status === filters.status);
        }

        if (filters.priceRange !== 'All') {
            const [min, max] = filters.priceRange.split('-').map(Number);
            if (max) {
                result = result.filter(p => p.price >= min && p.price <= max);
            } else {
                result = result.filter(p => p.price >= min);
            }
        }

        setFilteredProperties(result);
    };

    const handleAction = (property, type) => {
        if (!user) {
            navigate('/login', { state: { from: '/listings' } });
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
            alert('Request submitted successfully!');
            setIsRequestModalOpen(false);
        } catch (error) {
            console.error('Error submitting request', error);
            alert('Failed to submit request.');
        }
    };

    const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Office', 'Land'];
    const statuses = ['All', 'available', 'rented', 'sold'];
    const priceRanges = [
        { label: 'All', value: 'All' },
        { label: 'Under $500', value: '0-500' },
        { label: '$500 - $1,500', value: '500-1500' },
        { label: '$1,500 - $5,000', value: '1500-5000' },
        { label: '$5,000+', value: '5000' }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <PublicNavbar />

            {/* Header / Search Section */}
            <section className="bg-slate-900 pt-40 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('listingsHeader')}</h1>
                        <p className="text-xl text-slate-400">{t('listingsSub')}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                className="w-full bg-slate-50 py-4 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 border border-transparent transition-all"
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:w-3/5">
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full bg-slate-50 py-4 pl-10 pr-10 rounded-2xl outline-none appearance-none border border-transparent font-medium text-slate-700"
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    {propertyTypes.map(t_type => <option key={t_type} value={t_type}>{t_type === 'All' ? t('allTypes') : t_type}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            <div className="relative">
                                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full bg-slate-50 py-4 pl-10 pr-10 rounded-2xl outline-none appearance-none border border-transparent font-medium text-slate-700"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    {statuses.map(s => <option key={s} value={s}>{s === 'All' ? t('allStatuses') : s.toUpperCase()}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                            <div className="relative">
                                <DollarSignIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full bg-slate-50 py-4 pl-10 pr-10 rounded-2xl outline-none appearance-none border border-transparent font-medium text-slate-700"
                                    value={filters.priceRange}
                                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                                >
                                    {priceRanges.map(p => <option key={p.value} value={p.value}>{p.label === 'All' ? t('allTypes').split(' ')[0] : p.label}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20 pb-40">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                    <p className="text-slate-500 font-medium">
                        {t('foundCount', { count: filteredProperties.length })}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-40">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest">Waa la soo raryaa...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-40 bg-white rounded-3xl border border-dashed border-slate-300">
                        <Search size={64} className="text-slate-200 mx-auto mb-6" />
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{t('notFoundTitle')}</h3>
                        <p className="text-slate-500 mb-8">{t('notFoundDesc')}</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilters({ type: 'All', status: 'All', priceRange: 'All' }); }}
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
                        >
                            {t('resetSearch')}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredProperties.map(property => (
                            <PublicPropertyCard
                                key={property._id}
                                property={property}
                                onBook={(p) => handleAction(p, 'booking')}
                                onBuy={(p) => handleAction(p, 'purchase')}
                            />
                        ))}
                    </div>
                )}
            </section>

            <RequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleRequestSubmit}
                property={selectedProperty}
                type={requestType}
            />

            <PublicFooter />
        </div>
    );
};

const DollarSignIcon = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

export default Listings;
