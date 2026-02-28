import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../db.js';

const Admin = sequelize.define('Admin', {
    admin_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(20),
    },
    profile_image: {
        type: DataTypes.STRING(500),
    },
    access_level: {
        type: DataTypes.ENUM('super_admin', 'moderator', 'support'),
        allowNull: false,
        defaultValue: 'moderator',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    last_login_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Admin.associate = (models) => {
    Admin.hasMany(models.AdminAuditLog, { foreignKey: 'admin_id' });
    Admin.hasMany(models.SystemSetting, { foreignKey: 'updated_by' });
};

// eslint-disable-next-line func-names
Admin.prototype.checkPassword = async function (password) {
    const match = await bcrypt.compare(password, this.password_hash);
    return match;
};

Admin.beforeCreate(async (admin) => {
    if (admin.password_hash) {
        const salt = await bcrypt.genSalt(10);
        // eslint-disable-next-line no-param-reassign
        admin.password_hash = await bcrypt.hash(admin.password_hash, salt);
    }
});

export default Admin;
