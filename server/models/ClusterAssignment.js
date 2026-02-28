import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ClusterAssignment = sequelize.define('ClusterAssignment', {
    assignment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    run_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cluster_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    distance_to_centroid: {
        type: DataTypes.DECIMAL(12, 6),
    },
}, {
    tableName: 'cluster_assignments',
    timestamps: false,
});

ClusterAssignment.associate = (models) => {
    ClusterAssignment.belongsTo(models.ClusteringRun, { foreignKey: 'run_id' });
    ClusterAssignment.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default ClusterAssignment;
