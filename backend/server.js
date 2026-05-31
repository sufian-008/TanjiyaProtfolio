require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const { connectDB } = require('./config/db');
const User = require('./models/User');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // For local dev flexibility, update in production if needed
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local fallback uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect database and seed admin account
const startServer = async () => {
  try {
    await connectDB();

    // Check if admin user exists, if not seed default admin
    const adminUserCount = await User.countDocuments({ role: 'admin' });
    if (adminUserCount === 0) {
      console.log('No admin user found. Seeding default admin account...');
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        username: adminUsername,
        password: hashedPassword,
        email: 'tanjiya.nowrin@example.com',
        role: 'admin'
      });
      console.log(`Admin account seeded with username: "${adminUsername}" and password: "${adminPassword}"`);
    } else {
      console.log('Admin account already exists.');
    }

    // Mount API Routes
    app.use('/api', apiRoutes);

    // Default route
    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Tanjiya Nowrin Personal Brand API Server',
        status: 'Online',
        dbType: require('./config/db').dbConnection.type
      });
    });

    // Error handler middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
