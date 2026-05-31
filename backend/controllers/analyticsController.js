const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Contact = require('../models/Contact');
const Certificate = require('../models/Certificate');
const Olympiad = require('../models/Olympiad');
const Settings = require('../models/Settings');

const getDashboardStats = async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments();
    const blogsCount = await Blog.countDocuments();
    const commentsCount = await Comment.countDocuments();
    const pendingCommentsCount = await Comment.countDocuments({ isApproved: false });
    const certificatesCount = await Certificate.countDocuments();
    const olympiadsCount = await Olympiad.countDocuments();
    const contactsCount = await Contact.countDocuments({ isRead: false });
    const settings = await Settings.findOne({});
    const realViews = settings ? (settings.views || 0) : 0;

    // Sum blog views
    const blogs = await Blog.find({});
    const totalBlogViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    // Get recent activities
    const recentContacts = await Contact.find({}).sort({ createdAt: -1 }).limit(5);
    const recentComments = await Comment.find({}).sort({ createdAt: -1 }).limit(5);

    // Mock visitor data by day for charts (last 7 days)
    const visitorChartData = [
      { day: 'Mon', views: Math.floor(realViews * 0.1) + 12 },
      { day: 'Tue', views: Math.floor(realViews * 0.12) + 15 },
      { day: 'Wed', views: Math.floor(realViews * 0.15) + 18 },
      { day: 'Thu', views: Math.floor(realViews * 0.08) + 9 },
      { day: 'Fri', views: Math.floor(realViews * 0.2) + 24 },
      { day: 'Sat', views: Math.floor(realViews * 0.18) + 20 },
      { day: 'Sun', views: Math.floor(realViews * 0.17) + 22 }
    ];

    res.json({
      counts: {
        projects: projectsCount,
        blogs: blogsCount,
        comments: commentsCount,
        pendingComments: pendingCommentsCount,
        certificates: certificatesCount,
        olympiads: olympiadsCount,
        unreadContacts: contactsCount,
        views: realViews
      },
      recent: {
        contacts: recentContacts,
        comments: recentComments
      },
      visitorChartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
