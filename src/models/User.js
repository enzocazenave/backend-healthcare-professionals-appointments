import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Role from './Role.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  dni: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  push_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true
});

User.belongsTo(Role, { foreignKey: 'role_id' });

export default User;