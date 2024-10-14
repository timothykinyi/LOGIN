const express = require('express');
const { registerHouse } = require('../controllers/houseController');

const router = express.Router();

// Registration Route
router.post('/register', registerHouse);

module.exports = router;
