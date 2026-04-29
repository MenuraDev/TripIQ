const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPasswordRequest, forgotPasswordVerify, forgotPasswordReset, verifyEmail, resendVerification } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password-request', forgotPasswordRequest);
router.post('/forgot-password-verify', forgotPasswordVerify);
router.post('/forgot-password-reset', forgotPasswordReset);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

module.exports = router;
