import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Destination = sequelize.define('Destination', {
    destination_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    province: {
        type: DataTypes.STRING(100),
    },
    district: {
        type: DataTypes.STRING(100),
    },
    address: {
        type: DataTypes.STRING(500),
    },
    avg_visit_hours: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 2.00,
    },
    entrance_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    cluster_id: {
        type: DataTypes.INTEGER,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'destinations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Destination.associate = (models) => {
    Destination.hasMany(models.DestinationImage, { foreignKey: 'destination_id' });
    Destination.belongsToMany(models.Category, {
        through: models.DestinationCategory,
        foreignKey: 'destination_id',
        otherKey: 'category_id',
    });
    Destination.hasOne(models.DestinationFeature, { foreignKey: 'destination_id' });
    Destination.hasMany(models.ItineraryDayLocation, { foreignKey: 'destination_id' });
    Destination.hasMany(models.ItineraryRecommendation, { foreignKey: 'destination_id' });
};

export default Destination;
