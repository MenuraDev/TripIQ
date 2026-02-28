import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DestinationCategory = sequelize.define('DestinationCategory', {
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    relevance_score: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 1.00,
    },
}, {
    tableName: 'destination_categories',
    timestamps: false,
});

export default DestinationCategory;
