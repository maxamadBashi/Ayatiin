import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Save, Building, DollarSign, CreditCard, CheckCircle } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: '',
        currency: 'USD',
        paymentMethods: []
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/settings');
            const data = res.data;
            setSettings({
                companyName: data.companyName || '',
                currency: data.currency || 'USD',
                paymentMethods: data.paymentMethods ? JSON.parse(data.paymentMethods) : []
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/settings', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            alert('Failed to save settings');
        }
    };

    if (loading) return <div className="p-6 text-center">Loading settings...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                {saved && (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium animate-in fade-in slide-in-from-right-2">
                        <CheckCircle size={20} />
                        Changes saved successfully!
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Building size={20} className="text-blue-600" />
                            Company Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Your Company Name"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <DollarSign size={20} className="text-emerald-600" />
                            Financial Settings
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">System Currency</label>
                            <select
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="SOS">SOS (Somali Shilling)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <CreditCard size={20} className="text-purple-600" />
                            Payment Methods
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-4">Acceptable payment methods for the system.</p>
                        <div className="flex flex-wrap gap-3">
                            {['Cash', 'EVC Plus', 'eDahab', 'Premier Wallet', 'Bank Transfer', 'Credit Card'].map(method => (
                                <label
                                    key={method}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${settings.paymentMethods.includes(method)
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={settings.paymentMethods.includes(method)}
                                        onChange={(e) => {
                                            const newMethods = e.target.checked
                                                ? [...settings.paymentMethods, method]
                                                : settings.paymentMethods.filter(m => m !== method);
                                            setSettings({ ...settings, paymentMethods: newMethods });
                                        }}
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                    >
                        <Save size={20} />
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
