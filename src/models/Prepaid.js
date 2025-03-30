import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Prepaid = sequelize.define('prepaid', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  plan: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false
});

export default Prepaid;