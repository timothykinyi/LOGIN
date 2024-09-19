// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register-options', authController.getRegistrationOptions);
router.post('/register', authController.registerUser);
router.post('/login-options', authController.getLoginOptions);
router.post('/login', authController.loginUser);

module.exports = router;
