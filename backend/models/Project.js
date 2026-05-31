const { getModel } = require('./modelFactory');

const projectSchemaDefinition = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  techStack: [{ type: String }],
  features: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  category: { type: String, required: true },
  caseStudy: { type: String, default: '' }
};

module.exports = getModel('Project', projectSchemaDefinition);
