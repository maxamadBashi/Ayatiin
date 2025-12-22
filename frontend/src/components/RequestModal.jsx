import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, MessageSquare, Sparkles, Home, MapPin } from 'lucide-react';

const RequestModal = ({ isOpen, onClose, onSubmit, property, type }) => {
    const [formData, setFormData] = useState({
        visitDate: '',
        amount: '',
        message: '',
    });
    const [amountError, setAmountError] = useState('');

    // Marka modal-ku furmo ama property-ga/ nooca request-ka is beddelo,
    // si toos ah ugu buuxi amount-ka qiimaha uu admin-ka u dejiyey guriga.
    useEffect(() => {
        if (!isOpen) return;

        if (property?.price) {
            setFormData((prev) => ({
                ...prev,
                amount: property.price.toString(),
            }));
            setAmountError('');
        } else {
            setFormData((prev) => ({
                ...prev,
                amount: '',
            }));
        }
    }, [isOpen, property, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'amount' && property?.price) {
            const num = Number(value || '0');
            const expected = Number(property.price);
            if (Number.isNaN(num)) {
                setAmountError('Please enter a valid number.');
            } else if (num !== expected) {
                setAmountError(
                    `Lacagta waa in ay la mid noqotaa qiimaha guriga: $${expected.toLocaleString()}`
                );
            } else {
                setAmountError('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Hubi in amount-ka uu la mid yahay qiimaha property-ga uu admin-ku dejiyey
        if (property?.price) {
            const num = Number(formData.amount || '0');
            const expected = Number(property.price);
            if (Number.isNaN(num) || num !== expected) {
                alert(
                    `Fadlan geli lacagta saxda ah ee gurigan: $${expected.toLocaleString()}. ` +
                    'Booking/Buy lama aqbali karo ilaa lacagtu la mid noqoto tan uu admin-ku soo geliyay.'
                );
                return;
            }
        }

        onSubmit(formData);
        setFormData({ visitDate: '', amount: '', message: '' });
        setAmountError('');
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-slideUp border border-gray-100">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {type === 'booking' ? 'Book Property' : 'Buy Property'}
                            </h2>
                            <p className="text-blue-100 text-sm">Fill in the details below</p>
                        </div>
                    </div>
                </div>

                {/* Property Info Card */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Home className="text-white" size={28} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">
                                You are requesting to <span className="font-bold text-gray-900">{type === 'booking' ? 'book' : 'buy'}</span>:
                            </p>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{property?.name}</h3>
                            {property?.location && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <MapPin size={14} />
                                    <span>{property.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Visit Date */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <Calendar size={18} className="text-blue-600" />
                            <span>Visit Date</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="visitDate"
                            value={formData.visitDate}
                            onChange={handleChange}
                            min={today}
                            required
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Select your preferred visit date</p>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign size={18} className="text-blue-600" />
                            <span>{type === 'booking' ? 'Monthly Rent Amount' : 'Purchase Amount'}</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">
                            {type === 'booking' ? 'Expected monthly rent amount' : 'Your offer amount'}
                        </p>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                            <MessageSquare size={18} className="text-blue-600" />
                            <span>Message</span>
                            <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                            rows="4"
                            placeholder="Any specific requirements, questions, or additional information?"
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={18} />
                            <span>Submit Request</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestModal;
