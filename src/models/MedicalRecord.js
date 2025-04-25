import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const MedicalRecord = sequelize.define('medical_record', {
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
  record: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: true,
  deletedAt: false,
  updatedAt: false,
  tableName: 'medical_records'
});

MedicalRecord.belongsTo(User, { foreignKey: 'professional_id', as: 'professional' });
MedicalRecord.belongsTo(User, { foreignKey: 'patient_id', as: 'patient' });

export default MedicalRecord;