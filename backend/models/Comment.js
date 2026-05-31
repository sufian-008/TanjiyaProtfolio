const { getModel } = require('./modelFactory');

const commentSchemaDefinition = {
  blogId: { type: String, required: true },
  parentId: { type: String, default: null }, // for nesting
  author: { type: String, required: true, default: 'Anonymous Visitor' },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  isSpam: { type: Boolean, default: false },
  reported: { type: Boolean, default: false }
};

module.exports = getModel('Comment', commentSchemaDefinition);
