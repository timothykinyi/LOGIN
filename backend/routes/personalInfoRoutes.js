const express = require('express');
const { submitPersonalInfo, getAllPersonalInfo } = require('../controllers/personalInfoController');
const router = express.Router();

// @route POST /api/personal-info
router.post('/', submitPersonalInfo);

// @route GET /api/personal-info
router.get('/', getAllPersonalInfo);

module.exports = router;
