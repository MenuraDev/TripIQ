import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const UserPreference = sequelize.define('UserPreference', {
    preference_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.50,
    },
}, {
    tableName: 'user_preferences',
    timestamps: false,
});

UserPreference.associate = (models) => {
    UserPreference.belongsTo(models.User, { foreignKey: 'user_id' });
    UserPreference.belongsTo(models.Category, { foreignKey: 'category_id' });
};

export default UserPreference;
