import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AppointmentState = sequelize.define('appointment_state', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  timestamps: false
});

export default AppointmentState;