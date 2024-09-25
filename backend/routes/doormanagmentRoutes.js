const express = require('express');
const { addDoor, getDoorsByHouseId } = require('../controllers/doorManagementController');

const router = express.Router();

router.post('/add', addDoor);
router.get('/:houseId', getDoorsByHouseId);

module.exports = router;
