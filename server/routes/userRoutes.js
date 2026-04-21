// server\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/profile')
    .get(protect, authorizeRoles('tourist'), getUserProfile)
    .put(protect, authorizeRoles('tourist'), updateUserProfile)
    .delete(protect, authorizeRoles('tourist'), deleteUserProfile);

module.exports = router;
