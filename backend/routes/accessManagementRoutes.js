const express = require('express');
const { grantAccess, getAccessByDoor } = require('../controllers/accessManagementController');

const router = express.Router();

router.post('/grant', grantAccess); // Grant access to a user for a door
router.get('/door/:doorId', getAccessByDoor); // Get access by door ID

module.exports = router;
