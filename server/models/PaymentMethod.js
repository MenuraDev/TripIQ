import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const PaymentMethod = sequelize.define('PaymentMethod', {
    payment_method_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    method_type: {
        type: DataTypes.ENUM('credit_card', 'debit_card', 'bank_transfer', 'payhere_wallet'),
        allowNull: false,
    },
    card_last_four: {
        type: DataTypes.CHAR(4),
    },
    card_brand: {
        type: DataTypes.STRING(50),
    },
    expiry_month: {
        type: DataTypes.TINYINT,
    },
    expiry_year: {
        type: DataTypes.SMALLINT,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    token: {
        type: DataTypes.STRING(500),
    },
}, {
    tableName: 'payment_methods',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

PaymentMethod.associate = (models) => {
    PaymentMethod.belongsTo(models.User, { foreignKey: 'user_id' });
    PaymentMethod.hasMany(models.Payment, { foreignKey: 'payment_method_id' });
};

export default PaymentMethod;
