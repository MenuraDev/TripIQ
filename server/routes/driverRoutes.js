// server\routes\driverRoutes.js
const express = require('express');
const router = express.Router();
const { getDriverProfile, updateDriverProfile, updateDriverAvailability, deleteDriverProfile } = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/profile')
    .get(protect, authorizeRoles('driver'), getDriverProfile)
    .put(protect, authorizeRoles('driver'), updateDriverProfile)
    .delete(protect, authorizeRoles('driver'), deleteDriverProfile);

router.put('/availability', protect, authorizeRoles('driver'), updateDriverAvailability);

module.exports = router;
