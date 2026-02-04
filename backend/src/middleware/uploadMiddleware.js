const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Storage configuration for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ayatiin/uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1600, height: 900, crop: 'limit', quality: 'auto' }],
    },
});

const uploader = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * Handle multiple images for a property
 * @param {string} fieldName - Form field name (default: 'images')
 * @param {number} maxCount - Max number of files (default: 10)
 */
function uploadArray(fieldName = 'images', maxCount = 10) {
    return uploader.array(fieldName, maxCount);
}

/**
 * Handle multiple named fields (e.g. idPhoto, workIdPhoto)
 * @param {Array} fieldDefinitions - Array of { name, maxCount } objects
 */
function uploadFields(fieldDefinitions = []) {
    return uploader.fields(fieldDefinitions);
}

module.exports = {
    array: uploadArray,
    fields: uploadFields,
};
