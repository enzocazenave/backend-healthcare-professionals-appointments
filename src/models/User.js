import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

import Prepaid from './Prepaid.js';
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
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  prepaid_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Prepaid,
      key: 'id'
    },
    onDelete: 'SET NULL'
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

User.belongsTo(Prepaid, { foreignKey: 'prepaid_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

export default User;