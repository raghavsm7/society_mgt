const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route imports
const authRoutes = require('./src/routes/auth');
const adminRoute=require('./src/routes/admin');
const cashierRoute=require('./src/routes/cashier');
const noticeRoute=require('./src/routes/notice');
const postRoutes = require('./src/routes/posts');
const societyRoutes = require('./src/routes/society');
const vehicleRoutes = require('./src/routes/vehicle');
const guestEntryRoutes = require('./src/routes/guestEntry');
const guardEntryRoutes = require('./src/routes/guardEntry');
const financeRoutes = require('./src/routes/finance');


// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // allowedHeaders: "Content-Type,Authorization",
  exposedHeaders: "Authorization",
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use('/uploads', express.static(path.join('src', 'uploads/')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', postRoutes);  // Route for posts
app.use('/api/admin',adminRoute);
app.use('/api',cashierRoute);
app.use('/api/notice',noticeRoute);
app.use('/api/auth', authRoutes);   // Route for authentication
app.use('/api/societies', societyRoutes);  // Route for societies
app.use('/api/vehicles', vehicleRoutes);  // Route for vehicles
app.use('/api/guest-entries', guestEntryRoutes);  // Route for guest entries
app.use('/api/guard-entries', guardEntryRoutes);  // Route for guard entries
app.use('/api/finance', financeRoutes);  // Route for finance


// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gate Bro API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server listening
const PORT = process.env.PORT || 4000;
app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
