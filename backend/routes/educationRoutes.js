const express = require('express');
const { addEducation, getAllEducation } = require('../controllers/educationController');
const router = express.Router();

// Route to add new education entry
router.post('/add', addEducation);

// Route to get all education entries
router.get('/', getAllEducation);

module.exports = router;
