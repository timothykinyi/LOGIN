const express = require('express');
const router = express.Router();
const { storeSelectedData, getSelectedData } = require('../controllers/shareController');

router.post('/share-data', storeSelectedData); 
router.get('/get-data/:dataID', getSelectedData);

module.exports = router;
