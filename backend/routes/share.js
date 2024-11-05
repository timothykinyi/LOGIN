const express = require('express');
const router = express.Router();
const { storeSelectedData, getSharedDataByEID } = require('../controllers/shareController');

// Route to share selected data
router.post('/share', storeSelectedData);

// Route to get shared data by eID
router.get('/shared-data/:eID', getSharedDataByEID); // Add this line for fetching shared data

module.exports = router;

  