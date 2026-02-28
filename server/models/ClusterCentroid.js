import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ClusterCentroid = sequelize.define('ClusterCentroid', {
    centroid_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    run_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cluster_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    centroid_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    centroid_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
}, {
    tableName: 'cluster_centroids',
    timestamps: false,
});

ClusterCentroid.associate = (models) => {
    ClusterCentroid.belongsTo(models.ClusteringRun, { foreignKey: 'run_id' });
};

export default ClusterCentroid;
