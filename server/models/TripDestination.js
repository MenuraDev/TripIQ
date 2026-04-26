// server\models\TripDestination.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TripDestination = sequelize.define('TripDestination', {
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
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'destinations',
            key: 'id',
        }
    },
    day_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    visit_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    }
}, {
    tableName: 'trip_destinations',
    timestamps: false, // Usually associative tables might not need timestamps, but keeping it unified could be good.
});

module.exports = TripDestination;
