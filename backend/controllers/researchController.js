const Research = require('../models/Research');

const getResearchWorks = async (req, res) => {
  try {
    const works = await Research.find({}).sort({ createdAt: -1 });
    res.json(works);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResearchWork = async (req, res) => {
  try {
    const { title, authors, institution, publicationDate, abstract, link, tags } = req.body;
    if (!title || !institution || !publicationDate || !abstract) {
      return res.status(400).json({ message: 'Title, institution, publication date, and abstract are required' });
    }

    const newWork = await Research.create({
      title,
      authors: authors || 'Tanjiya Nowrin',
      institution,
      publicationDate,
      abstract,
      link: link || '',
      tags: tags || []
    });
    res.status(201).json(newWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResearchWork = async (req, res) => {
  try {
    const work = await Research.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ message: 'Research work not found' });
    }

    await Research.findByIdAndDelete(req.params.id);
    res.json({ message: 'Research work deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResearchWorks,
  createResearchWork,
  deleteResearchWork
};
