// server\models\Driver.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    license_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('available', 'on_trip', 'unavailable'),
        defaultValue: 'available',
    },
    role: {
        type: DataTypes.ENUM('driver'),
        defaultValue: 'driver',
        allowNull: false,
    },
}, {
    tableName: 'drivers',
    timestamps: true,
});

module.exports = Driver;
