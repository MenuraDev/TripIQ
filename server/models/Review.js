// server\models\Review.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
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
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'drivers',
            key: 'id',
        }
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'trips',
            key: 'id',
        }
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'destinations',
            key: 'id',
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    }
}, {
    tableName: 'reviews',
    timestamps: true,
});

module.exports = Review;
