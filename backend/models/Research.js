const { getModel } = require('./modelFactory');

const researchSchemaDefinition = {
  title: { type: String, required: true },
  authors: { type: String, default: 'Tanjiya Nowrin' },
  institution: { type: String, required: true },
  publicationDate: { type: String, required: true },
  abstract: { type: String, required: true },
  link: { type: String, default: '' },
  tags: { type: [String], default: [] }
};

module.exports = getModel('Research', researchSchemaDefinition);
