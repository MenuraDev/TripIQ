// server\controllers\bookingController.js
const { Booking, Trip, User, Vehicle, Payment, Driver } = require('../models');

// @desc    Create a booking for a trip
// @route   POST /api/bookings
// @access  Tourist
const createBooking = async (req, res) => {
    try {
        const { trip_id, vehicle_id } = req.body;

        const trip = await Trip.findByPk(trip_id);
        const vehicle = await Vehicle.findByPk(vehicle_id);

        if (!trip || !vehicle) {
            return res.status(404).json({ message: 'Trip or Vehicle not found' });
        }

        // Calculate trip duration in days
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

        // Total Cost Calculation: (Vehicle Price * Days) + (Optional: Group Size multiplier/fee)
        // For now, simpler calculation: Vehicle price * Days
        const vehicleCost = vehicle.price_per_day * diffDays;

        // Base flat fee per person for group sizes
        const perPersonFee = 50;
        // Verify driver existence
        const driver = await Driver.findByPk(vehicle.driver_id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver associated with this vehicle not found' });
        }

        const totalCost = vehicleCost + (perPersonFee * trip.group_size);

        const driverId = parseInt(vehicle.driver_id);
        const vehicleId = parseInt(vehicle_id);
        const tripId = parseInt(trip_id);

        console.log(`[DEBUG] createBooking - Attempting creation: TripID=${tripId}, DriverID=${driverId}, VehicleID=${vehicleId}`);

        const newBooking = await Booking.create({
            trip_id: tripId,
            driver_id: driverId,
            vehicle_id: vehicleId,
            status: 'pending'
        });

        console.log(`[DEBUG] createBooking - Success: BookingID=${newBooking.id}`);

        // Update trip status to pending driver assignment
        await trip.update({
            total_cost: totalCost,
            status: 'pending'
        });

        // Create initial Payment draft
        const payment = await Payment.create({
            booking_id: newBooking.id,
            amount: totalCost,
            status: 'draft'
        });

        res.status(201).json({ booking: newBooking, payment: payment, total_cost: totalCost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// @desc    Cancel a booking (by Tourist)
// @route   DELETE /api/bookings/:id
// @access  Tourist
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [{ model: Trip }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.Trip.user_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to cancel this booking' });
        }

        // Only allow cancellation if not already completed
        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }

        await booking.update({ status: 'cancelled' });

        // Reset trip status to planned
        await Trip.update({ status: 'planned' }, { where: { id: booking.trip_id } });

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
};

// @desc    Get all bookings for logged-in driver
// @route   GET /api/bookings/my
// @access  Driver
const getMyBookings = async (req, res) => {
    try {
        const driverId = parseInt(req.user.id);
        console.log(`[DEBUG] getMyBookings - Fetching for Driver ID: ${driverId} (Type: ${typeof driverId})`);

        const bookings = await Booking.findAll({
            where: { driver_id: driverId },
            include: [
                {
                    model: Trip,
                    include: [{ model: User, attributes: ['name', 'phone'] }]
                },
                { model: Vehicle, attributes: ['type'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`[DEBUG] getMyBookings - Found ${bookings.length} bookings for Driver ID: ${driverId}`);
        res.json(bookings);
    } catch (error) {
        console.error(`[ERROR] getMyBookings: ${error.message}`);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// @desc    Update a booking's status
// @route   PUT /api/bookings/:id/status
// @access  Driver
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.driver_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this booking' });
        }

        await booking.update({ status });

        // If booking is accepted, the trip is now confirmed and ready for payment
        if (status === 'accepted') {
            await Trip.update({ status: 'confirmed' }, { where: { id: booking.trip_id } });
        } else if (status === 'rejected' || status === 'cancelled') {
            await Trip.update({ status: 'planned' }, { where: { id: booking.trip_id } });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Tourist
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: Trip,
                    include: [{ model: User, attributes: ['name', 'phone', 'email'] }]
                },
                { model: Vehicle },
                { model: Driver, attributes: ['name', 'phone'] }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.Trip.user_id != req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    updateBookingStatus,
    cancelBooking,
    getBookingById
};
