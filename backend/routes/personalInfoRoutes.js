// routes/personalInfoRoutes.js
const express = require('express');
const router = express.Router();
const personalInfoController = require('../controllers/personalInfoController');

router.post('/submit-personal-info', personalInfoController.submitPersonalInfo);

module.exports = router;
