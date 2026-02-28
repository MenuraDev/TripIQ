import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    icon: {
        type: DataTypes.STRING(255),
    },
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Schema only has created_at
});

Category.associate = (models) => {
    Category.belongsToMany(models.Destination, {
        through: models.DestinationCategory,
        foreignKey: 'category_id',
        otherKey: 'destination_id',
    });
    Category.hasMany(models.UserPreference, { foreignKey: 'category_id' });
};

export default Category;
