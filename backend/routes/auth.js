const express = require('express');
const { registerUser, login, verifyUser, updateEmail, resendVerificationCode, newrecoverPassword, resetPassword, changeusername, changepassword, changephonenumber, changeemail, logout, getUser} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify', verifyUser)
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changeusername', changeusername);
router.post('/changepassword', changepassword);
router.post('/changephonenumber', changephonenumber);
router.post('/changeemail', changeemail);
router.post('/logout', logout);
router.get('/me', authMiddleware, getUser);

module.exports = router;
