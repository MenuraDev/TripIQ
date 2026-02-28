import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const DestinationImage = sequelize.define('DestinationImage', {
    image_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    destination_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    alt_text: {
        type: DataTypes.STRING(255),
    },
    caption: {
        type: DataTypes.STRING(500),
    },
    display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'destination_images',
    timestamps: true,
    createdAt: 'uploaded_at',
    updatedAt: false,
});

DestinationImage.associate = (models) => {
    DestinationImage.belongsTo(models.Destination, { foreignKey: 'destination_id' });
};

export default DestinationImage;
