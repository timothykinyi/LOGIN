const express = require('express');
const { addHouse, getHouses } = require('../controllers/houseController');

const router = express.Router();

router.post('/add', addHouse);
router.get('/', getHouses);

module.exports = router;
