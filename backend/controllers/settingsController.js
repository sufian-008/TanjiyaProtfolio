const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create defaults
      settings = await Settings.create({
        name: "Tanjiya Nowrin",
        title: "Competitive Programmer & Software Engineer",
        bio: "An active competitor, developer, and visual branding designer dedicated to elegant architectures and modern code.",
        resumeUrl: "",
        socials: {
          github: "https://github.com/tanjiya",
          linkedin: "https://linkedin.com/in/tanjiya",
          email: "tanjiya.nowrin@example.com",
          facebook: "",
          twitter: ""
        }
      });
    }
    
    if (req.query.view === 'true') {
      const updatedViews = (settings.views || 0) + 1;
      settings = await Settings.findByIdAndUpdate(settings._id, { views: updatedViews }, { new: true });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
