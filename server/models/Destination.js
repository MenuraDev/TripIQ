// server\models\Destination.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Destination = sequelize.define('Destination', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    }
}, {
    tableName: 'destinations',
    timestamps: true,
});

module.exports = Destination;
