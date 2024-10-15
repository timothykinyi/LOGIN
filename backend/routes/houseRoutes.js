const express = require('express');
const { registerHouse, verifyUser } = require('../controllers/houseController');

const router = express.Router();

// Registration Route
router.post('/register', registerHouse);
router.post('/verify', verifyUser);

module.exports = router;
