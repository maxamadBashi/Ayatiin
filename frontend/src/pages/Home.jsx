import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import PublicPropertyCard from '../components/PublicPropertyCard';
import RequestModal from '../components/RequestModal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, CreditCard, Zap, ArrowRight, Star, Users, MapPin, Sparkles, Globe } from 'lucide-react';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [requestType, setRequestType] = useState('booking');
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data } = await axios.get('/properties');
            // Show only first 6 as featured
            setProperties(data?.slice(0, 6) || []);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (property, type) => {
        if (!user) {
            navigate('/login', { state: { from: '/' } });
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
            alert('✅ Request submitted successfully!');
            setIsRequestModalOpen(false);
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('❌ Failed to submit request.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* --- HERO SECTION --- */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
                {/* Background Video/Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600585154340-be6199f7d009?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        className="w-full h-full object-cover opacity-40 scale-105"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 bg-blue-600/20 backdrop-blur-md rounded-full border border-blue-500/30 text-blue-400 font-bold text-sm tracking-widest uppercase animate-fade-in">
                        <Star size={16} fill="currentColor" />
                        <span>{t('heroTag')}</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        {t('heroTitle1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{t('heroTitle2')}</span> <br />
                        {t('heroTitle3')}
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        {t('heroDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/listings"
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <span>{t('viewProperties')}</span>
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <span>{t('contactUs')}</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Bar Overlay */}
                <div className="absolute bottom-0 left-0 w-full bg-white/5 backdrop-blur-lg border-t border-white/10 py-6 hidden lg:block">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 gap-4 text-center">
                        {[
                            { label: t('statUnits'), val: '1,200+' },
                            { label: t('statClients'), val: '8,500+' },
                            { label: t('statLocations'), val: '15' },
                            { label: t('statSatisfaction'), val: '99%' }
                        ].map((stat, i) => (
                            <div key={i} className="border-r border-white/10 last:border-none">
                                <p className="text-2xl font-black text-white">{stat.val}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FEATURED PROPERTIES --- */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl px-1 md:px-0">
                            <h2 className="text-3xl font-bold text-blue-600 mb-2 uppercase tracking-widest">{t('featuredTitle')}</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('featuredSub')}</h3>
                        </div>
                        <Link to="/listings" className="group flex items-center gap-2 text-blue-600 font-extrabold text-lg hover:text-blue-700 transition-colors">
                            <span>{t('viewAll')}</span>
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white p-4 rounded-3xl animate-pulse h-[400px]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {properties.map(property => (
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
            </section>

            {/* --- WHY CHOOSE US --- */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 blur-3xl rounded-full"></div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-black text-slate-900 mb-20 tracking-tight">{t('whyTitle')}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Shield,
                                title: t('shieldTitle'),
                                desc: t('shieldDesc'),
                                color: 'text-blue-600',
                                bg: 'bg-blue-50'
                            },
                            {
                                icon: CreditCard,
                                title: t('priceTitle'),
                                desc: t('priceDesc'),
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50'
                            },
                            {
                                icon: Zap,
                                title: t('speedTitle'),
                                desc: t('speedDesc'),
                                color: 'text-orange-600',
                                bg: 'bg-orange-50'
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 bg-slate-50 rounded-3xl border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-2xl transition-all duration-500">
                                <div className={`w-20 h-20 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                    <feature.icon size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto relative rounded-[40px] overflow-hidden bg-slate-900 p-12 md:p-24 text-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                            className="w-full h-full object-cover opacity-20"
                            alt="CTA"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 to-indigo-600/40"></div>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            {t('ctaTitle')}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/contact"
                                className="px-12 py-5 bg-white text-blue-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-lg"
                            >
                                {t('getStarted')}
                            </Link>
                            <Link
                                to="/register"
                                className="px-12 py-5 bg-transparent border-2 border-white text-white font-black rounded-2xl hover:bg-white/10 transition-all text-lg"
                            >
                                {t('createAccount')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />

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
