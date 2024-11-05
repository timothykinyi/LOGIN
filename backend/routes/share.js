const express = require('express');
const router = express.Router();
const { shareData, getData } = require('../controllers/shareController');

router.post('/share-data', shareData); // Endpoint to create a new data share
router.get('/get-data/:dataID', getData); // Endpoint to retrieve shared data

module.exports = router;
