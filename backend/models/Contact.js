const { getModel } = require('./modelFactory');

const contactSchemaDefinition = {
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
};

module.exports = getModel('Contact', contactSchemaDefinition);
