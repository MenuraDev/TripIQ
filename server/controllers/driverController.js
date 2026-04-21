// server\controllers\driverController.js
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private (Driver)
const getDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update driver profile (and handle password change if first login or anytime)
// @route   PUT /api/drivers/profile
// @access  Private (Driver)
const updateDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.user.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.name = req.body.name || driver.name;
        driver.phone = req.body.phone || driver.phone;
        driver.username = req.body.username || driver.username;
        driver.dob = req.body.dob || driver.dob;
        driver.license_no = req.body.license_no || driver.license_no;
        if (req.body.profile_image !== undefined) {
            driver.profile_image = req.body.profile_image;
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            driver.password = await bcrypt.hash(req.body.password, salt);
        }

        await driver.save();
        res.json({
            id: driver.id,
            username: driver.username,
            name: driver.name,
            phone: driver.phone,
            license_no: driver.license_no,
            dob: driver.dob,
            profile_image: driver.profile_image,
            status: driver.status,
            role: driver.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update driver availability
// @route   PUT /api/drivers/availability
// @access  Private (Driver)
const updateDriverAvailability = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.user.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        driver.status = req.body.status || driver.status;

        await driver.save();
        res.json({ id: driver.id, status: driver.status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete driver profile
// @route   DELETE /api/drivers/profile
// @access  Private (Driver)
const deleteDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.user.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Note: Driver deletion might need to handle associated vehicles or bookings
        // For now, we perform a standard destroy.
        await driver.destroy();
        res.json({ message: 'Driver account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDriverProfile,
    updateDriverProfile,
    updateDriverAvailability,
    deleteDriverProfile
};
