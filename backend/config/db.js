const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const isMongoConfigured = () => {
  return process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '';
};

let dbConnection = {
  isConnected: false,
  type: 'Local JSON File'
};

const JSON_DB_PATH = path.join(__dirname, '../data/db.json');

// Ensure data directory and db.json exist
const initLocalDb = () => {
  const dir = path.dirname(JSON_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultData = {
      users: [],
      projects: [],
      blogs: [],
      comments: [],
      certificates: [],
      experiences: [],
      skills: [],
      olympiads: [],
      gallerys: [],
      researches: [],
      settings: {
        name: "Tanjiya Nowrin",
        title: "Creative Designer & Project Innovator",
        bio: "Designing smart everyday solutions, organizing environmental campaigns, and building sustainable visual systems that merge aesthetic simplicity with practical utility.",
        resumeUrl: "",
        socials: {
          github: "https://github.com/tanjiya",
          linkedin: "https://linkedin.com/in/tanjiya",
          email: "tanjiya.nowrin@example.com",
          facebook: "",
          twitter: ""
        }
      }
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

const readLocalDb = () => {
  initLocalDb();
  const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeLocalDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// Mock Query Class to simulate Mongoose chains (like .sort().limit())
class MockQuery {
  constructor(dataPromise) {
    this.promise = dataPromise;
  }
  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
  sort(sortObj) {
    this.promise = this.promise.then(items => {
      if (!items || !Array.isArray(items)) return items;
      const sorted = [...items];
      const keys = Object.keys(sortObj);
      if (keys.length > 0) {
        const key = keys[0];
        const desc = sortObj[key] === -1 || sortObj[key] === 'desc';
        sorted.sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          if (typeof valA === 'string') {
            return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
          }
          return desc ? valB - valA : valA - valB;
        });
      }
      return sorted;
    });
    return this;
  }
  limit(num) {
    this.promise = this.promise.then(items => {
      if (!items || !Array.isArray(items)) return items;
      return items.slice(0, num);
    });
    return this;
  }
  skip(num) {
    this.promise = this.promise.then(items => {
      if (!items || !Array.isArray(items)) return items;
      return items.slice(num);
    });
    return this;
  }
  select() { return this; }
  populate() { return this; }
}

// Generate Mock Model corresponding to MongoDB collections
const createMockModel = (collectionName) => {
  return {
    find: (query = {}) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      // Simple filter logic
      if (Object.keys(query).length > 0) {
        items = items.filter(item => {
          return Object.keys(query).every(key => {
            if (query[key] === undefined) return true;
            if (query[key] && typeof query[key] === 'object' && query[key].$ne !== undefined) {
              return item[key] !== query[key].$ne;
            }
            return String(item[key]) === String(query[key]);
          });
        });
      }
      return new MockQuery(Promise.resolve(items));
    },
    findOne: (query = {}) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      const item = items.find(item => {
        return Object.keys(query).every(key => String(item[key]) === String(query[key]));
      });
      return Promise.resolve(item || null);
    },
    findById: (id) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      const item = items.find(item => String(item._id) === String(id));
      return Promise.resolve(item || null);
    },
    create: (data) => {
      const db = readLocalDb();
      if (!db[collectionName]) db[collectionName] = [];
      
      const newDoc = {
        _id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      
      db[collectionName].push(newDoc);
      writeLocalDb(db);
      return Promise.resolve(newDoc);
    },
    findByIdAndUpdate: (id, update, options = {}) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      const idx = items.findIndex(item => String(item._id) === String(id));
      
      if (idx === -1) return Promise.resolve(null);
      
      const updatedDoc = {
        ...items[idx],
        ...update,
        updatedAt: new Date().toISOString()
      };
      
      items[idx] = updatedDoc;
      db[collectionName] = items;
      writeLocalDb(db);
      return Promise.resolve(updatedDoc);
    },
    findByIdAndDelete: (id) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      const idx = items.findIndex(item => String(item._id) === String(id));
      
      if (idx === -1) return Promise.resolve(null);
      
      const deleted = items[idx];
      items.splice(idx, 1);
      db[collectionName] = items;
      writeLocalDb(db);
      return Promise.resolve(deleted);
    },
    countDocuments: (query = {}) => {
      const db = readLocalDb();
      let items = db[collectionName] || [];
      if (Object.keys(query).length > 0) {
        items = items.filter(item => {
          return Object.keys(query).every(key => String(item[key]) === String(query[key]));
        });
      }
      return Promise.resolve(items.length);
    }
  };
};

const seedMongoDb = async () => {
  try {
    const Project = require('../models/Project');
    const Blog = require('../models/Blog');
    const Certificate = require('../models/Certificate');
    const Experience = require('../models/Experience');
    const Gallery = require('../models/Gallery');
    const Research = require('../models/Research');
    const Settings = require('../models/Settings');
    const fs = require('fs');
    const path = require('path');

    const dbJsonPath = path.join(__dirname, '../data/db.json');
    if (!fs.existsSync(dbJsonPath)) return;
    
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

    // Clear fake data from MongoDB Atlas as requested
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await Certificate.deleteMany({});
    await Gallery.deleteMany({});
    await Research.deleteMany({});
    console.log('Cleared mock Projects, Blogs, Certificates, Gallery items, and Research papers from MongoDB Atlas.');

    // 1. Settings (About Page Biography)
    await Settings.deleteMany({});
    if (dbData.settings) {
      await Settings.create(dbData.settings);
      console.log('Seeded About Page Settings to MongoDB Atlas.');
    }

    // 2. Experiences (About Page timelines)
    await Experience.deleteMany({});
    if (dbData.experiences && dbData.experiences.length > 0) {
      const cleaned = dbData.experiences.map(({ _id, ...rest }) => rest);
      await Experience.create(cleaned);
      console.log('Seeded About Page Experiences to MongoDB Atlas.');
    }

    // 3. Skills
    const Skill = require('../models/Skill');
    await Skill.deleteMany({});
    if (dbData.skills && dbData.skills.length > 0) {
      const cleaned = dbData.skills.map(({ _id, ...rest }) => rest);
      await Skill.create(cleaned);
      console.log('Seeded Skills to MongoDB Atlas.');
    }

  } catch (err) {
    console.error('Error seeding MongoDB Atlas:', err.message);
  }
};

const connectDB = async () => {
  if (isMongoConfigured()) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      dbConnection.isConnected = true;
      dbConnection.type = 'MongoDB Atlas';
      console.log('Database connected successfully: MongoDB Atlas');
      await seedMongoDb();
    } catch (err) {
      console.error('MongoDB connection failed. Falling back to local JSON database.', err.message);
      initLocalDb();
      dbConnection.isConnected = true;
      dbConnection.type = 'Local JSON File (Fallback)';
    }
  } else {
    console.log('No MONGO_URI configured. Running with Local JSON Database.');
    initLocalDb();
    dbConnection.isConnected = true;
    dbConnection.type = 'Local JSON File';
  }
};

module.exports = {
  connectDB,
  dbConnection,
  isMongoConfigured,
  createMockModel
};
