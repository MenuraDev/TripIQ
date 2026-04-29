// server\controllers\destinationController.js
const { Destination, UserFavorite } = require('../models');
const fs = require('fs');
const csv = require('csv-parser');


// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching destination', error: error.message });
    }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Admin
const createDestination = async (req, res) => {
    try {
        const { name, category, district, lat, lng, description, image_url } = req.body;

        const newDestination = await Destination.create({
            name,
            category,
            district,
            lat,
            lng,
            description,
            image_url
        });

        res.status(201).json(newDestination);
    } catch (error) {
        res.status(500).json({ message: 'Error creating destination', error: error.message });
    }
};

// @desc    Bulk create destinations from CSV
// @route   POST /api/destinations/bulk-upload
// @access  Admin
const bulkUploadDestinations = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No CSV file uploaded' });
        }

        const results = [];
        const errors = [];
        const validDistricts = [
            'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
            'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
            'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
            'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
            'Moneragala', 'Ratnapura', 'Kegalle'
        ];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', async () => {
                const createdDestinations = [];

                for (let i = 0; i < results.length; i++) {
                    const row = results[i];
                    const rowNum = i + 2; // Excel row number (header is row 1)

                    // Validate required fields
                    if (!row.name || !row.name.trim()) {
                        errors.push({ row: rowNum, field: 'name', message: 'Name is required' });
                        continue;
                    }

                    if (!row.district || !row.district.trim()) {
                        errors.push({ row: rowNum, field: 'district', message: 'District is required' });
                        continue;
                    }

                    // Validate district
                    const normalizedDistrict = row.district.trim();
                    if (!validDistricts.includes(normalizedDistrict)) {
                        errors.push({
                            row: rowNum,
                            field: 'district',
                            message: `Invalid district. Must be one of: ${validDistricts.join(', ')}`
                        });
                        continue;
                    }

                    try {
                        const newDestination = await Destination.create({
                            name: row.name.trim(),
                            category: row.category ? row.category.trim() : '',
                            district: normalizedDistrict,
                            lat: row.lat ? parseFloat(row.lat) : null,
                            lng: row.lng ? parseFloat(row.lng) : null,
                            description: row.description ? row.description.trim() : '',
                            image_url: row.image_url ? row.image_url.trim() : ''
                        });
                        createdDestinations.push(newDestination);
                    } catch (err) {
                        errors.push({ row: rowNum, field: 'database', message: err.message });
                    }
                }

                // Clean up uploaded file
                fs.unlinkSync(req.file.path);

                if (errors.length > 0) {
                    return res.status(400).json({
                        message: 'Bulk upload completed with errors',
                        created: createdDestinations.length,
                        errors: errors
                    });
                }

                res.status(201).json({
                    message: 'All destinations uploaded successfully',
                    created: createdDestinations.length,
                    destinations: createdDestinations
                });
            });
    } catch (error) {
        res.status(500).json({ message: 'Error processing CSV file', error: error.message });
    }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Admin
const updateDestination = async (req, res) => {
    try {
        const { name, category, district, lat, lng, description, image_url } = req.body;

        const destination = await Destination.findByPk(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        await destination.update({
            name,
            category,
            district,
            lat,
            lng,
            description,
            image_url
        });

        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: 'Error updating destination', error: error.message });
    }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Admin
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByPk(req.params.id);

        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }

        await destination.destroy();

        res.json({ message: 'Destination removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting destination', error: error.message });
    }
};

// @desc    Get user favorite destinations
// @route   GET /api/destinations/favorites
// @access  Tourist
const getFavorites = async (req, res) => {
    try {
        const favorites = await UserFavorite.findAll({
            where: { user_id: req.user.id },
            include: [Destination]
        });
        res.json(favorites.map(f => f.Destination));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
};

// @desc    Toggle favorite destination
// @route   POST /api/destinations/:id/toggle-favorite
// @access  Tourist
const toggleFavorite = async (req, res) => {
    try {
        const destination_id = req.params.id;
        const user_id = req.user.id;

        const existing = await UserFavorite.findOne({ where: { user_id, destination_id } });

        if (existing) {
            await existing.destroy();
            return res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            await UserFavorite.create({ user_id, destination_id });
            return res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error toggling favorite', error: error.message });
    }
};


module.exports = {
    getAllDestinations,
    getDestinationById,
    createDestination,
    bulkUploadDestinations,
    updateDestination,
    deleteDestination,
    getFavorites,
    toggleFavorite
};

