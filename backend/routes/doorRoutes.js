// routes/doorRoutes.js

const express = require('express');
const router = express.Router();
const doorController = require('../controllers/doorController');

// Route to compare eID and return access code
router.post('/compare-eid', doorController.compareEID);

module.exports = router;
