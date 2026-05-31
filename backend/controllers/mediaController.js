const fs = require('fs');
const path = require('path');
const { uploadToStorage, deleteFromStorage } = require('../config/cloudinary');

// Upload a single file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folder = req.body.folder || 'portfolio';
    const fileUrl = await uploadToStorage(req.file, folder);

    res.status(201).json({
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of uploaded media (scans local uploads folder)
const getMediaFiles = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const files = fs.readdirSync(uploadDir);
    const mediaList = files
      .filter(file => !file.startsWith('.'))
      .map(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(mediaList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete media
const deleteFile = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    await deleteFromStorage(url);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadFile,
  getMediaFiles,
  deleteFile
};
