// server\routes\destinationRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
    getFavorites,
    toggleFavorite
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDestinations);

// Tourist routes
router.get('/favorites', protect, getFavorites);
router.post('/:id/toggle-favorite', protect, toggleFavorite);

router.get('/:id', getDestinationById);


// Admin-only routes
router.post('/', protect, admin, createDestination);
router.put('/:id', protect, admin, updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
