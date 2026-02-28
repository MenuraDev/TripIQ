import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ItineraryRecommendation = sequelize.define('ItineraryRecommendation', {
    recommendation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    itinerary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    similarity_score: {
        type: DataTypes.DECIMAL(5, 4),
    },
    cluster_id: {
        type: DataTypes.INTEGER,
    },
    is_accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'itinerary_recommendations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

ItineraryRecommendation.associate = (models) => {
    ItineraryRecommendation.belongsTo(models.Itinerary, { foreignKey: 'itinerary_id' });
    ItineraryRecommendation.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default ItineraryRecommendation;
