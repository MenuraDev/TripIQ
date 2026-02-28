import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const VehicleType = sequelize.define('VehicleType', {
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    max_passengers: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_luggage_kg: {
        type: DataTypes.DECIMAL(6, 2),
    },
    description: {
        type: DataTypes.TEXT,
    },
    icon: {
        type: DataTypes.STRING(255),
    },
}, {
    tableName: 'vehicle_types',
    timestamps: false,
});

VehicleType.associate = (models) => {
    VehicleType.hasMany(models.Vehicle, { foreignKey: 'vehicle_type_id' });
};

export default VehicleType;
