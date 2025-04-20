import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Prepaid from './Prepaid.js';

const PrepaidAffiliation = sequelize.define('prepaid_affiliation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  prepaid_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'prepaids',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  plan: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  }
})

PrepaidAffiliation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
PrepaidAffiliation.belongsTo(Prepaid, { foreignKey: 'prepaid_id', onDelete: 'CASCADE' });

export default PrepaidAffiliation;