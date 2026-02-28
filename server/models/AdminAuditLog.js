import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const AdminAuditLog = sequelize.define('AdminAuditLog', {
    log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    entity_type: {
        type: DataTypes.STRING(50),
    },
    entity_id: {
        type: DataTypes.INTEGER,
    },
    old_value: {
        type: DataTypes.JSON,
    },
    new_value: {
        type: DataTypes.JSON,
    },
    ip_address: {
        type: DataTypes.STRING(45),
    },
}, {
    tableName: 'admin_audit_log',
    timestamps: true,
    createdAt: 'performed_at',
    updatedAt: false,
});

AdminAuditLog.associate = (models) => {
    AdminAuditLog.belongsTo(models.Admin, { foreignKey: 'admin_id' });
};

export default AdminAuditLog;
