const express = require('express');
const router = express.Router();

const {register, userExists, resendOTP, verifyUser, login, resetPasswordEmail, resetPassword} = require('../controllers/Auth');
const { auth } = require('../middleware/Auth');

router.post('/register', register);
router.post('/userExist', userExists);
router.post('/verify', auth, verifyUser);
router.get('/resendOTP', auth, resendOTP);
router.post('/login', login);
router.post('/resetPasswordEmail', resetPasswordEmail);
router.post('/resetPassword', resetPassword);
// router.post('/registerGoogle', registerWithGoogle);
// router.post('/loginGoogle', loginWithGoogle);
// router.post('/checkMobileStatus', checkMobileStatus);
// router.post('/updateMobileStatus', updateMobileStatus);
// router.post('/getMobileCode', getMobileCode);
// router.post('/verifyMobile', verifyMobile);

module.exports = router;