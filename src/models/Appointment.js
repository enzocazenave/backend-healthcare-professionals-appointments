import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Specialty from './Specialty.js';

const Appointment = sequelize.define('appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  professional_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  specialty_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'specialties',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Scheduled'
  },
  notes: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  timestamps: false,
  tableName: 'appointments'
});

Appointment.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });
Appointment.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
Appointment.belongsTo(Specialty, { foreignKey: 'specialty_id' });

export default Appointment;