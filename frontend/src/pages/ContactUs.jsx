import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const ContactUs = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus({ type: 'success', message: t('successMsg') });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Header Section */}
            <section className="bg-slate-900 pt-40 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-tight">{t('contactHeader')}</h1>
                    <p className="text-xl text-slate-400">{t('contactSub')}</p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">{t('contactInfo')}</h2>
                            <p className="text-slate-600 mb-10 leading-relaxed">
                                {t('contactInfoDesc')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Phone, label: t('phone'), value: '+252 61XXXXXXX', desc: 'Sabti - Khamiis: 8am - 5pm', color: 'bg-blue-600' },
                                { icon: Mail, label: t('email'), value: 'info@ayatiin.com', desc: t('emailPlaceholder'), color: 'bg-indigo-600' },
                                { icon: MapPin, label: t('office'), value: 'Main Road, Mogadishu', desc: 'Somalia', color: 'bg-slate-900' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110`}>
                                        <item.icon className="text-white" size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-lg font-bold text-slate-900">{item.value}</p>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-10 border-t border-slate-100 italic text-slate-500 flex items-center gap-3">
                            <Clock size={20} />
                            <span>{t('averageResponse')}</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100">
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                                <MessageSquare className="text-blue-600" />
                                {t('sendMessage')}
                            </h3>

                            {status.message && (
                                <div className={`mb-8 p-4 rounded-xl font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('nameLabel')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                                        placeholder={t('namePlaceholder')}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('email')}</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                                        placeholder={t('emailPlaceholder')}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('subjectLabel')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all"
                                        placeholder={t('subjectPlaceholder')}
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('messageLabel')}</label>
                                    <textarea
                                        rows="6"
                                        required
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all resize-none"
                                        placeholder={t('messagePlaceholder')}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Send size={20} />
                                        <span>{t('sendBtn')}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="w-full h-[400px] bg-slate-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center grayscale">
                    <div className="text-center space-y-4">
                        <MapPin size={48} className="text-slate-400 mx-auto" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest">Google Map location integration coming soon</p>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default ContactUs;
