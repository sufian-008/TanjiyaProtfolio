const { getModel } = require('./modelFactory');

const experienceSchemaDefinition = {
  company: { type: String, required: true },
  role: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  duration: { type: String, required: true },
  responsibilities: [{ type: String }],
  achievements: [{ type: String }],
  technologies: [{ type: String }],
  type: {
    type: String,
    enum: ['Work', 'Education', 'Organization', 'Volunteering'],
    default: 'Work'
  }
};

module.exports = getModel('Experience', experienceSchemaDefinition);
