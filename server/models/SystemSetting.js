import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const SystemSetting = sequelize.define('SystemSetting', {
    setting_key: {
        type: DataTypes.STRING(100),
        primaryKey: true,
    },
    setting_value: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(500),
    },
    updated_by: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'system_settings',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
});

SystemSetting.associate = (models) => {
    SystemSetting.belongsTo(models.Admin, { foreignKey: 'updated_by' });
};

export default SystemSetting;
