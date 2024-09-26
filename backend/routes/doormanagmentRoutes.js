const express = require('express');
const { getDoorsByHouse, addDoor } = require('../controllers/doorManagementController');

const router = express.Router();

router.get('/:houseId', getDoorsByHouse); // Get doors by house ID
router.post('/add', addDoor); // Add a new door to a house

module.exports = router;
