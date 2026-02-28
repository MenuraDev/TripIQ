import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ItineraryDayLocation = sequelize.define('ItineraryDayLocation', {
    day_location_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    visit_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    arrival_time: {
        type: DataTypes.TIME,
    },
    departure_time: {
        type: DataTypes.TIME,
    },
    distance_from_prev_km: {
        type: DataTypes.DECIMAL(10, 2),
    },
    travel_time_mins: {
        type: DataTypes.INTEGER,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'itinerary_day_locations',
    timestamps: false,
});

ItineraryDayLocation.associate = (models) => {
    ItineraryDayLocation.belongsTo(models.ItineraryDay, { foreignKey: 'day_id' });
    ItineraryDayLocation.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default ItineraryDayLocation;
