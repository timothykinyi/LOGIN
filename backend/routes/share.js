const express = require('express');
const router = express.Router();
const { storeSelectedData, getData } = require('../controllers/shareController');

router.post('/share-data', storeSelectedData); 
router.get('/get-data/:dataID', getData);

module.exports = router;
