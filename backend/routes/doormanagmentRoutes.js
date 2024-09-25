const express = require('express');
const router = express.Router();
const doorManagementController = require('../controllers/doorManagementController'); // Updated import

// Route to add a new door
router.post('/add', doorManagementController.addDoor);

// Route to get all doors for a specific house
router.get('/:houseId', doorManagementController.getDoorsByHouseId);

module.exports = router;
