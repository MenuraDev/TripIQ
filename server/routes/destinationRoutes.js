// server\routes\destinationRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    getAllDestinations,
    getDestinationById,
    createDestination,
    bulkUploadDestinations,
    updateDestination,
    deleteDestination,
    getFavorites,
    toggleFavorite
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');

// Storage configuration for CSV uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/csv/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadCSV = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
        const extname = /\.csv$/.test(path.extname(file.originalname).toLowerCase());

        if (extname && allowedMimeTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new Error('Only CSV files are allowed!'));
    }
});

// Route to download template
router.get('/template', (req, res) => {
    const templatePath = path.join(__dirname, '..', 'uploads', 'csv', 'Add_Destination_Template.csv');
    if (fs.existsSync(templatePath)) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="Add_Destination_Template.csv"');
        fs.createReadStream(templatePath).pipe(res);
    } else {
        res.status(404).json({ message: 'Template not found' });
    }
});

// Public routes
router.get('/', getAllDestinations);

// Tourist routes
router.get('/favorites', protect, getFavorites);
router.post('/:id/toggle-favorite', protect, toggleFavorite);

router.get('/:id', getDestinationById);


// Admin-only routes
router.post('/', protect, admin, createDestination);
router.post('/bulk-upload', protect, admin, uploadCSV.single('csvFile'), bulkUploadDestinations);
router.put('/:id', protect, admin, updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
