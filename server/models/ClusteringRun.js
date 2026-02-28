import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ClusteringRun = sequelize.define('ClusteringRun', {
    run_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    k_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    algorithm: {
        type: DataTypes.STRING(50),
        defaultValue: 'K-Means',
    },
    inertia: {
        type: DataTypes.DECIMAL(15, 4),
    },
    silhouette_score: {
        type: DataTypes.DECIMAL(6, 4),
    },
}, {
    tableName: 'clustering_runs',
    timestamps: true,
    createdAt: 'run_at',
    updatedAt: false,
});

ClusteringRun.associate = (models) => {
    ClusteringRun.hasMany(models.ClusterAssignment, { foreignKey: 'run_id' });
    ClusteringRun.hasMany(models.ClusterCentroid, { foreignKey: 'run_id' });
};

export default ClusteringRun;
