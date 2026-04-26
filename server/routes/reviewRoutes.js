// server\routes\reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getAllReviews, createReview, getMyReviews, getDriverReviews, updateReview, deleteReview, moderateReview, getPublicReviews } = require('../controllers/reviewController');
const { protect, admin, tourist } = require('../middleware/authMiddleware');

// Public routes
router.get('/public', getPublicReviews);
router.get('/driver/:id', getDriverReviews);

// Admin routes
router.get('/', protect, admin, getAllReviews);
router.put('/:id/moderate', protect, admin, moderateReview);

// Tourist routes
router.post('/', protect, tourist, createReview);
router.get('/my', protect, tourist, getMyReviews);
router.put('/:id', protect, tourist, updateReview);

// Mixed access (Admin or the user who created it)
router.delete('/:id', protect, deleteReview);

module.exports = router;
