import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Specialty = sequelize.define('specialty', {
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
  timestamps: false,
  tableName: 'specialties'
});

export default Specialty;