const { getModel } = require('./modelFactory');

const settingsSchemaDefinition = {
  name: { type: String, default: 'Tanjiya Nowrin' },
  title: { type: String, default: 'Competitive Programmer & Software Engineer' },
  bio: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  socials: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  theme: { type: String, default: 'dark' },
  views: { type: Number, default: 0 },
  avatarUrl: { type: String, default: '' },
  achievements: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  interests: [{ type: String }]
};

module.exports = getModel('Settings', settingsSchemaDefinition);
