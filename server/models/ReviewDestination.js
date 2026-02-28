import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ReviewDestination = sequelize.define('ReviewDestination', {
    review_dest_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    review_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.TINYINT,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'review_destinations',
    timestamps: false,
});

ReviewDestination.associate = (models) => {
    ReviewDestination.belongsTo(models.Review, { foreignKey: 'review_id' });
    ReviewDestination.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default ReviewDestination;
