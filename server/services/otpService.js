// server\services\otpService.js
const crypto = require('crypto');

// Generate a secure 6-digit OTP
const generateOTP = () => {
    // Generate a cryptographically secure random number between 100000 and 999999
    const otp = crypto.randomInt(100000, 1000000).toString();
    return otp;
};

// Hash the OTP for secure storage
const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

// Verify OTP against hash
const verifyOTP = (otp, hash) => {
    const hashedOTP = hashOTP(otp);
    return hashedOTP === hash;
};

module.exports = {
    generateOTP,
    hashOTP,
    verifyOTP,
};
