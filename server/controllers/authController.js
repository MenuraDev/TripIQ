const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const { User, Admin, Driver, VerificationCode } = require('../models');
const { sendVerificationEmail, validateEmail } = require('../services/emailService');
const { generateOTP, hashOTP } = require('../services/otpService');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        
        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY is not configured in environment variables');
            return { success: false, message: 'reCAPTCHA configuration error' };
        }

        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secretKey,
                    response: token
                }
            }
        );

        const { success, score, 'error-codes': errorCodes } = response.data;

        if (!success) {
            console.error('reCAPTCHA verification failed:', errorCodes);
            return { 
                success: false, 
                message: 'reCAPTCHA verification failed. Please try again.' 
            };
        }

        // For v2 checkbox, we check success only (score is for v3)
        // But if score exists and is very low, we might want to reject
        if (score !== undefined && score < 0.5) {
            return { 
                success: false, 
                message: 'reCAPTCHA score too low. Please try again.' 
            };
        }

        return { success: true };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        return { 
            success: false, 
            message: 'Unable to verify reCAPTCHA. Please try again.' 
        };
    }
};

// @desc    Register a Tourist or Driver
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { role, name, username, email, password, phone, license_no, recaptchaToken } = req.body;

        // Verify reCAPTCHA first
        if (!recaptchaToken) {
            return res.status(400).json({ message: 'Please complete the reCAPTCHA verification' });
        }

        const captchaVerification = await verifyRecaptcha(recaptchaToken);
        if (!captchaVerification.success) {
            return res.status(400).json({ message: captchaVerification.message });
        }

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: 'Please add all required fields (name, username, email, password)' });
        }

        // Validate email (format, disposable check, MX record)
        const emailValidation = await validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({
                message: 'Invalid email address',
                errors: emailValidation.errors
            });
        }

        const registrationRole = role === 'driver' ? 'driver' : 'tourist';

        // Check if user already exists based on email or username
        let userExists;
        if (registrationRole === 'driver') {
            userExists = await Driver.findOne({ where: { email } });
            if (!userExists) userExists = await Driver.findOne({ where: { username } });
        } else {
            userExists = await User.findOne({ where: { email } });
            if (!userExists) userExists = await User.findOne({ where: { username } });
        }
        
        if (userExists) {
            return res.status(400).json({ message: 'User or Driver with this email or username already exists' });
        }

        if (registrationRole === 'driver' && !license_no) {
            return res.status(400).json({ message: 'Driver must provide a license number' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        if (registrationRole === 'driver') {
            newUser = await Driver.create({
                name,
                username,
                email,
                phone,
                license_no,
                password: hashedPassword,
                status: 'available',
                role: 'driver',
                email_verified: false
            });
        } else {
            newUser = await User.create({
                name,
                username,
                email,
                phone,
                password: hashedPassword,
                role: 'tourist',
                email_verified: false
            });
        }

        if (newUser) {
            // Generate and send verification code
            const otp = generateOTP();
            const hashedOTP = hashOTP(otp);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await VerificationCode.create({
                email,
                code: hashedOTP,
                purpose: 'registration',
                expires_at: expiresAt,
                used: false,
            });

            // Send verification email
            await sendVerificationEmail(email, otp, 'registration');

            // Don't auto-login
            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                email_verified: newUser.email_verified,
                token: generateToken(newUser.id, newUser.role),
                message: 'Registration successful! Please check your email to verify your account.',
                requires_verification: true
            });
        } else {
            res.status(400).json({ message: 'Invalid registration data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Login for ALL roles (Tourist, Admin, Driver)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        // For admins/drivers we might use username instead of email, so we accept generic "identifier"
        const { email, username, password, recaptchaToken } = req.body;

        // Verify reCAPTCHA first
        if (!recaptchaToken) {
            return res.status(400).json({ message: 'Please complete the reCAPTCHA verification' });
        }

        const captchaVerification = await verifyRecaptcha(recaptchaToken);
        if (!captchaVerification.success) {
            return res.status(400).json({ message: captchaVerification.message });
        }

        if (!password || (!email && !username)) {
            return res.status(400).json({ message: 'Please provide credentials' });
        }

        let user = null;
        let role = '';

        // 1. Check if Tourist (by email)
        if (email) {
            user = await User.findOne({ where: { email } });
            if (user) role = 'tourist';
        }

        // 2. Check if Admin (by username or email)
        if (!user) {
            user = await Admin.findOne({
                where: username ? { username } : { email }
            });
            if (user) role = 'admin';
        }

        // 3. Check if Driver (by username)
        if (!user && username) {
            user = await Driver.findOne({ where: { username } });
            if (user) role = 'driver';
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if email is verified for tourists and drivers
        if ((role === 'tourist' || role === 'driver') && !user.email_verified) {
            // Resend verification code
            const otp = generateOTP();
            const hashedOTP = hashOTP(otp);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Invalidate old codes
            await VerificationCode.update(
                { used: true },
                { where: { email: user.email, purpose: 'registration', used: false } }
            );

            await VerificationCode.create({
                email: user.email,
                code: hashedOTP,
                purpose: 'registration',
                expires_at: expiresAt,
                used: false,
            });

            await sendVerificationEmail(user.email, otp, 'registration');

            return res.status(403).json({
                message: 'Please verify your email before logging in. A new verification code has been sent to your email.',
                requires_verification: true,
                email: user.email
            });
        }

        // Check Password matching
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name || user.username,
                username: user.username,
                email: user.email || '',
                phone: user.phone,
                dob: user.dob,
                profile_image: user.profile_image,
                role: role,
                email_verified: user.email_verified,
                token: generateToken(user.id, role),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server login error' });
    }
};

// @desc    Forgot Password - Request verification code
// @route   POST /api/auth/forgot-password-request
// @access  Public
const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address' });
        }

        // Check if user exists (only for tourists)
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // For security, don't reveal if email exists or not
            return res.status(200).json({ 
                message: 'If an account exists with this email, a verification code has been sent.' 
            });
        }

        // Invalidate any existing unused codes for this email
        await VerificationCode.update(
            { used: true },
            { where: { email, purpose: 'forgot_password', used: false } }
        );

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        // Set expiration time (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store verification code in database
        await VerificationCode.create({
            email,
            code: hashedOTP,
            purpose: 'forgot_password',
            expires_at: expiresAt,
            used: false,
        });

        // Send email with verification code
        await sendVerificationEmail(email, otp, 'forgot_password');

        res.status(200).json({
            message: 'Verification code sent to your email. Please check your inbox.',
            expires_in: '10 minutes',
        });
    } catch (error) {
        console.error('Forgot password request error:', error.message);
        res.status(500).json({ message: 'Server error while processing forgot password request' });
    }
};

// @desc    Forgot Password - Verify code
// @route   POST /api/auth/forgot-password-verify
// @access  Public
const forgotPasswordVerify = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Please provide email and verification code' });
        }

        // Find the verification code
        const verificationRecord = await VerificationCode.findOne({
            where: {
                email,
                purpose: 'forgot_password',
                used: false,
            },
            order: [['createdAt', 'DESC']],
        });

        if (!verificationRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Check if code has expired
        if (new Date() > verificationRecord.expires_at) {
            await verificationRecord.update({ used: true });
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Verify the OTP
        const hashedInput = hashOTP(code);
        if (hashedInput !== verificationRecord.code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        res.status(200).json({
            message: 'Verification code validated successfully. You can now reset your password.',
            verified: true,
        });
    } catch (error) {
        console.error('Forgot password verify error:', error.message);
        res.status(500).json({ message: 'Server error while verifying code' });
    }
};

// @desc    Forgot Password - Reset password
// @route   POST /api/auth/forgot-password-reset
// @access  Public
const forgotPasswordReset = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, verification code, and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find and verify the verification code (allow used codes since we just verified in previous step)
        const verificationRecord = await VerificationCode.findOne({
            where: {
                email,
                purpose: 'forgot_password',
                used: false,
            },
            order: [['createdAt', 'DESC']],
        });

        if (!verificationRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Check if code has already been used
        if (verificationRecord.used) {
            return res.status(400).json({ message: 'Verification code has already been used' });
        }

        // Check if code has expired
        if (new Date() > verificationRecord.expires_at) {
            await verificationRecord.update({ used: true });
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        // Verify the OTP
        const hashedInput = hashOTP(code);
        if (hashedInput !== verificationRecord.code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Find the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await user.update({ password: hashedPassword });

        // Mark verification code as used
        await verificationRecord.update({ used: true });

        res.status(200).json({
            message: 'Password reset successfully. You can now login with your new password.',
            success: true,
        });
    } catch (error) {
        console.error('Forgot password reset error:', error.message);
        res.status(500).json({ message: 'Server error while resetting password' });
    }
};

// @desc    Verify registration email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Please provide email and verification code' });
        }

        // Find the verification code
        const verificationRecord = await VerificationCode.findOne({
            where: {
                email,
                purpose: 'registration',
                used: false,
            },
            order: [['createdAt', 'DESC']],
        });

        if (!verificationRecord) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Check if code has expired
        if (new Date() > verificationRecord.expires_at) {
            await verificationRecord.update({ used: true });
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Verify the OTP
        const hashedInput = hashOTP(code);
        if (hashedInput !== verificationRecord.code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Mark user/driver as verified
        let user = await User.findOne({ where: { email } });
        let isDriver = false;

        if (!user) {
            user = await Driver.findOne({ where: { email } });
            isDriver = true;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update email_verified status
        await user.update({ email_verified: true });

        // Mark verification code as used
        await verificationRecord.update({ used: true });

        res.status(200).json({
            message: 'Email verified successfully! You can now log in.',
            verified: true,
            email_verified: true
        });
    } catch (error) {
        console.error('Email verification error:', error.message);
        res.status(500).json({ message: 'Server error while verifying email' });
    }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        let isDriver = false;

        if (!user) {
            user = await Driver.findOne({ where: { email } });
            isDriver = true;
        }

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Check if already verified
        if (user.email_verified) {
            return res.status(400).json({ message: 'Email is already verified. You can log in.' });
        }

        // Invalidate any existing unused codes for this email
        await VerificationCode.update(
            { used: true },
            { where: { email, purpose: 'registration', used: false } }
        );

        // Generate new OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        // Set expiration time (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store verification code in database
        await VerificationCode.create({
            email,
            code: hashedOTP,
            purpose: 'registration',
            expires_at: expiresAt,
            used: false,
        });

        // Send email with verification code
        await sendVerificationEmail(email, otp, 'registration');

        res.status(200).json({
            message: 'Verification code sent to your email. Please check your inbox.',
            expires_in: '10 minutes',
        });
    } catch (error) {
        console.error('Resend verification error:', error.message);
        res.status(500).json({ message: 'Server error while sending verification code' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPasswordRequest,
    forgotPasswordVerify,
    forgotPasswordReset,
    verifyEmail,
    resendVerification,
    verifyRecaptcha, // Export for testing purposes if needed
};
