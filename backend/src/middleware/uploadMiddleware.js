const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! Please upload jpg, jpeg, png, gif, or webp files.'));
    }
}

const multerStorage = multer.memoryStorage();

const uploader = multer({
    storage: multerStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

function uploadToCloudinary(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
        const opts = Object.assign({ folder: 'ayatiin/properties', resource_type: 'image', transformation: [{ width: 1600, height: 900, crop: 'limit', quality: 'auto' }] }, options);
        const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
}

// Middleware: parse files with multer, then upload each to Cloudinary
module.exports = function (fieldName = 'images', maxCount = 6) {
    const mw = uploader.array(fieldName, maxCount);
    return async function (req, res, next) {
        mw(req, res, async function (err) {
            if (err) return next(err);
            if (!req.files || req.files.length === 0) return next();

            try {
                const uploads = await Promise.all(req.files.map(async (file) => {
                    const result = await uploadToCloudinary(file.buffer);
                    return Object.assign(file, { path: result.secure_url });
                }));
                req.files = uploads;
                next();
            } catch (uploadErr) {
                next(uploadErr);
            }
        });
    };
};
