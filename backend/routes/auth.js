const express = require('express');
const { registerUser, companyregisterUser, login, verifyUser, verifyComp, updateEmail, resendVerificationCode,   resendcompanyVerificationCode, updatecompanEmail, newrecoverPassword, resetPassword, changeusername, changepassword, changephonenumber, changeemail, logout, getUser, getWebAuthnOptions, handleWebAuthnRegistration } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/companyregister', companyregisterUser);
router.post('/login', login);
router.post('/verify', verifyUser);
router.post('/verifycompany', verifyComp);
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/updatecompemail', updatecompanEmail);
router.post('/resendcompemail', resendcompanyVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changeusername', changeusername);
router.post('/changepassword', changepassword);
router.post('/changephonenumber', changephonenumber);
router.post('/changeemail', changeemail);
router.post('/logout', logout);
router.get('/me', authMiddleware, getUser);

// WebAuthn routes
router.get('/webauthn/register-options', getWebAuthnOptions);
router.post('/webauthn/register', handleWebAuthnRegistration);

module.exports = router;
