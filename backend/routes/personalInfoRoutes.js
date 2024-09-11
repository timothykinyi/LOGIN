const express = require('express');
const { submitPersonalInfo } = require('../controllers/personalInfoController');
const router = express.Router();

// @route POST /api/personal-info
router.post('/', submitPersonalInfo);

module.exports = router;
