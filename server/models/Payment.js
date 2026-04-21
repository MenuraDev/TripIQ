const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'id',
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    method: {
        type: DataTypes.ENUM('card', 'cash'),
        defaultValue: 'card',
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded', 'draft'),
        defaultValue: 'pending',
    },
    receipt_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    selected_addons: {
        type: DataTypes.TEXT, // Store as JSON string
        allowNull: true,
    }
}, {
    tableName: 'payments',
    timestamps: true,
});

module.exports = Payment;
