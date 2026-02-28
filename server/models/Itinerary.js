import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Itinerary = sequelize.define('Itinerary', {
    itinerary_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    num_travelers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    total_distance_km: {
        type: DataTypes.DECIMAL(10, 2),
    },
    estimated_cost: {
        type: DataTypes.DECIMAL(12, 2),
    },
    generation_method: {
        type: DataTypes.ENUM('ai_generated', 'user_customized', 'manual'),
        defaultValue: 'ai_generated',
    },
    status: {
        type: DataTypes.ENUM('draft', 'confirmed', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'draft',
    },
}, {
    tableName: 'itineraries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Itinerary.associate = (models) => {
    Itinerary.belongsTo(models.User, { foreignKey: 'user_id' });
    Itinerary.hasMany(models.ItineraryDay, { foreignKey: 'itinerary_id' });
    Itinerary.hasMany(models.ItineraryRecommendation, { foreignKey: 'itinerary_id' });
    Itinerary.hasOne(models.Booking, { foreignKey: 'itinerary_id' });
};

export default Itinerary;
