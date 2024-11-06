const express = require('express');
const router = express.Router();
const { storeSelectedData, retrieveSelectedData } = require('../controllers/shareController');

router.post('/share-data', storeSelectedData); 
router.get('/get-data/:dataID', retrieveSelectedData);

module.exports = router;
