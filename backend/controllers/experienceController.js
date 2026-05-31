const Experience = require('../models/Experience');

const getExperiences = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};
    if (type) {
      filter.type = type;
    }
    const experiences = await Experience.find(filter).sort({ duration: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const { company, role, logoUrl, duration, responsibilities, achievements, technologies, type } = req.body;
    if (!company || !role || !duration) {
      return res.status(400).json({ message: 'Company, role and duration are required' });
    }

    const newExp = await Experience.create({
      company,
      role,
      logoUrl: logoUrl || '',
      duration,
      responsibilities: responsibilities || [],
      achievements: achievements || [],
      technologies: technologies || [],
      type: type || 'Work'
    });

    res.status(201).json(newExp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: 'Experience item not found' });
    }
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      return res.status(404).json({ message: 'Experience item not found' });
    }
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
};
