const cloudinaryLib = require('cloudinary');
const streamifier = require('streamifier');

const isConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let cloudinary = null;
if (isConfigured) {
  cloudinary = cloudinaryLib.v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function uploadBuffer(buffer, folder = 'ayatiin') {
  return new Promise((resolve, reject) => {
    if (!isConfigured) return reject(new Error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'));
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports = {
  cloudinary,
  uploadBuffer,
  isConfigured,
};
