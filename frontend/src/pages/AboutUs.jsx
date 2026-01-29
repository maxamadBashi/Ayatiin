import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { useLanguage } from '../context/LanguageContext';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center bg-slate-900 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                        alt="Modern Architecture"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-blue-600/20 backdrop-blur-md rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-600/30">
                        {t('aboutHeroTag')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
                        {t('aboutHeroTitle')}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {t('aboutHeroDesc')}
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Mission */}
                    <div className="group p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Target className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight">{t('mission')}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {t('missionDesc')}
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="group p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all duration-500">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Eye className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight">{t('visionTitle')}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {t('visionDesc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('definesUs')}</h2>
                        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: t('reliability'), desc: t('reliabilityDesc'), icon: Award },
                            { title: t('transparency'), desc: t('transparencyDesc'), icon: CheckCircle2 },
                            { title: t('innovation'), desc: t('innovationDesc'), icon: Target },
                            { title: t('community'), desc: t('communityDesc'), icon: Eye }
                        ].map((value, i) => (
                            <div key={i} className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                <value.icon className="text-blue-400 mb-6" size={32} />
                                <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Team at work"
                            className="rounded-3xl shadow-2xl relative z-10"
                        />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-3xl -z-0 hidden md:block opacity-10"></div>
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600 rounded-3xl -z-0 hidden md:block opacity-10"></div>
                    </div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                    <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('trustedTitle')}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {t('trustedDesc')}
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-4">
                        <div>
                            <p className="text-4xl font-extrabold text-blue-600">500+</p>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{t('statUnits')}</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-indigo-600">10k+</p>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{t('statClients')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default AboutUs;
