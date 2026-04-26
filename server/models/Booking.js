// server\models\Booking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'trips',
            key: 'id',
        }
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'id',
        }
    },
    vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vehicles',
            key: 'id',
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed'),
        defaultValue: 'pending',
    }
}, {
    tableName: 'bookings',
    timestamps: true,
});

module.exports = Booking;
