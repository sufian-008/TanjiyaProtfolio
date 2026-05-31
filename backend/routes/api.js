const express = require('express');
const router = express.Router();

// Middlewares
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Controllers
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const certificateController = require('../controllers/certificateController');
const experienceController = require('../controllers/experienceController');
const skillController = require('../controllers/skillController');
const olympiadController = require('../controllers/olympiadController');
const mediaController = require('../controllers/mediaController');
const contactController = require('../controllers/contactController');
const analyticsController = require('../controllers/analyticsController');
const settingsController = require('../controllers/settingsController');
const galleryController = require('../controllers/galleryController');
const researchController = require('../controllers/researchController');

// --- AUTHENTICATION ---
router.post('/auth/login', authController.loginAdmin);
router.get('/auth/profile', protect, authController.getAdminProfile);
router.put('/auth/profile', protect, authController.updateAdminProfile);

// --- PROJECTS ---
router.get('/projects', projectController.getProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', protect, adminOnly, projectController.createProject);
router.put('/projects/:id', protect, adminOnly, projectController.updateProject);
router.delete('/projects/:id', protect, adminOnly, projectController.deleteProject);

// --- BLOGS ---
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/slug/:slug', blogController.getBlogBySlug);
router.post('/blogs', protect, adminOnly, blogController.createBlog);
router.put('/blogs/:id', protect, adminOnly, blogController.updateBlog);
router.delete('/blogs/:id', protect, adminOnly, blogController.deleteBlog);

// --- COMMENTS ---
router.get('/comments/blog/:blogId', commentController.getCommentsByBlog);
router.post('/comments', commentController.createComment);
router.put('/comments/:id/like', commentController.likeComment);
router.put('/comments/:id/report', commentController.reportComment);

// Admin comment moderation
router.get('/comments/admin', protect, adminOnly, commentController.getAllCommentsAdmin);
router.put('/comments/:id/approve', protect, adminOnly, commentController.approveComment);
router.put('/comments/:id/spam', protect, adminOnly, commentController.toggleSpamComment);
router.post('/comments/reply', protect, adminOnly, commentController.replyAsAdmin);
router.delete('/comments/:id', protect, adminOnly, commentController.deleteComment);

// --- CERTIFICATES ---
router.get('/certificates', certificateController.getCertificates);
router.post('/certificates', protect, adminOnly, certificateController.createCertificate);
router.put('/certificates/:id', protect, adminOnly, certificateController.updateCertificate);
router.delete('/certificates/:id', protect, adminOnly, certificateController.deleteCertificate);

// --- EXPERIENCE ---
router.get('/experience', experienceController.getExperiences);
router.post('/experience', protect, adminOnly, experienceController.createExperience);
router.put('/experience/:id', protect, adminOnly, experienceController.updateExperience);
router.delete('/experience/:id', protect, adminOnly, experienceController.deleteExperience);

// --- SKILLS ---
router.get('/skills', skillController.getSkills);
router.post('/skills', protect, adminOnly, skillController.createSkill);
router.put('/skills/:id', protect, adminOnly, skillController.updateSkill);
router.delete('/skills/:id', protect, adminOnly, skillController.deleteSkill);

// --- OLYMPIADS ---
router.get('/olympiad', olympiadController.getOlympiads);
router.post('/olympiad', protect, adminOnly, olympiadController.createOlympiad);
router.put('/olympiad/:id', protect, adminOnly, olympiadController.updateOlympiad);
router.delete('/olympiad/:id', protect, adminOnly, olympiadController.deleteOlympiad);

// --- MEDIA LIBRARY ---
router.post('/media/upload', protect, adminOnly, upload.single('file'), mediaController.uploadFile);
router.get('/media', protect, adminOnly, mediaController.getMediaFiles);
router.post('/media/delete', protect, adminOnly, mediaController.deleteFile);

// --- CONTACT FORM ---
router.post('/contact', contactController.submitForm);
router.get('/contact/messages', protect, adminOnly, contactController.getMessages);
router.put('/contact/messages/:id/read', protect, adminOnly, contactController.markAsRead);
router.delete('/contact/messages/:id', protect, adminOnly, contactController.deleteMessage);

// --- ANALYTICS ---
router.get('/analytics', protect, adminOnly, analyticsController.getDashboardStats);

// --- SETTINGS ---
router.get('/settings', settingsController.getSettings);
router.put('/settings', protect, adminOnly, settingsController.updateSettings);

// --- GALLERY ---
router.get('/gallery', galleryController.getGalleryItems);
router.post('/gallery', protect, adminOnly, galleryController.createGalleryItem);
router.delete('/gallery/:id', protect, adminOnly, galleryController.deleteGalleryItem);

// --- RESEARCH ---
router.get('/research', researchController.getResearchWorks);
router.post('/research', protect, adminOnly, researchController.createResearchWork);
router.delete('/research/:id', protect, adminOnly, researchController.deleteResearchWork);

module.exports = router;
