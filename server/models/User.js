import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../db.js';

const User = sequelize.define('User', {
  user_id: {
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
  nationality: {
    type: DataTypes.STRING(100),
  },
  profile_image: {
    type: DataTypes.STRING(500),
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

User.associate = (models) => {
  User.hasMany(models.Itinerary, { foreignKey: 'user_id' });
  User.hasMany(models.Booking, { foreignKey: 'user_id' });
  User.hasMany(models.Review, { foreignKey: 'user_id' });
  User.hasMany(models.PaymentMethod, { foreignKey: 'user_id' });
};

// eslint-disable-next-line func-names
User.prototype.checkPassword = async function (password) {
  const match = await bcrypt.compare(password, this.password_hash);
  return match;
};

User.beforeCreate(async (user) => {
  if (user.password_hash) {
    const salt = await bcrypt.genSalt(10);
    // eslint-disable-next-line no-param-reassign
    user.password_hash = await bcrypt.hash(user.password_hash, salt);
  }
});

export default User;
