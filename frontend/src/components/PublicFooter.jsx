import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const PublicFooter = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="text-2xl font-extrabold text-white tracking-tight">AAYATIIN</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            The most trusted real estate partner in Somalia, Mogadishu & Hargeisa. We provide smart property management solutions for modern living.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-500">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Property Listings', path: '/listings' },
                                { name: 'About Company', path: '/about' },
                                { name: 'Contact Support', path: '/contact' },
                                { name: 'Privacy Policy', path: '#' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-blue-500 flex items-center gap-2 transition-colors group">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Get In Touch</h4>
                        <ul className="space-y-5 text-sm">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-blue-500" />
                                </div>
                                <span>Main Road, Mogadishu,<br />Somalia</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Phone size={18} className="text-blue-500" />
                                </div>
                                <span>+252 61XXXXXXX<br />+252 63XXXXXXX</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Mail size={18} className="text-blue-500" />
                                </div>
                                <span>info@ayatiin.com<br />support@ayatiin.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Newsletter</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            Subscribe to get the latest property updates and market news.
                        </p>
                        <form className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full bg-slate-800 border-none rounded-xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
                    <p>© 2026 AAYATIIN PROPERTY LTD. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
