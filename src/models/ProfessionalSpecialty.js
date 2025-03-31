import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Specialty from './Specialty.js';

const ProfessionalSpecialty = sequelize.define('professional_specialty', {
  professional_id: {
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
  }
}, {
  timestamps: false,
  tableName: 'professional_specialties'
});

ProfessionalSpecialty.belongsTo(User, { foreignKey: 'professional_id' });
ProfessionalSpecialty.belongsTo(Specialty, { foreignKey: 'specialty_id' });

export default ProfessionalSpecialty;