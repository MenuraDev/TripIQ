// server\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserProfile, requestPasswordChange, verifyPasswordChange } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/profile')
    .get(protect, authorizeRoles('tourist'), getUserProfile)
    .put(protect, authorizeRoles('tourist'), updateUserProfile)
    .delete(protect, authorizeRoles('tourist'), deleteUserProfile);

router.post('/request-password-change', protect, authorizeRoles('tourist'), requestPasswordChange);
router.post('/verify-password-change', protect, authorizeRoles('tourist'), verifyPasswordChange);

module.exports = router;
