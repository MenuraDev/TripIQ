// server\routes\tripRoutes.js
const express = require('express');
const router = express.Router();
const { getMyTrips, createTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect, tourist } = require('../middleware/authMiddleware');

router.use(protect);
router.use(tourist);

router.route('/')
    .get(getMyTrips)
    .post(createTrip);

router.route('/:id')
    .put(updateTrip)
    .delete(deleteTrip);

module.exports = router;
