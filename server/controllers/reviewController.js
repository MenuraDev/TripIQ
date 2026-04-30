// server\controllers\reviewController.js
const { Review, User, Driver, Destination, Trip } = require('../models');
const { createNotification } = require('./notificationController');

// @desc    Get all reviews (for Admin)
// @route   GET /api/reviews
// @access  Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Driver, attributes: ['name'] },
                { model: Destination, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Tourist
const createReview = async (req, res) => {
    try {
        let { rating, comment, driver_id, destination_id, trip_id } = req.body;

        // Convert empty strings to null for database integrity
        driver_id = driver_id === '' ? null : driver_id;
        destination_id = destination_id === '' ? null : destination_id;
        trip_id = trip_id === '' ? null : trip_id;

        // Validate Trip Ownership and Status
        if (trip_id) {
            const trip = await Trip.findOne({ 
                where: { id: trip_id, user_id: req.user.id } 
            });
            
            if (!trip) {
                return res.status(403).json({ message: 'Unauthorized: You can only review your own trips.' });
            }
            if (trip.status !== 'completed' && trip.status !== 'paid') {
                return res.status(400).json({ message: 'You can only review trips that are completed.' });
            }
        }

        const review = await Review.create({
            user_id: req.user.id,
            driver_id,
            destination_id,
            trip_id,
            rating,
            comment
        });

        // Fetch with associations to return to frontend
        const reviewWithAssoc = await Review.findByPk(review.id, {
            include: [
                { model: Driver, attributes: ['name'] },
                { model: Destination, attributes: ['name'] }
            ]
        });

        res.status(201).json(reviewWithAssoc);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

// @desc    Get reviews by specific logged-in user
// @route   GET /api/reviews/my
// @access  Tourist
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { user_id: req.user.id },
            include: [
                { model: Driver, attributes: ['name'] },
                { model: Destination, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
    }
};

// @desc    Get reviews for a specific driver
// @route   GET /api/reviews/driver/:id
// @access  Public
const getDriverReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { driver_id: req.params.id },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching driver reviews', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Admin, Tourist (own review)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // If not admin, check if user owns the review
        if (req.user.role !== 'admin' && review.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this review' });
        }

        await review.destroy();
        res.json({ message: 'Review removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Tourist (own review)
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.status = 'pending';

        await review.save();

        // Fetch with associations to return to frontend
        const updatedReview = await Review.findByPk(review.id, {
            include: [
                { model: Driver, attributes: ['name'] },
                { model: Destination, attributes: ['name'] }
            ]
        });

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

// @desc    Moderate a review (Accept/Reject)
// @route   PUT /api/reviews/:id/moderate
// @access  Admin
const moderateReview = async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const previousStatus = review.status;
        review.status = status;
        await review.save();

        // Create notification if review was rejected
        if (status === 'rejected' && previousStatus !== 'rejected') {
            await createNotification(
                review.user_id,
                'review_rejected',
                `Your review has been rejected by our admin team.`,
                review.id
            );
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error moderating review', error: error.message });
    }
};

// @desc    Get accepted public reviews for Homepage
// @route   GET /api/reviews/public
// @access  Public
const getPublicReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { status: 'accepted' },
            include: [{ model: User, attributes: ['name', 'profile_image'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public reviews', error: error.message });
    }
};

module.exports = {
    getAllReviews,
    createReview,
    getMyReviews,
    getDriverReviews,
    updateReview,
    deleteReview,
    moderateReview,
    getPublicReviews
};
