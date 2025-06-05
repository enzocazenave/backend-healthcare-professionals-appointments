import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Specialty from './Specialty.js';
import AppointmentState from './AppointmentState.js';

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
    type: DataTypes.DATE,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    get() {
      return formatTimeIfNecessary(this.getDataValue('start_time'));
    }
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    get() {
      return formatTimeIfNecessary(this.getDataValue('end_time'));
    }
  },
  appointment_state_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'appointment_states',
      key: 'id'
    }
  },
}, {
  timestamps: false,
  tableName: 'appointments'
});

Appointment.belongsTo(AppointmentState, { foreignKey: 'appointment_state_id' });
Appointment.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });
Appointment.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });
Appointment.belongsTo(Specialty, { foreignKey: 'specialty_id' });

export default Appointment;