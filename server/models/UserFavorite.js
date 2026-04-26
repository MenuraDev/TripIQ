const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserFavorite = sequelize.define('UserFavorite', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'user_favorites',
    timestamps: true,
});

module.exports = UserFavorite;
