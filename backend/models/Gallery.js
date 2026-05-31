const { getModel } = require('./modelFactory');

const gallerySchemaDefinition = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true }
};

module.exports = getModel('Gallery', gallerySchemaDefinition);
