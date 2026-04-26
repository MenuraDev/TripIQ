// server/routes/mlRoutes.js
const express = require('express');
const router  = express.Router();
const { mlRecommend } = require('../controllers/mlRecommendController');
const { protect }     = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// POST /api/ml/recommend
// Calls Python ML → Haversine cluster selection → returns clusters + places
router.post('/recommend', protect, authorizeRoles('tourist'), mlRecommend);

module.exports = router;
