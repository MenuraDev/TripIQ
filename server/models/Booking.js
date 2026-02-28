import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itinerary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    driver_id: {
        type: DataTypes.INTEGER,
    },
    vehicle_id: {
        type: DataTypes.INTEGER,
    },
    pickup_location: {
        type: DataTypes.STRING(500),
    },
    pickup_latitude: {
        type: DataTypes.DECIMAL(10, 8),
    },
    pickup_longitude: {
        type: DataTypes.DECIMAL(11, 8),
    },
    pickup_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dropoff_datetime: {
        type: DataTypes.DATE,
    },
    total_distance_km: {
        type: DataTypes.DECIMAL(10, 2),
    },
    base_fare: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Booking.associate = (models) => {
    Booking.belongsTo(models.Itinerary, { foreignKey: 'itinerary_id' });
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    Booking.belongsTo(models.Driver, { foreignKey: 'driver_id' });
    Booking.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id' });
    Booking.hasOne(models.Payment, { foreignKey: 'booking_id' });
    Booking.hasOne(models.Review, { foreignKey: 'booking_id' });
};

export default Booking;
