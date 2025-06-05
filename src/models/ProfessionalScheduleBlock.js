import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import formatTimeIfNecessary from '../utils/formatTimeIfNecessary.js';

const ProfessionalScheduleBlock = sequelize.define('professional_schedule_block', {
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
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'professional_schedule_blocks'
});

ProfessionalScheduleBlock.belongsTo(User, { foreignKey: 'professional_id' });

export default ProfessionalScheduleBlock;