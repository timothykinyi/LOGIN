const express = require('express');
const { registerUser, companyregisterUser, compresetPassword, compnewrecoverPassword, login, companyactuallogin, complogin, verifyUser, verifyComp, updateEmail, resendVerificationCode,   resendcompanyVerificationCode, updatecompanEmail, newrecoverPassword, resetPassword, changeusername, changepassword, changephonenumber, changeemail, logout, getUser, getWebAuthnOptions, handleWebAuthnRegistration, storeSelectedData } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/register', registerUser);
router.post('/companyregister', companyregisterUser);
router.post('/login', login);
router.post('/companylogin', companyactuallogin);
router.post('/complogin', complogin);
router.post('/verify', verifyUser);
router.post('/verifycompany', verifyComp);
router.post('/update-email', updateEmail);
router.post('/resendemail', resendVerificationCode);
router.post('/compnewrecoverPassword', compnewrecoverPassword);
router.post('/compresetPassword', compresetPassword);


router.post('/updatecompemail', updatecompanEmail);
router.post('/resendcompemail', resendcompanyVerificationCode);
router.post('/recoverpassword', newrecoverPassword);
router.post('/reset-password', resetPassword);
router.post('/changeusername', changeusername);
router.post('/changepassword', changepassword);
router.post('/changephonenumber', changephonenumber);
router.post('/changeemail', changeemail);
router.post('/store-selected-data', storeSelectedData);
router.post('/logout', logout);
router.get('/me', authMiddleware, getUser);
router.get('/user/:eID', async (req, res) => {
    const { eID } = req.params;
    try {
        const user = await User.findOne({ eID });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// WebAuthn routes
router.get('/webauthn/register-options', getWebAuthnOptions);
router.post('/webauthn/register', handleWebAuthnRegistration);

module.exports = router;
