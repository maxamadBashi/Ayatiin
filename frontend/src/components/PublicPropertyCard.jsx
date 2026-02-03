import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Bed, Bath, Square, Home, Sparkles, ArrowRight } from 'lucide-react';

const PublicPropertyCard = ({ property, onBook, onBuy }) => {
    const { t } = useLanguage();

    const statusColors = {
        available: 'bg-green-500 text-white',
        rented: 'bg-blue-500 text-white',
        sold: 'bg-gray-500 text-white'
    };

    return (
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
            {/* Image Section with Overlay */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.images && property.images.length > 0
                        ? (property.images[0].startsWith('http')
                            ? property.images[0]
                            : `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${property.images[0].startsWith('/') ? '' : '/'}${property.images[0]}`)
                        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 ${statusColors[property.status] || 'bg-blue-600 text-white'} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm`}>
                    {property.status}
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow-md">
                    {property.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {property.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin size={14} className="text-blue-600" />
                        <span className="line-clamp-1">{property.location || t('locationNotFixed')}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{property.description || t('bestProperty')}</p>
                </div>

                {/* Price Section - Always Visible */}
                <div className="mb-5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            {property.price ? `$${property.price.toLocaleString()}` : t('onContact')}
                        </span>
                        {(property.type === 'Apartment' || property.type === 'House' || property.type === 'Villa') && property.price ? (
                            <span className="text-sm text-gray-600">/{t('month')}</span>
                        ) : property.price ? (
                            <span className="text-sm text-gray-600">{t('total')}</span>
                        ) : null}
                    </div>
                </div>

                {/* Amenities/Details */}
                <div className="flex items-center justify-between py-4 border-t border-gray-100 text-gray-600 text-sm mb-5">
                    {property.type && property.type.includes('Land') ? (
                        <>
                            <div className="flex items-center gap-2">
                                <Square size={18} className="text-blue-600" />
                                <span className="font-medium">{property.size || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-blue-600" />
                                <span className="font-medium">{property.dimensions || 'N/A'}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Bed size={18} className="text-blue-600" />
                                <span className="font-semibold">{property.bedrooms || 0}</span>
                                <span className="text-gray-500">{t('beds')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath size={18} className="text-blue-600" />
                                <span className="font-semibold">{property.bathrooms || 0}</span>
                                <span className="text-gray-500">{t('baths')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Square size={18} className="text-blue-600" />
                                <span className="font-semibold">{property.size || property.area || 1200}</span>
                                <span className="text-gray-500">sq.ft</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onBook(property)}
                        className="group/btn flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} />
                        <span>{t('bookNow')}</span>
                    </button>
                    <button
                        onClick={() => onBuy(property)}
                        className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold text-sm hover:border-blue-700 hover:text-blue-700 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span>{t('buyNow')}</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicPropertyCard;
