// server\controllers\userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};
