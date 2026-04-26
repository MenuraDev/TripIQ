const { Vehicle, Driver } = require('../models');

// @desc    Get all vehicles (public)
// @route   GET /api/vehicles/all
// @access  Public
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: { status: 'active' },
            include: [{ model: Driver, attributes: ['name', 'phone', 'license_no'] }]
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all vehicles', error: error.message });
    }
};

// @desc    Get all vehicles for logged-in driver
// @route   GET /api/vehicles
// @access  Driver
const getMyVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({
            where: { driver_id: req.user.id }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Driver
const addVehicle = async (req, res) => {
    try {
        const { type, capacity, price_per_day, condition, image_url } = req.body;

        if (!price_per_day || price_per_day <= 0) {
            return res.status(400).json({ message: "Price per day must be a positive number" });
        }

        if (capacity !== undefined && capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be a positive number" });
        }

        const newVehicle = await Vehicle.create({
            driver_id: req.user.id,
            type,
            capacity,
            price_per_day,
            condition,
            image_url,
            status: 'active'
        });

        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error adding vehicle', error: error.message });
    }
};

// @desc    Update vehicle availability/details
// @route   PUT /api/vehicles/:id
// @access  Driver
const updateVehicle = async (req, res) => {
    try {
        const { type, capacity, price_per_day, status, condition, image_url } = req.body;

        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicle.driver_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this vehicle' });
        }

        if (price_per_day !== undefined && price_per_day <= 0) {
            return res.status(400).json({ message: "Price per day must be a positive number" });
        }

        if (capacity !== undefined && capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be a positive number" });
        }

        await vehicle.update({
            type: type !== undefined ? type : vehicle.type,
            capacity: capacity !== undefined ? capacity : vehicle.capacity,
            price_per_day: price_per_day !== undefined ? price_per_day : vehicle.price_per_day,
            status: status !== undefined ? status : vehicle.status,
            condition: condition !== undefined ? condition : vehicle.condition,
            image_url: image_url !== undefined ? image_url : vehicle.image_url
        });

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Driver
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (vehicle.driver_id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this vehicle' });
        }

        await vehicle.destroy();

        res.json({ message: 'Vehicle removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};

module.exports = {
    getAllVehicles,
    getMyVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
};