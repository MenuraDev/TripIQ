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
    },
    // ML/cluster enrichment fields (populated by seed script)
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cluster_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cluster_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    terrain_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time_needed_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'destinations',
    timestamps: true,
});

module.exports = Destination;
