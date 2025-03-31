import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(15),
    allowNull: false
  }
}, {
  timestamps: false
});

Role.sync()
  .then(() => {
    return Role.findOrCreate({
      where: {
        name: 'PATIENT'
      },
    })
  })
  .then(() => {
    return Role.findOrCreate({
      where: {
        name: 'PROFESSIONAL'
      },
    })
  })
  .then(() => {
    return Role.findOrCreate({
      where: {
        name: 'ADMIN'
      },
    })
  })
  .catch((err) => {
    console.error(err);
  });

export default Role;