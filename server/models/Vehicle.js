import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Vehicle = sequelize.define('Vehicle', {
    vehicle_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    make: {
        type: DataTypes.STRING(100),
    },
    model: {
        type: DataTypes.STRING(100),
    },
    year: {
        type: DataTypes.INTEGER(4),
    },
    plate_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    color: {
        type: DataTypes.STRING(50),
    },
    ac_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    image_url: {
        type: DataTypes.STRING(500),
    },
    rate_per_km: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    rate_per_day: {
        type: DataTypes.DECIMAL(10, 2),
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'vehicles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.Driver, { foreignKey: 'driver_id' });
    Vehicle.belongsTo(models.VehicleType, { foreignKey: 'vehicle_type_id' });
    Vehicle.hasMany(models.Booking, { foreignKey: 'vehicle_id' });
};

export default Vehicle;
