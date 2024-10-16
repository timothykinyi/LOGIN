const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();



// Import routes
const authRoutes = require('./routes/auth');
const notificationsRoutes = require('./routes/notifications');
const personalInfoRoutes = require('./routes/personalInfoRoutes');
const educationRoutes = require('./routes/educationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const healthRoutes = require('./routes/healthRoutes');
const employmentRoutes = require('./routes/employment');
const financialRoutes = require('./routes/financialRoutes');
const socialFamilyRoutes = require('./routes/socialFamily');
const preferencesRoutes = require('./routes/preferencesRoutes');
const doorRoutes = require('./routes/doorRoutes');
const eIDRoutes = require('./routes/eIDRoutes');
const DIDRoutes = require('./routes/dooridroutes');
const houseRoutes = require('./routes/houseRoutes');
const doorManagmentRoutes = require('./routes/doormanagmentRoutes');
const accessManagementRoutes = require('./routes/accessManagementRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const fingerprintRoutes = require('./routes/fingerprintRoutes');
const shareRoutes = require('./routes/share');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.use('/door', doorRoutes);
app.use('/door/eID', eIDRoutes);
app.use('/door/dID', DIDRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/doors', doorManagmentRoutes);
app.use('/api/access', accessManagementRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/subs', subscriptionRoutes);
app.use('/auth', fingerprintRoutes);
app.use('/api/shared', shareRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
