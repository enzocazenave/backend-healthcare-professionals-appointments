import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const ProfessionalSchedule = sequelize.define('professional_schedule', {
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
  day_of_week: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']],
        msg: 'DAY_OF_WEEK_IS_INVALID'
      }
    }
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    get() {
      const value = this.getDataValue('start_time');

      if (typeof value === 'string') {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
      }

      return value;
    }
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    get() {
      const value = this.getDataValue('end_time');

      if (typeof value === 'string') {
        const [hours, minutes, seconds] = value.split(':').map(Number);
        return new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds));
      }

      return value;
    }
  },
  appointment_duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        args: true,
        msg: 'APPOINTMENT_DURATION_IS_INVALID'
      },
      min: {
        args: 1,
        msg: 'APPOINTMENT_DURATION_IS_TOO_SHORT'
      }
    }
  }
}, {
  timestamps: false,
  tableName: 'professional_schedules'
});

ProfessionalSchedule.belongsTo(User, { foreignKey: 'professional_id' });

export default ProfessionalSchedule;