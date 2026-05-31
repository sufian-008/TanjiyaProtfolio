const { getModel } = require('./modelFactory');

const olympiadSchemaDefinition = {
  eventName: { type: String, required: true },
  year: { type: Number, required: true },
  organizer: { type: String, required: true },
  ranking: { type: String, required: true },
  certificateUrl: { type: String, default: '' },
  description: { type: String, default: '' }
};

module.exports = getModel('Olympiad', olympiadSchemaDefinition);
