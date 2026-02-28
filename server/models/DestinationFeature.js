import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DestinationFeature = sequelize.define('DestinationFeature', {
    destination_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    feature_vector: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    tableName: 'destination_features',
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_computed',
});

DestinationFeature.associate = (models) => {
    DestinationFeature.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default DestinationFeature;
