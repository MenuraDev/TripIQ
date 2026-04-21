const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin, Driver } = require('../models');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a Tourist or Driver
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { role, name, username, email, password, phone, license_no } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: 'Please add all required fields (name, username, email, password)' });
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
                role: 'driver'
            });
        } else {
            newUser = await User.create({
                name,
                username,
                email,
                phone,
                password: hashedPassword,
                role: 'tourist'
            });
        }

        if (newUser) {
            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser.id, newUser.role),
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
        const { email, username, password } = req.body;

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

module.exports = {
    registerUser,
    loginUser,
};
