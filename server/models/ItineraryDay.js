import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ItineraryDay = sequelize.define('ItineraryDay', {
    day_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itinerary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    day_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    day_distance_km: {
        type: DataTypes.DECIMAL(10, 2),
    },
    day_cost: {
        type: DataTypes.DECIMAL(10, 2),
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'itinerary_days',
    timestamps: false,
});

ItineraryDay.associate = (models) => {
    ItineraryDay.belongsTo(models.Itinerary, { foreignKey: 'itinerary_id' });
    ItineraryDay.hasMany(models.ItineraryDayLocation, { foreignKey: 'day_id' });
};

export default ItineraryDay;
