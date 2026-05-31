const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary media upload configured.');
} else {
  console.log('Cloudinary variables missing. Media will be stored in local backend storage.');
}

const uploadToStorage = async (file, folder = 'portfolio') => {
  // If Cloudinary is configured
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto'
      });
      // Delete temporary file uploaded by multer
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error, trying local fallback:', err.message);
      // Fallback to local
    }
  }

  // Fallback local storage
  const uploadDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = Date.now() + '-' + path.basename(file.path);
  const destPath = path.join(uploadDir, filename);

  fs.copyFileSync(file.path, destPath);
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  // Return a relative path that Express serves statically
  return `/uploads/${filename}`;
};

const deleteFromStorage = async (url) => {
  if (!url) return;
  
  if (isCloudinaryConfigured() && url.includes('cloudinary.com')) {
    try {
      // Extract public_id from url
      // Format: .../v1234567/folder/name.jpg
      const parts = url.split('/');
      const filenameWithExtension = parts.pop();
      const folder = parts.pop();
      const publicId = `${folder}/${filenameWithExtension.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
      return;
    } catch (err) {
      console.error('Cloudinary delete error:', err.message);
    }
  }

  // Local file delete
  if (url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../public/uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

module.exports = {
  uploadToStorage,
  deleteFromStorage,
  isCloudinaryConfigured
};
