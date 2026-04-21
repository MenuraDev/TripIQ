// server\routes\vehicleRoutes.js
const express = require('express');
const router = express.Router();
const { getAllVehicles, getMyVehicles, addVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, driver } = require('../middleware/authMiddleware');

// Public route for tourists to view available vehicles
router.get('/all', getAllVehicles);

// Protected routes for drivers managing their assigned vehicles
router.use(protect);
router.use(driver);

router.route('/')
    .get(getMyVehicles)
    .post(addVehicle);

router.route('/:id')
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;
