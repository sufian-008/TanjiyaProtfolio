const { getModel } = require('./modelFactory');

const certificateSchemaDefinition = {
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String, required: true },
  credentialId: { type: String, default: '' },
  downloadUrl: { type: String, default: '' }
};

module.exports = getModel('Certificate', certificateSchemaDefinition);
