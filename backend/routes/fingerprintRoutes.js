const express = require('express');
const router = express.Router();
const { getFingerprintChallenge, verifyFingerprint } = require('../controllers/fingerprintController');

// Route to get the challenge for fingerprint authentication
router.post('/getChallenge', getFingerprintChallenge);

// Route to verify the fingerprint result
router.post('/verifyFingerprint', verifyFingerprint);

module.exports = router;
