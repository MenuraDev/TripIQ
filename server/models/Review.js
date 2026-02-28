import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    driver_id: {
        type: DataTypes.INTEGER,
    },
    overall_rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    driver_rating: {
        type: DataTypes.TINYINT,
        validate: {
            min: 1,
            max: 5,
        },
    },
    vehicle_rating: {
        type: DataTypes.TINYINT,
        validate: {
            min: 1,
            max: 5,
        },
    },
    itinerary_rating: {
        type: DataTypes.TINYINT,
        validate: {
            min: 1,
            max: 5,
        },
    },
    title: {
        type: DataTypes.STRING(255),
    },
    comment: {
        type: DataTypes.TEXT,
    },
    is_draft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Review.associate = (models) => {
    Review.belongsTo(models.Booking, { foreignKey: 'booking_id' });
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
    Review.belongsTo(models.Driver, { foreignKey: 'driver_id' });
    Review.hasMany(models.ReviewDestination, { foreignKey: 'review_id' });
};

export default Review;
