// Test script to call createProperty controller directly without HTTP/auth
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { createProperty } = require('../src/controllers/propertyController');

function makeReq(filePath) {
  const buffer = fs.readFileSync(filePath);
  return {
    body: {
      name: 'Test Property From Script',
      city: 'TestCity',
    },
    files: [
      {
        originalname: path.basename(filePath),
        buffer,
        mimetype: 'image/jpeg',
      }
    ],
    user: { id: '00000000-0000-0000-0000-000000000000' }
  };
}

function makeRes() {
  return {
    status(code) { this._status = code; return this; },
    json(obj) { console.log('RES JSON', this._status || 200, obj); }
  };
}

async function run() {
  const sample = path.resolve(__dirname, '../uploads/sample.jpg');
  if (!fs.existsSync(sample)) {
    // create a tiny placeholder image
    fs.writeFileSync(sample, Buffer.from([0xff,0xd8,0xff,0xd9]));
  }

  const req = makeReq(sample);
  const res = makeRes();
  try {
    await createProperty(req, res);
    console.log('Test createProperty finished');
  } catch (err) {
    console.error('Error running createProperty test:', err);
  }
}

run();
