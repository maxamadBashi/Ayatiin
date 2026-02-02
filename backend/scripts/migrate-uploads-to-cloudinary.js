/**
 * Migration script to upload local /uploads files to Cloudinary and update DB records.
 * Usage:
 *   Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to backend/.env
 *   From repo root: node backend/scripts/migrate-uploads-to-cloudinary.js
 *
 * Notes:
 * - This script updates `Property.images` entries and `Guarantor.idPhoto` / `workIdPhoto`.
 * - It skips entries that already look like URLs (start with http).
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { prisma } = require('../src/config/db');
const { uploadBuffer, isConfigured } = require('../src/config/cloudinary');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function uploadFileIfLocal(filePath) {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  // Normalize leading slash
  const normalized = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, '..', normalized);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found, skipping:', fullPath);
    return null;
  }
  if (!isConfigured) {
    console.warn('Cloudinary not configured; cannot upload:', fullPath);
    return null;
  }
  const buffer = fs.readFileSync(fullPath);
  const res = await uploadBuffer(buffer, 'migrated');
  return res.secure_url || res.url;
}

async function migrateProperties() {
  console.log('Scanning properties...');
  const props = await prisma.property.findMany();
  for (const p of props) {
    const imgs = p.images || [];
    let changed = false;
    const newImgs = [];
    for (const img of imgs) {
      if (!img) continue;
      if (img.startsWith('http')) {
        newImgs.push(img);
        continue;
      }
      const uploaded = await uploadFileIfLocal(img);
      if (uploaded) {
        newImgs.push(uploaded);
        changed = true;
      } else {
        newImgs.push(img);
      }
    }
    if (changed) {
      await prisma.property.update({ where: { id: p.id }, data: { images: newImgs } });
      console.log(`Updated property ${p.id} (${p.name})`);
    }
  }
}

async function migrateGuarantors() {
  console.log('Scanning guarantors...');
  const guars = await prisma.guarantor.findMany();
  for (const g of guars) {
    let changed = false;
    const updateData = {};
    if (g.idPhoto && !g.idPhoto.startsWith('http')) {
      const uploaded = await uploadFileIfLocal(g.idPhoto);
      if (uploaded) { updateData.idPhoto = uploaded; changed = true; }
    }
    if (g.workIdPhoto && !g.workIdPhoto.startsWith('http')) {
      const uploaded = await uploadFileIfLocal(g.workIdPhoto);
      if (uploaded) { updateData.workIdPhoto = uploaded; changed = true; }
    }
    if (changed) {
      await prisma.guarantor.update({ where: { id: g.id }, data: updateData });
      console.log(`Updated guarantor ${g.id} (${g.name})`);
    }
  }
}

async function run() {
  if (!isConfigured) {
    console.error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env or environment.');
    process.exit(1);
  }

  try {
    await migrateProperties();
    await migrateGuarantors();
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
