// server\models\User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('tourist'),
        defaultValue: 'tourist',
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: true, // creates created_at & updated_at automatically
});

module.exports = User;
