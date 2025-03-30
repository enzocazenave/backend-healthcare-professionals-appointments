import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PasswordResetCode = sequelize.define('password_reset_code', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expirates_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

export default PasswordResetCode;