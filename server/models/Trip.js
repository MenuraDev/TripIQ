// server\models\Trip.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('planned', 'pending', 'confirmed', 'completed', 'cancelled', 'paid'),
        defaultValue: 'planned',
    },
    group_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    total_cost: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    budget: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    budget_tier: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
    },
    likes_beach: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    likes_mountain: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    likes_culture: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    likes_adventure: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'trips',
    timestamps: true,
});

module.exports = Trip;
