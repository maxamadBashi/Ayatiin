export const getImageUrl = (path) => {
    if (!path) return '';

    // If it's already a full URL (like from Cloudinary or external sources), return it
    if (path.startsWith('http')) {
        return path;
    }

    // Handle local development or local storage paths from backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendBaseUrl = API_URL.replace('/api', '');

    // Normalize path (Windows fix)
    let normalized = path.replace(/\\/g, '/');

    // If it contains 'uploads', extract everything from 'uploads' onwards
    if (normalized.includes('uploads/')) {
        normalized = normalized.substring(normalized.indexOf('uploads/'));
    }

    // Ensure it starts with a single slash
    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }

    return `${backendBaseUrl}${normalized}`;
};
