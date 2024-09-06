const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authController.registerUser);

// Login Route
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.loginUser);

// Get User (Protected Route)
router.get('/me', authMiddleware, authController.getUser);

module.exports = router;
