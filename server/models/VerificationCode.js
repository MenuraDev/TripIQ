// server\models\VerificationCode.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VerificationCode = sequelize.define('VerificationCode', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.ENUM('forgot_password', 'change_password', 'registration'),
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'verification_codes',
    timestamps: true,
});

module.exports = VerificationCode;
