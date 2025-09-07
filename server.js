const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/music-explosion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Import routes
const registrationRoutes = require('./routes/registration');
const volunteerRoutes = require('./routes/volunteers');
const paymentRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact'); // Handles contact + newsletter

// ✅ Mount routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', contactRoutes); // Includes /contact and /newsletter

// ✅ Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Temporary hardcoded admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'password123';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Music Explosion API is running!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
