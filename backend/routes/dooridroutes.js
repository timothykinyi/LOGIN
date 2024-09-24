// routes/eIDRoutes.js
const express = require('express');
const router = express.Router();
const DIDController = require('../controllers/dooridcontroller');

// Route to get all allowed eIDs
router.get('/allowed-Dids', DIDController.getAllowedDIDs);

// Route to add a new eID
router.post('/allowed-Dids', DIDController.addDID);

// Route to delete an eID by its ID
router.delete('/allowed-Dids/:DIDToRemove', DIDController.removeDID);

module.exports = router;
