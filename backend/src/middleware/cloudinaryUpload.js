const multer = require('multer');
const streamifier = require('streamifier');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// multer memory storage so we can upload buffer to Cloudinary
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! Please upload jpg, jpeg, png, gif, or webp files.'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function uploadBufferToCloudinary(buffer, filename) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ayatiin/properties', resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

// Combined middleware: multer memory + upload to Cloudinary
const cloudinaryUploadMiddleware = (req, res, next) => {
    upload.array('images', 10)(req, res, async (err) => {
        if (err) {
            return next(err);
        }

        if (!req.files || req.files.length === 0) return next();

        try {
            const uploads = req.files.map((file) => uploadBufferToCloudinary(file.buffer, file.originalname));
            const results = await Promise.all(uploads);
            req.uploadedImages = results.map(r => r.secure_url);
            req.uploadedPublicIds = results.map(r => r.public_id);
            next();
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            next(uploadError);
        }
    });
};

module.exports = cloudinaryUploadMiddleware;
