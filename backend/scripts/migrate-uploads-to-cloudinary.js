const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const cloudinary = require('../src/config/cloudinary');
const { prisma } = require('../src/config/db');

async function uploadLocalFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  // use uploadBuffer helper if available
  if (cloudinary.uploadBuffer) {
    return cloudinary.uploadBuffer(buffer, 'ayatiin/properties');
  }
  // fallback to uploader
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'ayatiin/properties' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    const streamifier = require('streamifier');
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function migrate() {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found, nothing to migrate.');
    process.exit(0);
  }

  const files = fs.readdirSync(uploadsDir).filter(f => /images?-/.test(f));
  if (files.length === 0) {
    console.log('No matching upload files found.');
    process.exit(0);
  }

  // Map local filename -> cloudinary url
  const uploadedMap = {};

  for (const file of files) {
    const full = path.join(uploadsDir, file);
    try {
      console.log('Uploading', file);
      const res = await uploadLocalFile(full);
      uploadedMap[`/uploads/${file}`] = res.secure_url;
      console.log('Uploaded', file, '->', res.secure_url);
    } catch (e) {
      console.error('Failed to upload', file, e.message || e);
    }
  }

  // Update properties that reference these local paths
  const properties = await prisma.property.findMany();
  for (const prop of properties) {
    if (!prop.images || prop.images.length === 0) continue;
    let changed = false;
    const newImages = prop.images.map(img => {
      if (typeof img === 'string' && uploadedMap[img]) {
        changed = true;
        return uploadedMap[img];
      }
      return img;
    });
    if (changed) {
      await prisma.property.update({ where: { id: prop.id }, data: { images: newImages } });
      console.log('Updated property', prop.id);
    }
  }

  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
