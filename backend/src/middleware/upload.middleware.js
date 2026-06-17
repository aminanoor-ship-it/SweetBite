const fs = require('fs');
const path = require('path');
const multer = require('multer');

function createImageUpload(folder) {
  const destination = path.join(__dirname, '..', '..', 'uploads', folder);
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, destination),
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeBase = path.basename(file.originalname, extension).replace(/[^a-z0-9_-]/gi, '-').slice(0, 50);
      callback(null, `${Date.now()}-${safeBase || 'image'}${extension}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 2) * 1024 * 1024 },
    fileFilter(req, file, callback) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      callback(allowed.includes(file.mimetype) ? null : new Error('Only JPG, PNG and WebP images are allowed.'), allowed.includes(file.mimetype));
    }
  });
}

module.exports = { productUpload: createImageUpload('products'), profileUpload: createImageUpload('profiles'), teamUpload: createImageUpload('team') };
