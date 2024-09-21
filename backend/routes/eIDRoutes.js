// routes/eIDRoutes.js
const express = require('express');
const router = express.Router();
const eIDController = require('../controllers/eIDController');

// Route to get all allowed eIDs
router.get('/allowed-eids', eIDController.getAllowedEIDs);

// Route to add a new eID
router.post('/allowed-eids', eIDController.addEID);

// Route to delete an eID by its ID
router.delete('/allowed-eids/:eIDToRemove', eIDController.removeEID);

module.exports = router;
