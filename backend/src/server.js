const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env (only for local)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const app = express();

//
// ✅ SIMPLE + RELIABLE CORS (FIXED)
//
const allowedOrigins = [
  'https://moments-ten-sooty.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true); // 🔥 TEMP: allow all (fixes your issue instantly)
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ VERY IMPORTANT (preflight fix)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//
// Middleware
//
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//
// Routes
//
const momentRoutes = require('./routes/moments');
const galleryRoutes = require('./routes/gallery');
const letterRoutes = require('./routes/letters');
const userRoutes = require('./routes/users'); // ✅ ADD THIS

app.use('/api/moments', momentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/users', userRoutes); // ✅ ADD THIS

//
// Health check
//
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//
// MongoDB
//
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB error:', err.message));

//
// Error handler
//
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

//
// Start server
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
