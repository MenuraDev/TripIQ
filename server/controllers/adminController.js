const Admin = require('../models/Admin');
const User = require('../models/User');
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
const updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.user.id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.username = req.body.username || admin.username;
        admin.name = req.body.name || admin.name;
        admin.email = req.body.email || admin.email;
        admin.phone = req.body.phone || admin.phone;
        admin.dob = req.body.dob || admin.dob;
        admin.profile_image = req.body.profile_image || admin.profile_image;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(req.body.password, salt);
        }

        await admin.save();
        res.json({
            id: admin.id,
            username: admin.username,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            dob: admin.dob,
            profile_image: admin.profile_image,
            role: admin.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new admin
// @route   POST /api/admin/admins
// @access  Private (Admin Only)
const createAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if admin exists
        const adminExists = await Admin.findOne({ where: { username } });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        if (admin) {
            res.status(201).json({
                message: 'Admin account created successfully',
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all drivers
// @route   GET /api/admin/drivers
// @access  Private (Admin)
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll({ attributes: { exclude: ['password'] } });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new driver
// @route   POST /api/admin/drivers
// @access  Private (Admin)
const createDriver = async (req, res) => {
    try {
        const { username, email, name, phone, password, license_no } = req.body;

        if (!username || !email || !name || !phone || !password || !license_no) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const driverExists = await Driver.findOne({ where: { username } });
        if (driverExists) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const driver = await Driver.create({
            username,
            email,
            name,
            phone,
            password: hashedPassword,
            license_no,
            status: 'available',
            role: 'driver'
        });

        if (driver) {
            res.status(201).json({
                message: 'Driver account created successfully',
                id: driver.id,
                username: driver.username,
                email: driver.email,
                name: driver.name,
                role: driver.role
            });
        } else {
            res.status(400).json({ message: 'Invalid driver data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete driver
// @route   DELETE /api/admin/drivers/:id
// @access  Private (Admin)
const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.destroy();
        res.json({ message: 'Driver removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private (Admin)
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({ attributes: { exclude: ['password'] } });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update admin (by ID)
// @route   PUT /api/admin/admins/:id
// @access  Private (Admin)
const updateAdmin = async (req, res) => {
    try {
        const adminToUpdate = await Admin.findByPk(req.params.id);

        if (!adminToUpdate) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // CRITICAL PROTECTION: Block ANY changes to the root system admin by other admins
        if (adminToUpdate.username === 'admin') {
            return res.status(403).json({ message: 'The default system admin account cannot be modified via this management endpoint.' });
        }

        adminToUpdate.username = req.body.username || adminToUpdate.username;
        adminToUpdate.email = req.body.email || adminToUpdate.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            adminToUpdate.password = await bcrypt.hash(req.body.password, salt);
        }

        await adminToUpdate.save();
        res.json({
            id: adminToUpdate.id,
            username: adminToUpdate.username,
            email: adminToUpdate.email,
            role: adminToUpdate.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Private (Admin)
const deleteAdmin = async (req, res) => {
    try {
        const adminToDelete = await Admin.findByPk(req.params.id);

        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (adminToDelete.username === 'admin') {
            return res.status(403).json({ message: 'Cannot delete the default system admin account.' });
        }

        if (adminToDelete.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete yourself from this list. Use the profile settings instead.' });
        }

        await adminToDelete.destroy();
        res.json({ message: 'Admin account removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete admin's own profile
// @route   DELETE /api/admin/profile
// @access  Private (Admin)
const deleteAdminProfile = async (req, res) => {
    try {
        const adminToDelete = await Admin.findByPk(req.user.id);

        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (adminToDelete.username === 'admin') {
            return res.status(403).json({ message: 'Cannot delete the default root system admin account' });
        }

        await adminToDelete.destroy();
        res.json({ message: 'Your admin account has been removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAdminProfile,
    updateAdminProfile,
    deleteAdminProfile,
    createAdmin,
    getAllUsers,
    deleteUser,
    getAllDrivers,
    createDriver,
    deleteDriver,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};
