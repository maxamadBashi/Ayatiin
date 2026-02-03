const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for all uploaded images
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'ayatiin/properties', // folder name in Cloudinary
            resource_type: 'image',
            format: undefined, // keep original format
            public_id: undefined, // let Cloudinary generate
            transformation: [
                { width: 1600, height: 900, crop: 'limit', quality: 'auto' },
            ],
        };
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! Please upload jpg, jpeg, png, gif, or webp files.'));
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
