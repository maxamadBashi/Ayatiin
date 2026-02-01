import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, User, Layout, Info, Image, Plus, Check } from 'lucide-react';

const PropertyModal = ({ isOpen, onClose, onSubmit, property, isLand }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: isLand ? 'Land' : 'Apartment',
        address: '',
        city: '',
        ownerName: '',
        location: '',
        description: '',
        status: 'available',
    });
    const [images, setImages] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name || '',
                type: property.type || 'Apartment',
                address: property.address || '',
                city: property.city || '',
                ownerName: property.ownerName || '',
                location: property.location || '',
                description: property.description || '',
                status: property.status || 'available',
            });
            setImages([]);
        } else {
            setFormData({
                name: '',
                type: isLand ? 'Land' : 'Apartment',
                address: '',
                city: '',
                ownerName: '',
                location: '',
                description: '',
                status: 'available',
            });
            setImages([]);
        }
    }, [property, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('type', formData.type);
        data.append('address', formData.address);
        data.append('city', formData.city);
        data.append('ownerName', formData.ownerName);
        data.append('location', formData.location || formData.address);
        data.append('description', formData.description);
        data.append('status', formData.status);

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {property ? 'Edit Property' : (isLand ? 'Add New Land' : 'Add New Property')}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Please fill in the fields marked with (*)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 1: Aasaaska */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <Building2 size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">General Information</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        {isLand ? 'Land Name' : 'Property Name'} *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tusaale: Villa Ayatiin"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Type *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            {isLand ? (
                                                <>
                                                    <option value="Land">Land</option>
                                                    <option value="Land for Sale">Land for Sale</option>
                                                    <option value="Commercial Land">Commercial Land</option>
                                                    <option value="Residential Land">Residential Land</option>
                                                    <option value="Farm Land">Farm Land</option>
                                                    <option value="Investment Land">Investment Land</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Apartment">Apartment</option>
                                                    <option value="House">House</option>
                                                    <option value="Villa">Villa</option>
                                                    <option value="Commercial">Commercial</option>
                                                </>
                                            )}
                                        </select>
                                        <Layout size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Owner Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            placeholder="Enter owner name"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Goobta & Xaaladda */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-2 border-b border-blue-100 pb-2">
                                    <MapPin size={18} className="text-blue-600" />
                                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Location & Status</h3>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="Mogadishu, Hargeisa, etc."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="District, street, etc."
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                        />
                                        <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 focus-within:transform focus-within:translate-x-1 transition-transform duration-200">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        Status
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                                        >
                                            <option value="available">Available</option>
                                            <option value="rented">Rented</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                        <Check size={18} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Images */}
                        <div className="mt-10 space-y-8">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Info size={18} className="text-blue-600" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Provide additional details..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Image size={18} className="text-blue-600" />
                                    {isLand ? 'Land Images' : 'Property Images'}
                                </label>
                                <div
                                    className={`relative mt-1 flex justify-center px-8 py-10 border-2 border-dashed rounded-2xl transition-all duration-300 ${images.length > 0 ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="space-y-2 text-center">
                                        <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center transition-colors duration-300 ${images.length > 0 ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm'
                                            }`}>
                                            <Image size={32} />
                                        </div>
                                        <div className="flex flex-col text-sm text-slate-600">
                                            <label className="relative cursor-pointer font-bold text-blue-600 hover:text-blue-700 focus-within:outline-none transition-colors">
                                                <span>Upload images</span>
                                                <input type="file" multiple onChange={handleImageChange} className="sr-only" />
                                            </label>
                                            <p className="text-slate-400">or drag and drop</p>
                                        </div>
                                        {images.length > 0 && (
                                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-block animate-bounce shadow-md">
                                                {images.length} Image(s) selected
                                            </div>
                                        )}
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-2">PNG, JPG, GIF (Max 10MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white/80 backdrop-blur-md px-8 py-6 border-t border-slate-100 flex justify-end gap-4 z-20">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all duration-200 active:scale-95 border border-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {property ? 'Update' : (isLand ? 'Save Land' : 'Save Property')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PropertyModal;
