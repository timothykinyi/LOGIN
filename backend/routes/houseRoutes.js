const express = require('express');
const { registerHouse, verifyUser, resendVerificationCode, getHouseDetails, updateDoorAccess, removeUserFromDoor, getHousesByOwnerEID } = require('../controllers/houseController');

const router = express.Router();

// Registration Route
router.post('/register', registerHouse);
router.post('/verify', verifyUser);
router.post('/resendemail', resendVerificationCode);
router.get('/:HID', getHouseDetails);
router.put('/:HID/doors/:doorId', updateDoorAccess);
router.delete('/:HID/doors/:doorId/users/:userEID', removeUserFromDoor);
router.post('/owner', getHousesByOwnerEID);

module.exports = router;
