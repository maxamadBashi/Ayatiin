import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Navbar
        home: 'Home',
        properties: 'Properties',
        about: 'About Us',
        contact: 'Contact Us',
        login: 'Login',
        register: 'Join Now',
        dashboard: 'Dashboard',
        myAccount: 'My Account',
        logout: 'Log Out',

        // Home Hero
        heroTag: 'The Gold Standard of Somali Real Estate',
        heroTitle1: 'THIS IS',
        heroTitle2: 'AAYATIIN',
        heroTitle3: 'PROPERTY LTD',
        heroDesc: 'Property Smart in Somalia, Mogadishu & Hargeisa. Find, Manage, and Secure your future home with the industry leaders.',
        viewProperties: 'View Properties',
        contactUs: 'Contact Us',

        // Home Stats
        statUnits: 'Available Units',
        statClients: 'Happy Clients',
        statLocations: 'Locations',
        statSatisfaction: 'Satisfaction',

        // Featured
        featuredTitle: 'Featured Properties',
        featuredSub: 'Choose from the very best',
        viewAll: 'View All Properties',

        // Why Choose Us
        whyTitle: 'Why Choose Us?',
        shieldTitle: 'Full Security',
        shieldDesc: 'AAYATIIN system guarantees the security of your money and property.',
        priceTitle: 'Affordable Rates',
        priceDesc: 'Our properties are the best quality on the market at the most affordable prices.',
        speedTitle: 'Fast Service',
        speedDesc: 'From booking to moving in, our service is extremely fast.',

        // CTA
        ctaTitle: 'Contact us today, don\'t miss out on your future home.',
        getStarted: 'Get Started',
        createAccount: 'Create Account',

        // Listings
        listingsHeader: 'Property Projects',
        listingsSub: 'Find the home or land you\'ve been dreaming of.',
        searchPlaceholder: 'Search for building name or location...',
        allTypes: 'All Types',
        allStatuses: 'All Statuses',
        foundCount: 'Found {count} properties matching your search.',
        notFoundTitle: 'Not Found',
        notFoundDesc: 'No properties match your search. Please try again.',
        resetSearch: 'Start Over',

        // About
        aboutHeroTag: 'Know Our Story',
        aboutHeroTitle: 'Transforming Real Estate in East Africa',
        aboutHeroDesc: 'AAYATIIN PROPERTY LTD is more than just a property management company. We are a team of visionaries dedicated to providing smart, secure, and modern housing solutions.',
        mission: 'Our Mission',
        missionDesc: 'To facilitate high-quality, tech-enabled property management services that simplify life for owners and tenants across Somalia.',
        vision: 'Our Vision',
        visionTitle: 'Our Vision',
        visionDesc: 'To be the leading real estate platform in East Africa, recognized for our commitment to excellence and integrity.',
        definesUs: 'What Defines Us',
        reliability: 'Reliability',
        transparency: 'Transparency',
        innovation: 'Innovation',
        community: 'Community',
        reliabilityDesc: 'We deliver on our promises every time.',
        transparencyDesc: 'Clear communication and honest deals.',
        innovationDesc: 'Smart tech for smart property management.',
        communityDesc: 'Building better neighborhoods for all.',
        trustedTitle: 'Trusted by Thousands Across the Region',
        trustedDesc: 'By integrating deep local knowledge with advanced management software, AAYATIIN has become a symbol of trust in the Somali real estate landscape.',

        // Contact
        contactHeader: 'Get In Touch',
        contactSub: 'We are here to help with all your real estate needs.',
        contactInfo: 'Contact Information',
        contactInfoDesc: 'If you have any questions or want to speak with us, please use one of the methods below.',
        phone: 'Phone',
        email: 'Email',
        office: 'Office',
        averageResponse: 'We typically respond within 2 hours.',
        sendMessage: 'Send Us a Message',
        nameLabel: 'Your Name',
        namePlaceholder: 'Enter your full name',
        emailPlaceholder: 'email@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'What do you want to talk about?',
        messageLabel: 'Your Message',
        messagePlaceholder: 'Type your message here...',
        sendBtn: 'Send Message',
        successMsg: 'Thank you for your message! We will get back to you soon.',

        // Property Card
        beds: 'Beds',
        baths: 'Baths',
        bookNow: 'Book Now',
        buyNow: 'Buy Now',
        locationNotFixed: 'Location not specified',
        bestProperty: 'Beautiful property in a prime location',
        onContact: 'Price on Request',
        month: 'month',
        total: 'total',
        all: 'All',
    },
    so: {
        // Navbar
        home: 'Hoyga',
        properties: 'Guryaha',
        about: 'Nagu Saabsan',
        contact: 'Nala Soo Xiriir',
        login: 'Soo Gal',
        register: 'Nagu Soo Biir',
        dashboard: 'Dashboard',
        myAccount: 'Akoonkayga',
        logout: 'Ka Bax',

        // Home Hero
        heroTag: 'Heerka ugu sarreeya ee Hantida Maguurtada Soomaaliya',
        heroTitle1: 'WAA',
        heroTitle2: 'AAYATIIN',
        heroTitle3: 'PROPERTY LTD',
        heroDesc: 'Hantida Smart-ka ah ee Soomaaliya, Muqdisho & Hargeysa. Raadi, Maamul, oo Sug mustaqbalka gurigaaga adigoo la shaqaynaya madaxda warshadaha.',
        viewProperties: 'Eeg Guryaha',
        contactUs: 'Nala Soo Xiriir',

        // Home Stats
        statUnits: 'Guryo Diyaar ah',
        statClients: 'Macaamiil Faraxsan',
        statLocations: 'Goobaha',
        statSatisfaction: 'Kallsoonida',

        // Featured
        featuredTitle: 'Featured Guryo',
        featuredSub: 'Kala dooro kuwa ugu fiican',
        viewAll: 'Dhammaan Guryaha',

        // Why Choose Us
        whyTitle: 'Maxaad Noo Dooranaysaa?',
        shieldTitle: 'Amni Buuxa',
        shieldDesc: 'Nidaamka AAYATIIN wuxuu dammaanad qaadayaa amniga lacagtaada iyo gurigaaba.',
        priceTitle: 'Qiimo Jaban',
        priceDesc: 'Guryaha aan hayno waa kuwa ugu tayada fiican suuqa isla markaana ugu qiimaha jaban.',
        speedTitle: 'Adeeg Degdeg ah',
        speedDesc: 'Laga bilaabo booking-ka ilaa gudaha u guuridda, Adeegayagu waa mid aad u degdeg badan.',

        // CTA
        ctaTitle: 'Nala soo xiriir maanta, gurigaaga mustaqbalka ha ku dhaafin.',
        getStarted: 'Bilow hadda',
        createAccount: 'Akown Furto',

        // Listings
        listingsHeader: 'Mashiicada Hantida',
        listingsSub: 'Raadi guriga ama dhulka aad ku hamiyayso.',
        searchPlaceholder: 'Raadi magaca dhismaha ama meesha uu ku yaal...',
        allTypes: 'Dhammaan Noocyada',
        allStatuses: 'Dhammaan Xaaladaha',
        foundCount: 'Waxaa la helay {count} hanti oo u dhigma raadintaada.',
        notFoundTitle: 'Lama Helin',
        notFoundDesc: 'Ma jiro wax hanti ah oo u dhigma raadintaada. Fadlan mar kale isku day.',
        resetSearch: 'Bilow Mar Kale',

        // About
        aboutHeroTag: 'Ogaaw Sheekadeena',
        aboutHeroTitle: 'Beddelidda Hantida Maguurtada ee Bariga Afrika',
        aboutHeroDesc: 'AAYATIIN PROPERTY LTD waa wax ka badan shirkad maamusha hantida. Waxaan nahay koox aragti fog leh oo u heellan bixinta xalal guri oo smart, sugan, oo casri ah.',
        mission: 'Hadafkayaga',
        missionDesc: 'Inaan fududeyno adeegyada maamulista hantida ee tignoolajiyada ku saleysan kuwaas oo u fududeeya nolosha milkiilayaasha iyo kireystayaasha guud ahaan Soomaaliya.',
        vision: 'Aragtidayada',
        visionTitle: 'Aragtidayada',
        visionDesc: 'Inaan noqono madal hantida maguurtada ah ee hormuudka u ah Bariga Afrika, ee lagu aqoonsaday ka go\'naanteena sareynta iyo hufnaanta.',
        definesUs: 'Maxaa Na Qeexaya',
        reliability: 'Kallsoonida',
        transparency: 'Hufnaanta',
        innovation: 'Cusubyada',
        community: 'Bulshada',
        reliabilityDesc: 'Waxaan fulinaa ballanqaadyadayada mar kasta.',
        transparencyDesc: 'Xiriir cad iyo heshiisyo daacad ah.',
        innovationDesc: 'Tignoolajiyada smart ee maamulista hantida.',
        communityDesc: 'Dhisidda xaafado ka fiican dhammaan.',
        trustedTitle: 'Waxaa Na Aaminay Kumanaan qof Gobolka oo dhan',
        trustedDesc: 'Markaan isku darno aqoonta gudaha ee qotada dheer iyo barnaamijyada maamulista ee horumarsan, AAYATIIN wuxuu noqday calaamad lagu kalsoonaan karo hantida maguurtada Soomaaliya.',

        // Contact
        contactHeader: 'Nala Soo Xiriir',
        contactSub: 'Waxaan halkaan u joognaa inaan kaa caawino dhammaan baahiyahaaga hantida maguurtada ah.',
        contactInfo: 'Macluumaadka Xiriirka',
        contactInfoDesc: 'Haddii aad qabto wax su\'aalo ah ama aad rabto inaad nala hadasho, fadlan isticmaal mid ka mid ah dariiqooyinka hoos ku xusan.',
        phone: 'Taleefan',
        email: 'Email',
        office: 'Xafiiska',
        averageResponse: 'Celcelis ahaan waxaan kuugu soo jawaabnaa 2 saacadood gudahood.',
        sendMessage: 'Noo Soo Dir Farriin',
        nameLabel: 'Magacaaga',
        namePlaceholder: 'Gali magacaaga oo buuxa',
        emailPlaceholder: 'email@example.com',
        subjectLabel: 'Mowduuca',
        subjectPlaceholder: 'Maxaad rabtaa inaad nala hadasho?',
        messageLabel: 'Farriintaada',
        messagePlaceholder: 'Halkaan ku qor farriintaada...',
        sendBtn: 'Farriinta Dir',
        successMsg: 'Waad ku mahadsantahay farriintaada! Dhakhso ayaan kuu soo jawaabi doonaa.',

        // Property Card
        beds: 'Sariiro',
        baths: 'Suuliyo',
        bookNow: 'Hadda Qabso',
        buyNow: 'Hadda Iibso',
        locationNotFixed: 'Goobta lama cayimin',
        bestProperty: 'Guri qurux badan oo ku yaal goob muhiim ah',
        onContact: 'Qiimaha Xiriir',
        month: 'bishii',
        total: 'guud',
        all: 'Dhammaan',
    }
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = (key, params = {}) => {
        let text = translations[lang][key] || key;

        // Replace params
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    };

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'so' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
