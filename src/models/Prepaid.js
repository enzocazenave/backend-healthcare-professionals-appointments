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
  }
}, {
  timestamps: false
});

export default Prepaid;