import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Driver = sequelize.define('Driver', {
    driver_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    license_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    profile_image: {
        type: DataTypes.STRING(500),
    },
    base_location: {
        type: DataTypes.STRING(255),
    },
    base_latitude: {
        type: DataTypes.DECIMAL(10, 8),
    },
    base_longitude: {
        type: DataTypes.DECIMAL(11, 8),
    },
    avg_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
    },
    total_trips: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'drivers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Driver.associate = (models) => {
    Driver.hasMany(models.Vehicle, { foreignKey: 'driver_id' });
    Driver.hasMany(models.DriverAvailability, { foreignKey: 'driver_id' });
    Driver.hasMany(models.Booking, { foreignKey: 'driver_id' });
    Driver.hasMany(models.Review, { foreignKey: 'driver_id' });
};

export default Driver;
