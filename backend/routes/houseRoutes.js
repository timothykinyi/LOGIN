const express = require('express');
const { registerHouse, verifyUser, resendVerificationCode } = require('../controllers/houseController');

const router = express.Router();

// Registration Route
router.post('/register', registerHouse);
router.post('/verify', verifyUser);
router.post('/resendemail', resendVerificationCode);

module.exports = router;
