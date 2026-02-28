import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DriverAvailability = sequelize.define('DriverAvailability', {
    availability_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'driver_availability',
    timestamps: false,
});

DriverAvailability.associate = (models) => {
    DriverAvailability.belongsTo(models.Driver, { foreignKey: 'driver_id' });
};

export default DriverAvailability;
