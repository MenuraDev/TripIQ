import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    payment_method_id: {
        type: DataTypes.INTEGER,
    },
    gateway: {
        type: DataTypes.STRING(50),
        defaultValue: 'PayHere',
    },
    gateway_txn_id: {
        type: DataTypes.STRING(255),
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.CHAR(3),
        defaultValue: 'LKR',
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
    },
    paid_at: {
        type: DataTypes.DATE,
    },
    refund_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00,
    },
    refunded_at: {
        type: DataTypes.DATE,
    },
    receipt_url: {
        type: DataTypes.STRING(500),
    },
    gateway_response: {
        type: DataTypes.JSON,
    },
}, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, { foreignKey: 'booking_id' });
    Payment.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id' });
};

export default Payment;
