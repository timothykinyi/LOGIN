const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


// Import routes
const authRoutes = require('./routes/auth');
const personalInfoRoutes = require('./routes/personalInfoRoutes');
const educationRoutes = require('./routes/educationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const healthRoutes = require('./routes/healthRoutes');
const employmentRoutes = require('./routes/employment');
const financialRoutes = require('./routes/financialRoutes');
const socialFamilyRoutes = require('./routes/socialFamily');
const preferencesRoutes = require('./routes/preferencesRoutes');
const legalInfoRoutes = require('./routes/legalInfoRoutes');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/personal-info', personalInfoRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/employment', employmentRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/social-family', socialFamilyRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/legalinfo', legalInfoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
