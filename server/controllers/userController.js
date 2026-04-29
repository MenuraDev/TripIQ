// server\controllers\userController.js
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../services/emailService');
const { generateOTP, hashOTP } = require('../services/otpService');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Tourist)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Tourist)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.dob = req.body.dob || user.dob;
        user.profile_image = req.body.profile_image || user.profile_image;

        // Handle password update
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();
        res.json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
            profile_image: user.profile_image,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private (Tourist)
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Request password change verification code
// @route   POST /api/users/request-password-change
// @access  Private (Tourist)
const requestPasswordChange = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Invalidate any existing unused codes for this email
        await VerificationCode.update(
            { used: true },
            { where: { email: user.email, purpose: 'change_password', used: false } }
        );

        // Generate OTP
        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        // Set expiration time (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store verification code in database
        await VerificationCode.create({
            email: user.email,
            code: hashedOTP,
            purpose: 'change_password',
            expires_at: expiresAt,
            used: false,
        });

        // Send email with verification code
        await sendVerificationEmail(user.email, otp, 'change_password');

        res.status(200).json({
            message: 'Verification code sent to your email. Please check your inbox.',
            expires_in: '10 minutes',
        });
    } catch (error) {
        console.error('Request password change error:', error.message);
        res.status(500).json({ message: 'Server error while requesting password change' });
    }
};

// @desc    Verify password change code and update password
// @route   POST /api/users/verify-password-change
// @access  Private (Tourist)
const verifyPasswordChange = async (req, res) => {
    try {
        const { code, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!code || !newPassword) {
            return res.status(400).json({ message: 'Please provide verification code and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find the verification code
        const verificationRecord = await VerificationCode.findOne({
            where: {
                email: user.email,
                purpose: 'change_password',
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

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await user.update({ password: hashedPassword });

        // Mark verification code as used
        await verificationRecord.update({ used: true });

        res.status(200).json({
            message: 'Password changed successfully',
            success: true,
        });
    } catch (error) {
        console.error('Verify password change error:', error.message);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    requestPasswordChange,
    verifyPasswordChange
};
