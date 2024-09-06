const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Register Route
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').isString().notEmpty(),
  body('phoneNumber').matches(/^(07|01)\d{8}$/),
  body('dob').isDate(),
  body('address').isString().notEmpty(),
  body('securityQuestion').isString().notEmpty(),
  body('securityAnswer').isString().notEmpty(),
  body('occupation').isString().notEmpty(),
  body('gender').isIn(['male', 'female', 'other']),
  body('maritalStatus').isIn(['single', 'married', 'divorced', 'widowed'])
], authController.registerUser);

// Login Route
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.loginUser);

// Get User (Protected Route)
router.get('/me', authMiddleware, authController.getUser);

module.exports = router;
