// server\routes\bookingRoutes.js
const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus, cancelBooking, getBookingById } = require('../controllers/bookingController');
const { protect, driver } = require('../middleware/authMiddleware');

router.use(protect);

// Driver routes
router.get('/my', driver, getMyBookings);
router.put('/:id/status', driver, updateBookingStatus);

// Tourist route to create, get, or cancel a booking
router.post('/', createBooking);
router.get('/:id', getBookingById);
router.delete('/:id', cancelBooking);

module.exports = router;
