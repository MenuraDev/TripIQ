import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    recipient_type: {
        type: DataTypes.ENUM('user', 'driver', 'admin'),
        allowNull: false,
    },
    recipient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('booking', 'payment', 'itinerary', 'review', 'system'),
        allowNull: false,
    },
    reference_type: {
        type: DataTypes.STRING(50),
    },
    reference_id: {
        type: DataTypes.INTEGER,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

export default Notification;
