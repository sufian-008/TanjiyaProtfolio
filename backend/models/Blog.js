const { getModel } = require('./modelFactory');

const blogSchemaDefinition = {
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String, default: '' },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  readTime: { type: Number, default: 5 }
};

module.exports = getModel('Blog', blogSchemaDefinition);
