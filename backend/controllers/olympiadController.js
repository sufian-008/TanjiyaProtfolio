const Olympiad = require('../models/Olympiad');

const getOlympiads = async (req, res) => {
  try {
    const olympiads = await Olympiad.find({}).sort({ year: -1 });
    res.json(olympiads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOlympiad = async (req, res) => {
  try {
    const { eventName, year, organizer, ranking, certificateUrl, description } = req.body;
    if (!eventName || !year || !organizer || !ranking) {
      return res.status(400).json({ message: 'Event name, year, organizer and ranking are required' });
    }

    const newRecord = await Olympiad.create({
      eventName,
      year,
      organizer,
      ranking,
      certificateUrl: certificateUrl || '',
      description: description || ''
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOlympiad = async (req, res) => {
  try {
    const record = await Olympiad.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Olympiad record not found' });
    }
    const updated = await Olympiad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOlympiad = async (req, res) => {
  try {
    const record = await Olympiad.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Olympiad record not found' });
    }
    await Olympiad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Olympiad record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOlympiads,
  createOlympiad,
  updateOlympiad,
  deleteOlympiad
};
