const express = require('express');
const router = express.Router();
const { recommendPlaces, generateItinerary } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Workflow steps
router.post('/recommend-places', protect, authorizeRoles('tourist'), recommendPlaces);
router.post('/generate-itinerary', protect, authorizeRoles('tourist'), generateItinerary);

module.exports = router;
