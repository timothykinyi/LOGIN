const express = require('express');
const router = express.Router();
const DIDController = require('../controllers/dooridcontroller');

// Route to get all allowed door IDs
router.get('/allowed-dids', DIDController.getAllowedDIDs);

router.post('/check-eid', DIDController.getAllowedDIDs);

// Route to add a new door ID
router.post('/allowed-dids', DIDController.addDID);

// Route to delete a door ID by its ID
router.delete('/allowed-dids/:id', DIDController.removeDID);

module.exports = router;
