require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { syncDB } = require('./models');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Database
connectDB().then(() => {
    syncDB();
});

// Basic Health Route
app.get('/', (req, res) => {
    res.send('SurangaTours API is running...');
});

// Routes
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
