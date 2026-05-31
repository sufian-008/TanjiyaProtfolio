const { getModel } = require('./modelFactory');

const skillSchemaDefinition = {
  name: { type: String, required: true },
  category: {
    type: String,
    required: true
  },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  icon: { type: String, default: '' }
};

module.exports = getModel('Skill', skillSchemaDefinition);
