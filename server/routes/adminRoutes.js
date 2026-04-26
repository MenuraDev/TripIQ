const express = require('express');
const router = express.Router();
const {
    getAdminProfile,
    updateAdminProfile,
    deleteAdminProfile,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    getAllUsers,
    deleteUser,
    getAllDrivers,
    createDriver,
    deleteDriver
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Base route: /api/admin

router.route('/profile')
    .get(protect, authorizeRoles('admin'), getAdminProfile)
    .put(protect, authorizeRoles('admin'), updateAdminProfile)
    .delete(protect, authorizeRoles('admin'), deleteAdminProfile);

// Admins Management
router.route('/admins')
    .get(protect, authorizeRoles('admin'), getAllAdmins)
    .post(protect, authorizeRoles('admin'), createAdmin);

router.route('/admins/:id')
    .put(protect, authorizeRoles('admin'), updateAdmin)
    .delete(protect, authorizeRoles('admin'), deleteAdmin);

// Users Management
router.route('/users')
    .get(protect, authorizeRoles('admin'), getAllUsers);
router.route('/users/:id')
    .delete(protect, authorizeRoles('admin'), deleteUser);

// Drivers Management
router.route('/drivers')
    .get(protect, authorizeRoles('admin'), getAllDrivers)
    .post(protect, authorizeRoles('admin'), createDriver);
router.route('/drivers/:id')
    .delete(protect, authorizeRoles('admin'), deleteDriver);

module.exports = router;
