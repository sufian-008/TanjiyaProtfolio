const Contact = require('../models/Contact');

// Submit visitor form
const submitForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      isRead: false
    });

    res.status(201).json({
      message: 'Thank you! Your message has been received.',
      contact: newContact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Mark message as read
const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete message
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitForm,
  getMessages,
  markAsRead,
  deleteMessage
};
