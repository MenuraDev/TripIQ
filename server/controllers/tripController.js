// server\controllers\tripController.js
const { Trip, Destination, TripDestination, Booking, Driver, Vehicle } = require('../models');

// @desc    Get all trips for logged-in tourist
// @route   GET /api/trips
// @access  Tourist
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Destination,
                    through: { attributes: ['day_number', 'visit_order'] }
                },
                {
                    model: Booking,
                    include: [
                        { model: Driver, attributes: ['name', 'phone'] },
                        { model: Vehicle, attributes: ['type', 'price_per_day', 'image_url'] }
                    ]
                }
            ],
            order: [['start_date', 'ASC']]
        });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

// @desc    Create a new trip plan
// @route   POST /api/trips
// @access  Tourist
const createTrip = async (req, res) => {
    try {
        const { start_date, end_date, group_size, destinations, prefs } = req.body;
        // destinations should be array of objects: [{ destination_id, day_number, visit_order }]

        const newTrip = await Trip.create({
            user_id: req.user.id,
            start_date,
            end_date,
            group_size: group_size || 1,
            status: 'planned',
            budget_tier: prefs?.Budget !== undefined ? prefs.Budget : 2,
            likes_beach: prefs?.Likes_Beach || 0,
            likes_mountain: prefs?.Likes_Mountain || 0,
            likes_culture: prefs?.Likes_Culture || 0,
            likes_adventure: prefs?.Likes_Adventure || 0,
        });

        if (destinations && destinations.length > 0) {
            const tripDestinationsParams = destinations.map(dest => ({
                trip_id: newTrip.id,
                destination_id: dest.destination_id,
                day_number: dest.day_number || 1,
                visit_order: dest.visit_order || 1
            }));
            await TripDestination.bulkCreate(tripDestinationsParams);
        }

        // Fetch back the complete trip data
        const completeTrip = await Trip.findByPk(newTrip.id, {
            include: [
                {
                    model: Destination,
                    through: { attributes: ['day_number', 'visit_order'] }
                },
                {
                    model: Booking,
                    include: [
                        { model: Driver, attributes: ['name', 'phone'] },
                        { model: Vehicle, attributes: ['type', 'price_per_day', 'image_url'] }
                    ]
                }
            ]
        });

        res.status(201).json(completeTrip);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip', error: error.message });
    }
};

// @desc    Update trip (only before confirmation/payment)
// @route   PUT /api/trips/:id
// @access  Tourist
const updateTrip = async (req, res) => {
    try {
        const { start_date, end_date, group_size, destinations, status, prefs } = req.body;

        const trip = await Trip.findByPk(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to modify this trip' });
        }

        if (trip.status !== 'planned') {
            return res.status(400).json({ message: 'Cannot modify a trip that is already confirmed or completed' });
        }

        await trip.update({
            start_date: start_date || trip.start_date,
            end_date: end_date || trip.end_date,
            group_size: group_size || trip.group_size,
            status: status || trip.status,
            budget_tier: prefs?.Budget !== undefined ? prefs.Budget : trip.budget_tier,
            likes_beach: prefs?.Likes_Beach !== undefined ? prefs.Likes_Beach : trip.likes_beach,
            likes_mountain: prefs?.Likes_Mountain !== undefined ? prefs.Likes_Mountain : trip.likes_mountain,
            likes_culture: prefs?.Likes_Culture !== undefined ? prefs.Likes_Culture : trip.likes_culture,
            likes_adventure: prefs?.Likes_Adventure !== undefined ? prefs.Likes_Adventure : trip.likes_adventure,
        });

        // Update destinations if provided (basic implementation replacing old ones)
        if (destinations) {
            await TripDestination.destroy({ where: { trip_id: trip.id } });
            if (destinations.length > 0) {
                const tripDestinationsParams = destinations.map(dest => ({
                    trip_id: trip.id,
                    destination_id: dest.destination_id,
                    day_number: dest.day_number || 1,
                    visit_order: dest.visit_order || 1
                }));
                await TripDestination.bulkCreate(tripDestinationsParams);
            }
        }

        const completeTrip = await Trip.findByPk(trip.id, {
            include: [
                {
                    model: Destination,
                    through: { attributes: ['day_number', 'visit_order'] }
                },
                {
                    model: Booking,
                    include: [
                        { model: Driver, attributes: ['name', 'phone'] },
                        { model: Vehicle, attributes: ['type', 'price_per_day', 'image_url'] }
                    ]
                }
            ]
        });

        res.json(completeTrip);
    } catch (error) {
        res.status(500).json({ message: 'Error updating trip', error: error.message });
    }
};

// @desc    Cancel/delete trip
// @route   DELETE /api/trips/:id
// @access  Tourist
const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByPk(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this trip' });
        }

        // Delete associations
        await TripDestination.destroy({ where: { trip_id: trip.id } });
        // Bookings/Payments deleted by CASCADE if set up, or handle manually if needed.

        await trip.destroy();

        res.json({ message: 'Trip cancelled and removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trip', error: error.message });
    }
};

module.exports = {
    getMyTrips,
    createTrip,
    updateTrip,
    deleteTrip
};
