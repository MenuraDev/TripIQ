const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, driver } = require('../middleware/authMiddleware');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = 'destinations';
        if (req.originalUrl.includes('vehicle')) type = 'vehicles';
        if (req.originalUrl.includes('profile')) type = 'profiles';
        cb(null, `uploads/${type}/`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    }
});

// @desc    Upload vehicle image
// @route   POST /api/upload/vehicle
// @access  Driver
router.post('/vehicle', protect, driver, upload.single('vehicleImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/vehicles/${req.file.filename}`;
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl
    });
});

// @desc    Upload destination image
// @route   POST /api/upload/destination
// @access  Admin
const { admin } = require('../middleware/authMiddleware');
router.post('/destination', protect, admin, upload.single('destImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/destinations/${req.file.filename}`;
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl
    });
});

// @desc    Upload profile image
// @route   POST /api/upload/profile
// @access  Protected
router.post('/profile', protect, upload.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    res.status(200).json({
        message: 'Profile image uploaded successfully',
        imageUrl: imageUrl
    });
});

module.exports = router;
