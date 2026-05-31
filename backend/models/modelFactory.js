const mongoose = require('mongoose');
const { isMongoConfigured, createMockModel } = require('../config/db');

function getModel(modelName, schemaDefinition) {
  if (isMongoConfigured()) {
    // If the model has already been compiled, return it
    if (mongoose.models[modelName]) {
      return mongoose.models[modelName];
    }
    const schema = new mongoose.Schema(schemaDefinition, { timestamps: true });
    return mongoose.model(modelName, schema);
  } else {
    // Fallback Mock Model
    return createMockModel(modelName.toLowerCase() + 's'); // e.g. Projects, Blogs
  }
}

module.exports = { getModel };
