const { getModel } = require('./modelFactory');

const userSchemaDefinition = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'admin' }
};

module.exports = getModel('User', userSchemaDefinition);
