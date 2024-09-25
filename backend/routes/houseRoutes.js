const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

// Route to register a new house
router.post('/register', houseController.registerHouse);

// Route to get all houses
router.get('/', houseController.getAllHouses);

module.exports = router;
