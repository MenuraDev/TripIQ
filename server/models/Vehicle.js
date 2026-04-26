// server\models\Vehicle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drivers',
            key: 'id',
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_per_day: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
        defaultValue: 'active',
    }
}, {
    tableName: 'vehicles',
    timestamps: true,
});

module.exports = Vehicle;
